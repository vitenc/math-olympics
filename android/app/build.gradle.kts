plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

/* Задачи, движок рисунков и картинки берутся из корня репозитория —
   те же файлы, что у веб-версии. Копия кладётся в build/generated/web
   перед каждой сборкой, в android/ ничего не дублируется. */
val webOut = layout.buildDirectory.dir("generated/web")
val syncWeb by tasks.registering(Sync::class) {
    from(rootDir.parentFile) {
        include("assets/**", "data/**", "img/**")
        into("web")
    }
    from(rootDir.resolve("web")) { into("web") }
    into(webOut)
}

android {
    namespace = "com.mathgate"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.mathgate"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "0.1"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            // Для домашней установки подписываем отладочным ключом
            signingConfig = signingConfigs.getByName("debug")
        }
    }

    sourceSets["main"].assets.srcDir(webOut)

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

tasks.named("preBuild") { dependsOn(syncWeb) }
