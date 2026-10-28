<#
.SYNOPSIS
  Travel Buddy — Android APK Build Script
.DESCRIPTION
  Builds a standalone Android APK (.apk) for the Travel Buddy app.
#>

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  ✈️  Travel Buddy — Android APK Builder" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Choose your APK build method:" -ForegroundColor Yellow
Write-Host "1. Cloud Build via EAS (Recommended - Zero local Android SDK setup required, generates direct APK download link)" -ForegroundColor White
Write-Host "2. Local Build via Gradle (Requires local Android SDK & ANDROID_HOME)" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter 1 or 2 [Default: 1]"
if ([string]::IsNullOrWhiteSpace($choice)) {
    $choice = "1"
}

if ($choice -eq "1") {
    Write-Host "`n[1/3] Checking EAS CLI..." -ForegroundColor Green
    Write-Host "[2/3] Authenticating with Expo (if not logged in)..." -ForegroundColor Green
    npx --yes eas-cli login
    Write-Host "`n[3/3] Starting Android APK build in the cloud..." -ForegroundColor Green
    Write-Host "EAS will compile the APK and output a direct .apk download link and QR code." -ForegroundColor Cyan
    npx --yes eas-cli build -p android --profile preview
} elseif ($choice -eq "2") {
    Write-Host "`n[1/2] Checking Java & Android SDK..." -ForegroundColor Green
    $javaPath = "C:\Program Files\Eclipse Adoptium\jdk-21.0.11.10-hotspot"
    if (Test-Path $javaPath) {
        $env:JAVA_HOME = $javaPath
        Write-Host "Using JDK 21 at: $javaPath" -ForegroundColor Gray
    }
    
    if (-not (Test-Path "android\local.properties")) {
        $defaultSdk = "$env:LOCALAPPDATA\Android\Sdk"
        if (Test-Path $defaultSdk) {
            "sdk.dir=$($defaultSdk.Replace('\', '\\'))" | Out-File "android\local.properties" -Encoding utf8
            Write-Host "Set sdk.dir to $defaultSdk in local.properties" -ForegroundColor Gray
        } else {
            Write-Warning "Android SDK not found at $defaultSdk. Please set sdk.dir in android\local.properties or use Option 1 (EAS Cloud Build)."
        }
    }

    Write-Host "`n[2/2] Running Gradle assembleRelease..." -ForegroundColor Green
    Set-Location android
    .\gradlew.bat assembleRelease
    Set-Location ..
    
    $apkPath = "android\app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        Write-Host "`n🎉 APK built successfully at: $apkPath" -ForegroundColor Green
    } else {
        Write-Host "`nLocal build completed. Check android\app\build\outputs\apk for output." -ForegroundColor Yellow
    }
}

