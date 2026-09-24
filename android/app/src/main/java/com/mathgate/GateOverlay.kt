package com.mathgate

import android.annotation.SuppressLint
import android.content.pm.ApplicationInfo
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.view.ContextThemeWrapper
import android.view.Gravity
import android.view.KeyEvent
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.ViewGroup.LayoutParams.WRAP_CONTENT
import android.view.WindowInsets
import android.view.WindowManager
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Button
import android.widget.FrameLayout
import android.widget.GridLayout
import android.widget.LinearLayout
import android.widget.TextView
import org.json.JSONArray
import org.json.JSONObject

/**
 * Окно с задачами поверх всего экрана.
 *
 * Задачи рисует веб-страница (web/gate.html) — тот же движок рисунков и те
 * же данные, что у сайта. А вход родителя по мастер-паролю сделан обычными
 * Android-кнопками поверх страницы: он должен работать всегда, даже если
 * страница не загрузилась или в ней ошибка.
 *
 * Пароль вводится своей цифровой клавиатурой: системная клавиатура под
 * оверлеем службы может оказаться не видна.
 */
@SuppressLint("SetJavaScriptEnabled", "ViewConstructor")
class GateOverlay(private val svc: GateService) {

    private val ctx = ContextThemeWrapper(svc, android.R.style.Theme_DeviceDefault_Light_NoActionBar)
    private val wm = svc.getSystemService(WindowManager::class.java)
    private val main = Handler(Looper.getMainLooper())
    private val store get() = svc.store
    private val en get() = store.lang == "en"

    private var root: FrameLayout? = null
    private var web: WebView? = null
    private var shown = false

    // вход родителя
    private var panel: LinearLayout? = null
    private var pinView: TextView? = null
    private var msgView: TextView? = null
    private var keys: View? = null
    private var actions: View? = null
    private var pin = ""

    fun show() {
        if (shown) return
        val r = root ?: build().also { root = it }
        val lp = WindowManager.LayoutParams(
            MATCH_PARENT, MATCH_PARENT,
            WindowManager.LayoutParams.TYPE_ACCESSIBILITY_OVERLAY,
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.OPAQUE
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
        }
        runCatching { wm.addView(r, lp) }.onSuccess {
            shown = true
            closePanel()
            web?.evaluateJavascript("window.GateUI && GateUI.shown()", null)
        }
    }

    fun hide() {
        if (!shown) return
        root?.let { runCatching { wm.removeView(it) } }
        shown = false
    }

    fun destroy() {
        hide()
        web?.destroy()
        web = null
        root = null
    }

    /* ---------- сборка окна ---------- */

    private fun build(): FrameLayout {
        val r = object : FrameLayout(ctx) {
            // «Назад» ничего не закрывает, только сворачивает панель родителя
            override fun dispatchKeyEvent(e: KeyEvent): Boolean {
                if (e.keyCode == KeyEvent.KEYCODE_BACK) {
                    if (e.action == KeyEvent.ACTION_UP) closePanel()
                    return true
                }
                return super.dispatchKeyEvent(e)
            }
        }
        r.setBackgroundColor(Color.parseColor("#D8D8D8"))
        // Оверлей закрывает и строку состояния; сверху отступ на её высоту,
        // чтобы вырез камеры не лёг на заголовок. Если система пришлёт
        // точные отступы, их применит слушатель ниже.
        val sb = svc.resources.getIdentifier("status_bar_height", "dimen", "android")
        if (sb > 0) r.setPadding(0, svc.resources.getDimensionPixelSize(sb), 0, 0)
        r.setOnApplyWindowInsetsListener { v, ins ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                val b = ins.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
                v.setPadding(b.left, b.top, b.right, b.bottom)
            } else {
                @Suppress("DEPRECATION")
                v.setPadding(ins.systemWindowInsetLeft, ins.systemWindowInsetTop,
                    ins.systemWindowInsetRight, ins.systemWindowInsetBottom)
            }
            ins
        }

        val w = WebView(ctx)
        if (svc.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0) {
            WebView.setWebContentsDebuggingEnabled(true)
        }
        w.settings.javaScriptEnabled = true
        w.settings.domStorageEnabled = true
        w.settings.allowFileAccess = true
        w.addJavascriptInterface(Bridge(), "Gate")
        w.loadUrl("file:///android_asset/web/gate.html?lang=" + store.lang)
        web = w
        r.addView(w, FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT))

        // Кнопка родителя — всегда поверх страницы, в правом верхнем углу
        val key = Button(ctx).apply {
            text = "🔑"
            textSize = 18f
            background = round(Color.argb(40, 0, 0, 0), 22)
            setOnClickListener { openPanel() }
            contentDescription = if (en) "Parent" else "Родитель"
        }
        r.addView(key, FrameLayout.LayoutParams(dp(44), dp(44), Gravity.TOP or Gravity.END).apply {
            setMargins(0, dp(6), dp(6), 0)
        })

        r.addView(buildPanel(), FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT))
        return r
    }

    private fun buildPanel(): View {
        val dim = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(Color.argb(200, 0, 0, 0))
            visibility = View.GONE
            isClickable = true           // клики не проходят к задачам под панелью
        }
        val card = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER_HORIZONTAL
            background = round(Color.WHITE, 16)
            setPadding(dp(20), dp(18), dp(20), dp(14))
        }
        dim.addView(card, LinearLayout.LayoutParams(dp(300), WRAP_CONTENT))

        card.addView(TextView(ctx).apply {
            text = if (en) "Parent master password" else "Мастер-пароль родителя"
            textSize = 17f
            setTextColor(Color.parseColor("#1A1A1A"))
            gravity = Gravity.CENTER
        })
        pinView = TextView(ctx).apply {
            textSize = 26f
            gravity = Gravity.CENTER
            letterSpacing = 0.2f
            setTextColor(Color.parseColor("#1A1A1A"))
            setPadding(0, dp(8), 0, dp(4))
        }
        card.addView(pinView, LinearLayout.LayoutParams(MATCH_PARENT, dp(52)))
        msgView = TextView(ctx).apply {
            textSize = 13f
            gravity = Gravity.CENTER
            setTextColor(Color.parseColor("#C0392B"))
        }
        card.addView(msgView)

        // цифровая клавиатура
        val grid = GridLayout(ctx).apply { columnCount = 3 }
        listOf("1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "OK").forEach { k ->
            grid.addView(Button(ctx).apply {
                text = k
                textSize = 20f
                setOnClickListener { press(k) }
            }, GridLayout.LayoutParams().apply { width = dp(80); height = dp(58) })
        }
        keys = grid
        card.addView(grid)

        // что сделать после верного пароля
        val act = LinearLayout(ctx).apply {
            orientation = LinearLayout.VERTICAL
            visibility = View.GONE
        }
        val m = store.minutes
        val openFor = when {
            m == 0 -> if (en) "Open until the screen turns off" else "Открыть до выключения экрана"
            en -> "Open for $m min"
            else -> "Открыть на $m мин"
        }
        act.addView(action(openFor) { store.unlock(); svc.evaluate() })
        act.addView(action(if (en) "Turn the lock off" else "Выключить замок") {
            store.paused = true; svc.evaluate()
        })
        act.addView(action(if (en) "Parent settings" else "Настройки родителя") {
            store.parentUntil = System.currentTimeMillis() + PARENT_MS
            svc.openParent()
        })
        actions = act
        card.addView(act, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))

        card.addView(Button(ctx).apply {
            text = if (en) "Cancel" else "Отмена"
            setOnClickListener { closePanel() }
        }, LinearLayout.LayoutParams(MATCH_PARENT, WRAP_CONTENT))

        panel = dim
        return dim
    }

    private fun action(label: String, run: () -> Unit) = Button(ctx).apply {
        text = label
        setOnClickListener { closePanel(); run() }
    }

    private fun openPanel() {
        pin = ""
        keys?.visibility = View.VISIBLE
        actions?.visibility = View.GONE
        showFrozen()
        render()
        panel?.visibility = View.VISIBLE
    }

    private fun closePanel() {
        pin = ""
        panel?.visibility = View.GONE
    }

    private fun press(k: String) {
        when (k) {
            "⌫" -> pin = pin.dropLast(1)
            "OK" -> { submit(); return }
            else -> if (pin.length < 12) pin += k
        }
        render()
    }

    private fun submit() {
        if (store.frozenFor() > 0) { showFrozen(); return }
        if (store.checkPassword(pin)) {
            keys?.visibility = View.GONE
            actions?.visibility = View.VISIBLE
            msgView?.text = ""
            pinView?.text = "✓"
            pin = ""
            return
        }
        pin = ""
        render()
        if (!showFrozen()) msgView?.text = if (en) "Wrong password" else "Неверный пароль"
    }

    private fun showFrozen(): Boolean {
        val s = store.frozenFor()
        msgView?.text = when {
            s == 0L -> ""
            en -> "Too many tries. Wait $s s"
            else -> "Слишком много попыток. Подождите $s с"
        }
        return s > 0
    }

    private fun render() {
        pinView?.text = "•".repeat(pin.length)
    }

    /* ---------- мост для страницы с задачами ---------- */

    inner class Bridge {
        @JavascriptInterface
        fun config(): String {
            val apps = JSONArray()
            svc.quickApps().forEach { (pkg, label) -> apps.put(JSONObject().put("pkg", pkg).put("label", label)) }
            return JSONObject()
                .put("need", store.need)
                .put("solved", store.solved)
                .put("grade", store.grade)
                .put("lang", store.lang)
                .put("pools", JSONArray(store.pools.toList()))
                .put("apps", apps)
                .toString()
        }

        /** Ответ на задачу. Засчитывается только верный ответ с первой попытки. */
        @JavascriptInterface
        fun result(set: String, idx: Int, ok: Boolean, topic: String): String {
            store.log(set, idx, ok, topic)
            if (ok && store.isLocked()) store.solved = store.solved + 1
            val done = store.solved >= store.need
            if (done && store.isLocked()) store.unlock()   // окно закроет кнопка «Открыть телефон»
            return JSONObject()
                .put("solved", if (done) store.need else store.solved)
                .put("need", store.need)
                .put("done", done || !store.isLocked())
                .toString()
        }

        @JavascriptInterface
        fun close() = main.post { svc.evaluate() }.let { }

        @JavascriptInterface
        fun launch(pkg: String) = main.post { svc.launch(pkg) }.let { }
    }

    /* ---------- мелочи ---------- */

    private fun dp(v: Int) = (v * svc.resources.displayMetrics.density).toInt()

    private fun round(color: Int, radiusDp: Int) = GradientDrawable().apply {
        setColor(color)
        cornerRadius = dp(radiusDp).toFloat()
    }

    companion object {
        /** Сколько длится вход родителя: всё это время замок и Настройки открыты. */
        const val PARENT_MS = 15 * 60_000L
    }
}
