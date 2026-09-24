package com.mathgate

import android.accessibilityservice.AccessibilityService
import android.app.KeyguardManager
import android.content.BroadcastReceiver
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.telecom.TelecomManager
import android.view.accessibility.AccessibilityEvent
import android.view.inputmethod.InputMethodManager
import android.widget.Toast

/**
 * Замок. Служба специальных возможностей видит, какое приложение открыто,
 * и, пока задачи не решены, держит поверх всего окно с задачами (GateOverlay).
 *
 * Окно — это оверлей службы, а не Activity: его не убрать ни кнопкой
 * «Домой», ни «Недавними», и системе не нужно разрешать запуск из фона.
 * На экране блокировки оверлей не показывается, чтобы экстренный вызов
 * всегда оставался доступен.
 */
class GateService : AccessibilityService() {

    lateinit var store: Store
        private set
    private lateinit var overlay: GateOverlay
    private val main = Handler(Looper.getMainLooper())

    /** Последнее приложение на экране (без системной шторки, клавиатур и нас самих). */
    private var fg: String? = null
    private var ignored: Set<String> = emptySet()

    private val tick = Runnable { evaluate() }

    private val screen = object : BroadcastReceiver() {
        override fun onReceive(c: Context, i: Intent) {
            when (i.action) {
                Intent.ACTION_SCREEN_OFF -> {
                    // «До выключения экрана»: погас экран — замок снова закрыт
                    if (store.unlockedUntil == Long.MAX_VALUE) store.lockNow()
                    store.parentUntil = 0
                    overlay.hide()
                }
                else -> evaluate()
            }
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        store = Store(this)
        overlay = GateOverlay(this)
        instance = this
        refreshIgnored()
        registerReceiver(screen, IntentFilter().apply {
            addAction(Intent.ACTION_SCREEN_OFF)
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_USER_PRESENT)
        })
        evaluate()
    }

    override fun onDestroy() {
        instance = null
        main.removeCallbacks(tick)
        runCatching { unregisterReceiver(screen) }
        if (::overlay.isInitialized) overlay.destroy()
        super.onDestroy()
    }

    override fun onInterrupt() {}

    override fun onAccessibilityEvent(e: AccessibilityEvent) {
        if (e.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) return
        val pkg = e.packageName?.toString() ?: return
        if (pkg == packageName || pkg in ignored) return
        fg = pkg
        evaluate()
    }

    /* ---------- главное решение: закрыть экран или нет ---------- */

    fun evaluate() {
        main.removeCallbacks(tick)
        val now = System.currentTimeMillis()

        val pm = getSystemService(PowerManager::class.java)
        val kg = getSystemService(KeyguardManager::class.java)
        if (!pm.isInteractive || kg.isKeyguardLocked) {
            overlay.hide()
            return
        }

        if (store.isLocked(now) && !store.isParent(now)) {
            if (isAlwaysAllowed(fg)) overlay.hide() else overlay.show()
            return
        }

        overlay.hide()
        if (store.hasPassword() && store.blockSettings && !store.isParent(now) && isGuarded(fg)) {
            // Настройки ребёнку закрыты: иначе замок выключается в два касания
            performGlobalAction(GLOBAL_ACTION_HOME)
            Toast.makeText(this, if (store.lang == "en") "Settings are locked by a parent"
                                 else "Настройки закрыты родителем", Toast.LENGTH_SHORT).show()
            fg = null
        }

        // Проснуться, когда закончится открытое время или сессия родителя
        val next = listOf(store.unlockedUntil, store.parentUntil)
            .filter { it in (now + 1) until Long.MAX_VALUE }
            .minOrNull()
        if (next != null) main.postDelayed(tick, next - now + 300)
    }

    /* ---------- что открывается без задач ---------- */

    private fun defaultDialer(): String? =
        runCatching { getSystemService(TelecomManager::class.java).defaultDialerPackage }.getOrNull()

    /** Звонилка, входящий вызов, будильник и то, что разрешил родитель. */
    fun isAlwaysAllowed(pkg: String?): Boolean {
        if (pkg == null) return false
        if (pkg in store.allowed || pkg == defaultDialer() || pkg in PHONE) return true
        return pkg.contains("incallui") || pkg.contains("emergency") || pkg.contains("deskclock")
    }

    private fun isGuarded(pkg: String?) = pkg != null && (pkg in GUARDED || pkg.endsWith(".packageinstaller"))

    /** Кнопки быстрого доступа на экране с задачами. */
    fun quickApps(): List<Pair<String, String>> {
        val pm = packageManager
        val list = mutableListOf<Pair<String, String>>()
        defaultDialer()?.let { list += it to (if (store.lang == "en") "Phone" else "Телефон") }
        for (pkg in store.allowed.sorted()) {
            if (list.any { it.first == pkg }) continue
            val label = runCatching { pm.getApplicationLabel(pm.getApplicationInfo(pkg, 0)).toString() }
                .getOrNull() ?: continue
            list += pkg to label
        }
        return list
    }

    fun launch(pkg: String) {
        if (!isAlwaysAllowed(pkg)) return
        val i = packageManager.getLaunchIntentForPackage(pkg) ?: return
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        fg = pkg
        overlay.hide()
        startActivity(i)
    }

    fun openParent() {
        overlay.hide()
        startActivity(Intent(this, ParentActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK))
    }

    /** Настройки поменялись (класс, язык, набор задач) — окно с задачами собрать заново. */
    fun reload() {
        overlay.destroy()
        overlay = GateOverlay(this)
        refreshIgnored()
        evaluate()
    }

    private fun refreshIgnored() {
        val imes = runCatching {
            getSystemService(InputMethodManager::class.java).enabledInputMethodList.map { it.packageName }
        }.getOrDefault(emptyList())
        ignored = setOf("com.android.systemui", "android") + imes
    }

    companion object {
        @Volatile var instance: GateService? = null
            private set

        private val PHONE = setOf(
            "com.android.phone", "com.android.server.telecom",
            "com.google.android.dialer", "com.android.dialer", "com.samsung.android.dialer"
        )
        private val GUARDED = setOf(
            "com.android.settings", "com.samsung.android.settings",
            "com.google.android.packageinstaller", "com.android.packageinstaller"
        )

        fun isEnabled(ctx: Context): Boolean {
            val on = Settings.Secure.getString(ctx.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES) ?: return false
            val me = ComponentName(ctx, GateService::class.java)
            return on.split(':').any {
                it.equals(me.flattenToString(), true) || it.equals(me.flattenToShortString(), true)
            }
        }

    }
}
