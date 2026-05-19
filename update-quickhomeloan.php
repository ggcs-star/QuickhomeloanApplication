<?php
$apiUrl = 'https://backend.quickhomeloan.in/public/api/app-settings';
$response = file_get_contents($apiUrl);
$data = json_decode($response, true);

if ($data['success']) {
    $appName = $data['data']['app_name'];
    $appLogo = $data['data']['app_logo'];
    $splashLogo = $data['data']['splash_logo'];
    $headerLogo = $data['data']['header_logo'];
    
    echo "📦 Fetching: $appName\n";
    
    // Project path - APNA SAHI PATH DAALO
    $projectPath = 'c:\xampp\htdocs\QuickhomeloanApplication'; // Change this
    
        // 🔥 UPDATE .env FILE
    $envFile = $projectPath . '/.env';
    if (file_exists($envFile)) {
        $env = file_get_contents($envFile);
        $env = preg_replace('/APP_NAME=.*/', 'APP_NAME="' . $appName . '"', $env);
        file_put_contents($envFile, $env);
        echo "✅ .env updated\n";
    }
    // Update AndroidManifest.xml
    $manifestFile = $projectPath . '/nativephp/android/app/src/main/AndroidManifest.xml';
    if (file_exists($manifestFile)) {
        $manifest = file_get_contents($manifestFile);
        $manifest = preg_replace('/android:label\s*=\s*"[^"]+"/', 'android:label="' . $appName . '"', $manifest);
        file_put_contents($manifestFile, $manifest);
        echo "✅ Manifest updated\n";
    }
    
    // Update strings.xml
    $stringsFile = $projectPath . '/nativephp/android/app/src/main/res/values/strings.xml';
    if (file_exists($stringsFile)) {
        $strings = file_get_contents($stringsFile);
        $strings = preg_replace('/<string name="app_name">[^<]+<\/string>/', '<string name="app_name">' . $appName . '</string>', $strings);
        file_put_contents($stringsFile, $strings);
        echo "✅ Strings.xml updated\n";
    }
    
    // Update launcher icon
    $iconData = file_get_contents($appLogo);
    if ($iconData) {
        $folders = ['hdpi', 'mdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
        foreach ($folders as $folder) {
            $path = $projectPath . "/nativephp/android/app/src/main/res/mipmap-$folder/ic_launcher.png";
            file_put_contents($path, $iconData);
            file_put_contents(str_replace('ic_launcher.png', 'ic_launcher_round.png', $path), $iconData);
        }
        echo "✅ App icon updated\n";
    }
    
    // Update splash logo
    $splashData = file_get_contents($splashLogo);
    if ($splashData) {
        file_put_contents($projectPath . '/nativephp/android/app/src/main/res/drawable/splash_logo.png', $splashData);
        echo "✅ Splash logo updated\n";
    }
    
    echo "\n✅ Done! Run: nativephp build android\n";
} else {
    echo "❌ API failed\n";
}
?>
