package com.mathgate

import android.content.Context
import org.json.JSONArray
import org.json.JSONObject
import java.security.SecureRandom
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

/**
 * Всё, что приложение помнит: настройки родителя, мастер-пароль (только хеш),
 * текущее состояние замка и журнал решённых задач.
 */
class Store(ctx: Context) {
    private val p = ctx.applicationContext.getSharedPreferences("gate", Context.MODE_PRIVATE)

    /* ---------- настройки родителя ---------- */

    /** Сколько задач решить, чтобы открыть телефон. */
    var need: Int
        get() = p.getInt("need", 2)
        set(v) = p.edit().putInt("need", v.coerceIn(1, 10)).apply()

    /** На сколько минут открывается телефон; 0 — до выключения экрана. */
    var minutes: Int
        get() = p.getInt("minutes", 30)
        set(v) = p.edit().putInt("minutes", v.coerceAtLeast(0)).apply()

    var grade: Int
        get() = p.getInt("grade", 3)
        set(v) = p.edit().putInt("grade", if (v == 2) 2 else 3).apply()

    var lang: String
        get() = p.getString("lang", "ru") ?: "ru"
        set(v) = p.edit().putString("lang", if (v == "en") "en" else "ru").apply()

    /** Откуда брать задачи: days — занятия, exams — пробные, papers — прошлые олимпиады. */
    var pools: Set<String>
        get() = p.getStringSet("pools", null) ?: setOf("days")
        set(v) = p.edit().putStringSet("pools", v.ifEmpty { setOf("days") }).apply()

    /** Приложения, которые открываются и без задач (кроме звонилки — она разрешена всегда). */
    var allowed: Set<String>
        get() = p.getStringSet("allowed", null) ?: emptySet()
        set(v) = p.edit().putStringSet("allowed", v).apply()

    /** Закрывать ребёнку системные Настройки, чтобы замок нельзя было выключить. */
    var blockSettings: Boolean
        get() = p.getBoolean("blockSettings", true)
        set(v) = p.edit().putBoolean("blockSettings", v).apply()

    /** Родитель выключил замок до следующего включения. */
    var paused: Boolean
        get() = p.getBoolean("paused", false)
        set(v) = p.edit().putBoolean("paused", v).apply()

    /* ---------- состояние замка ---------- */

    /** До какого момента телефон открыт. Long.MAX_VALUE — до выключения экрана. */
    var unlockedUntil: Long
        get() = p.getLong("unlockedUntil", 0)
        set(v) = p.edit().putLong("unlockedUntil", v).apply()

    /** Сколько задач уже решено в текущем заходе. */
    var solved: Int
        get() = p.getInt("solved", 0)
        set(v) = p.edit().putInt("solved", v).apply()

    /** Родитель ввёл пароль: до этого момента Настройки не закрываются. */
    var parentUntil: Long
        get() = p.getLong("parentUntil", 0)
        set(v) = p.edit().putLong("parentUntil", v).apply()

    fun isLocked(now: Long = System.currentTimeMillis()) =
        hasPassword() && !paused && now >= unlockedUntil

    fun isParent(now: Long = System.currentTimeMillis()) = now < parentUntil

    /** Открыть телефон на заданное родителем время и обнулить счёт задач. */
    fun unlock(now: Long = System.currentTimeMillis()) {
        val m = minutes
        unlockedUntil = if (m == 0) Long.MAX_VALUE else now + m * 60_000L
        solved = 0
    }

    fun lockNow() {
        unlockedUntil = 0
        solved = 0
    }

    /* ---------- мастер-пароль ----------
       Хранится только PBKDF2-хеш с солью. После пяти ошибок подряд ввод
       замораживается: 30 с, потом вдвое дольше за каждую новую ошибку. */

    fun hasPassword() = p.contains("passHash")

    fun setPassword(pass: String) {
        val salt = ByteArray(16).also { SecureRandom().nextBytes(it) }
        p.edit()
            .putString("passSalt", hex(salt))
            .putString("passHash", hex(hash(pass, salt)))
            .putInt("fails", 0)
            .putLong("frozenUntil", 0)
            .apply()
    }

    /** Секунд до следующей попытки; 0 — можно вводить. */
    fun frozenFor(now: Long = System.currentTimeMillis()): Long =
        ((p.getLong("frozenUntil", 0) - now) / 1000).coerceAtLeast(0)

    fun checkPassword(pass: String, now: Long = System.currentTimeMillis()): Boolean {
        if (!hasPassword() || frozenFor(now) > 0) return false
        val salt = unhex(p.getString("passSalt", "")!!)
        val ok = hex(hash(pass, salt)) == p.getString("passHash", "")
        val fails = if (ok) 0 else p.getInt("fails", 0) + 1
        val e = p.edit().putInt("fails", fails)
        if (fails >= 5) e.putLong("frozenUntil", now + (30_000L shl (fails - 5).coerceAtMost(8)))
        e.apply()
        return ok
    }

    private fun hash(pass: String, salt: ByteArray): ByteArray =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(PBEKeySpec(pass.toCharArray(), salt, 20_000, 256))
            .encoded

    private fun hex(b: ByteArray) = b.joinToString("") { "%02x".format(it) }
    private fun unhex(s: String) = ByteArray(s.length / 2) { s.substring(it * 2, it * 2 + 2).toInt(16).toByte() }

    /* ---------- журнал для родителя ---------- */

    fun log(set: String, idx: Int, ok: Boolean, topic: String) {
        val arr = JSONArray(p.getString("log", "[]"))
        arr.put(JSONObject().put("t", System.currentTimeMillis()).put("set", set)
            .put("i", idx).put("ok", ok).put("topic", topic))
        val from = (arr.length() - 300).coerceAtLeast(0)
        val keep = JSONArray()
        for (i in from until arr.length()) keep.put(arr.get(i))
        p.edit().putString("log", keep.toString()).apply()
    }

    fun logJson(): String = p.getString("log", "[]") ?: "[]"

    fun clearLog() = p.edit().putString("log", "[]").apply()
}
