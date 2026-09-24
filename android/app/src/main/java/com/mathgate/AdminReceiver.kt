package com.mathgate

import android.app.admin.DeviceAdminReceiver
import android.content.Context
import android.content.Intent

/** Администратор устройства нужен только для одного: пока он включён, приложение не удалить. */
class AdminReceiver : DeviceAdminReceiver() {
    override fun onDisableRequested(context: Context, intent: Intent): CharSequence =
        context.getString(R.string.admin_disable_warning)
}
