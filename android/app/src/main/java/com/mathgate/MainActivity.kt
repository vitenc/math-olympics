package com.mathgate

import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.ApplicationInfo
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.View
import android.view.ViewGroup.LayoutParams.MATCH_PARENT
import android.view.WindowInsets
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import java.io.IOException

/**
 * Весь сайт в одном окне: хаб, занятия, экзамены, журнал ошибок,
 * прошлые олимпиады, таблица умножения. Страницы лежат в assets/web
 * (копируются из корня репозитория при сборке) и отдаются WebView
 * с адреса https://appassets.androidplatform.net/ — у страниц настоящий
 * origin, поэтому localStorage с прогрессом работает так же, как на сайте,
 * и переживает обновления приложения. Интернет не нужен.
 */
class MainActivity : Activity() {

    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE != 0) WebView.setWebContentsDebuggingEnabled(true)

        web = WebView(this)
        web.setBackgroundColor(Color.WHITE)
        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_NO_CACHE
            textZoom = 100 // вёрстка сайта сама подстраивается под телефон
        }
        web.webViewClient = Client()
        // WebView не учитывает собственный padding — отступы даёт обёртка
        val root = FrameLayout(this)
        root.setBackgroundColor(Color.WHITE)
        root.addView(web, FrameLayout.LayoutParams(MATCH_PARENT, MATCH_PARENT))
        setContentView(root)
        fitSystemBars(root)

        if (savedInstanceState != null) web.restoreState(savedInstanceState)
        if (web.url == null) web.loadUrl(HOME)
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    /** «Назад» листает историю страниц, как в браузере; с хаба — выход. */
    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (web.canGoBack()) web.goBack() else super.onBackPressed()
    }

    override fun onDestroy() {
        web.destroy()
        super.onDestroy()
    }

    /** На Android 15 окно рисуется под строкой состояния — отступаем
     *  от системных панелей и от клавиатуры, чтобы поле ответа было видно. */
    private fun fitSystemBars(v: View) {
        v.setOnApplyWindowInsetsListener { view, insets ->
            val types = WindowInsets.Type.systemBars() or WindowInsets.Type.ime() or
                WindowInsets.Type.displayCutout()
            val i = if (android.os.Build.VERSION.SDK_INT >= 30) insets.getInsets(types) else null
            if (i != null) {
                view.setPadding(i.left, i.top, i.right, i.bottom)
            } else {
                @Suppress("DEPRECATION")
                view.setPadding(insets.systemWindowInsetLeft, insets.systemWindowInsetTop,
                    insets.systemWindowInsetRight, insets.systemWindowInsetBottom)
            }
            insets
        }
    }

    private inner class Client : WebViewClient() {

        override fun shouldInterceptRequest(view: WebView, req: WebResourceRequest): WebResourceResponse? {
            val url = req.url
            if (url.host != HOST) return null
            val path = url.path?.trimStart('/').orEmpty().ifEmpty { "index.html" }
            if (path.contains("..")) return notFound()
            return try {
                val stream = assets.open("web/$path")
                WebResourceResponse(mime(path), if (isText(path)) "utf-8" else null, stream)
            } catch (e: IOException) {
                notFound()
            }
        }

        /** Свои страницы открываем здесь же, всё остальное — в браузере. */
        override fun shouldOverrideUrlLoading(view: WebView, req: WebResourceRequest): Boolean {
            if (req.url.host == HOST) return false
            try {
                startActivity(Intent(Intent.ACTION_VIEW, req.url))
            } catch (e: ActivityNotFoundException) { /* браузера нет — просто остаёмся */ }
            return true
        }

        private fun notFound() =
            WebResourceResponse("text/plain", "utf-8", 404, "Not Found", null, null)
    }

    companion object {
        const val HOST = "appassets.androidplatform.net"
        const val HOME = "https://$HOST/index.html"

        private val MIME = mapOf(
            "html" to "text/html", "js" to "text/javascript", "css" to "text/css",
            "json" to "application/json", "svg" to "image/svg+xml",
            "png" to "image/png", "jpg" to "image/jpeg", "jpeg" to "image/jpeg",
            "gif" to "image/gif", "webp" to "image/webp",
            "woff2" to "font/woff2", "woff" to "font/woff", "ttf" to "font/ttf"
        )

        private fun ext(path: String) = path.substringAfterLast('.', "").lowercase()
        fun mime(path: String) = MIME[ext(path)] ?: "application/octet-stream"
        fun isText(path: String) = ext(path) in setOf("html", "js", "css", "json", "svg")
    }
}
