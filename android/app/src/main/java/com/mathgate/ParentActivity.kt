package com.mathgate

import android.annotation.SuppressLint
import android.app.Activity
import android.app.admin.DevicePolicyManager
import android.content.ComponentName
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.view.WindowInsets
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.FrameLayout
import org.json.JSONArray
import org.json.JSONObject

/**
 * Настройки родителя и первичная настройка. Страница — web/parent.html.
 * Всё, что меняет настройки, проверяет вход родителя здесь, в Kotlin:
 * страница только показывает.
 */
class ParentActivity : Activity() {

    private lateinit var store: Store
    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(saved: Bundle?) {
        super.onCreate(saved)
        store = Store(this)
        web = WebView(this)
        if (applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.addJavascriptInterface(Bridge(), "Parent")
        web.loadUrl("file:///android_asset/web/parent.html")
        // Android 15 рисует приложение под строкой состояния и под клавиатурой — отступаем сами.
        // Отступ у рамки: свой padding WebView игнорирует.
        val frame = FrameLayout(this)
        frame.addView(web)
        frame.setOnApplyWindowInsetsListener { v, ins ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val b = ins.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.ime())
                v.setPadding(b.left, b.top, b.right, b.bottom)
            } else {
                @Suppress("DEPRECATION")
                v.setPadding(ins.systemWindowInsetLeft, ins.systemWindowInsetTop,
                    ins.systemWindowInsetRight, ins.systemWindowInsetBottom)
            }
            ins
        }
        setContentView(frame)
    }

    // Вернулись из системных настроек — обновить галочки «включено»
    override fun onResume() {
        super.onResume()
        web.evaluateJavascript("window.ParentUI && ParentUI.refresh()", null)
    }

    override fun onDestroy() {
        web.destroy()
        super.onDestroy()
    }

    private val admin get() = ComponentName(this, AdminReceiver::class.java)

    /** Вход родителя: либо пароль ещё не задан (первый запуск), либо введён недавно. */
    private fun authed() = !store.hasPassword() || store.isParent()

    private fun startParent() {
        store.parentUntil = System.currentTimeMillis() + GateOverlay.PARENT_MS
    }

    private fun ui(run: () -> Unit) = runOnUiThread(run)

    inner class Bridge {
        @JavascriptInterface
        fun state(): String {
            val dpm = getSystemService(DevicePolicyManager::class.java)
            val o = JSONObject()
                .put("hasPassword", store.hasPassword())
                .put("authed", authed())
                .put("frozen", store.frozenFor())
                .put("a11y", GateService.isEnabled(this@ParentActivity))
                .put("admin", dpm.isAdminActive(admin))
                .put("lang", store.lang)
            if (authed()) {
                o.put("need", store.need)
                    .put("minutes", store.minutes)
                    .put("grade", store.grade)
                    .put("pools", JSONArray(store.pools.toList()))
                    .put("allowed", JSONArray(store.allowed.toList()))
                    .put("blockSettings", store.blockSettings)
                    .put("paused", store.paused)
                    .put("locked", store.isLocked())
                    .put("unlockedUntil", store.unlockedUntil)
                    .put("parentUntil", store.parentUntil)
            }
            return o.toString()
        }

        @JavascriptInterface
        fun login(pass: String): Boolean {
            val ok = store.checkPassword(pass)
            if (ok) startParent()
            return ok
        }

        /** Задать или сменить мастер-пароль: 4–12 цифр. */
        @JavascriptInterface
        fun setPassword(pass: String): Boolean {
            if (!authed() || !Regex("[0-9]{4,12}").matches(pass)) return false
            store.setPassword(pass)
            startParent()
            return true
        }

        @JavascriptInterface
        fun save(json: String): Boolean {
            if (!authed()) return false
            val o = JSONObject(json)
            if (o.has("need")) store.need = o.getInt("need")
            if (o.has("minutes")) store.minutes = o.getInt("minutes")
            if (o.has("grade")) store.grade = o.getInt("grade")
            if (o.has("lang")) store.lang = o.getString("lang")
            if (o.has("blockSettings")) store.blockSettings = o.getBoolean("blockSettings")
            if (o.has("paused")) store.paused = o.getBoolean("paused")
            if (o.has("pools")) store.pools = strings(o.getJSONArray("pools"))
            if (o.has("allowed")) store.allowed = strings(o.getJSONArray("allowed"))
            ui { GateService.instance?.reload() }
            return true
        }

        /** Все приложения с иконкой на рабочем столе — для списка «всегда можно». */
        @JavascriptInterface
        fun apps(): String {
            if (!authed()) return "[]"
            val pm = packageManager
            val i = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
            val arr = JSONArray()
            pm.queryIntentActivities(i, 0)
                .map { it.activityInfo.packageName to it.loadLabel(pm).toString() }
                .filter { it.first != packageName }
                .distinctBy { it.first }
                .sortedBy { it.second.lowercase() }
                .forEach { arr.put(JSONObject().put("pkg", it.first).put("label", it.second)) }
            return arr.toString()
        }

        @JavascriptInterface
        fun log(): String = if (authed()) store.logJson() else "[]"

        @JavascriptInterface
        fun clearLog() { if (authed()) store.clearLog() }

        /** Закрыть телефон прямо сейчас и выйти из режима родителя. */
        @JavascriptInterface
        fun lockNow() {
            if (!authed()) return
            store.paused = false
            store.lockNow()
            store.parentUntil = 0
            ui {
                finish()
                GateService.instance?.evaluate()
            }
        }

        /** Выйти из режима родителя, оставив замок как есть. */
        @JavascriptInterface
        fun logout() {
            store.parentUntil = 0
            ui {
                finish()
                GateService.instance?.evaluate()
            }
        }

        @JavascriptInterface
        fun openA11y() = ui {
            startActivity(Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS))
        }

        @JavascriptInterface
        fun openAdmin() = ui {
            startActivity(Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN)
                .putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, admin)
                .putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION,
                    if (store.lang == "en") "Stops the child from uninstalling Math Gate."
                    else "Чтобы ребёнок не мог удалить Math Gate."))
        }

        /** Android 13+: для установленных не из магазина надо «Разрешить ограниченные настройки». */
        @JavascriptInterface
        fun openAppInfo() = ui {
            startActivity(Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,
                Uri.parse("package:$packageName")))
        }
    }

    private fun strings(a: JSONArray) = (0 until a.length()).map { a.getString(it) }.toSet()
}
