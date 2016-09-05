cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
        "id": "com.pylonproducts.wifiwizard.WifiWizard",
        "clobbers": [
            "window.WifiWizard"
        ]
    },
    {
        "file": "plugins/com.yoopoon.cordova.plugin.alipay/www/alipay.js",
        "id": "com.yoopoon.cordova.plugin.alipay.alipay",
        "clobbers": [
            "navigator.alipay"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
        "id": "cordova-plugin-splashscreen.SplashScreen",
        "clobbers": [
            "navigator.splashscreen"
        ]
    },
    {
        "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
        "id": "cordova-plugin-statusbar.statusbar",
        "clobbers": [
            "window.StatusBar"
        ]
    },
    {
        "file": "plugins/cordova-plugin-vibration/www/vibration.js",
        "id": "cordova-plugin-vibration.notification",
        "merges": [
            "navigator.notification",
            "navigator"
        ]
    },
    {
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/cordova.weixin.pay/www/weixin.js",
        "id": "cordova.weixin.pay.weixin",
        "clobbers": [
            "navigator.weixin"
        ]
    },
    {
        "file": "plugins/ionic-plugin-keyboard/www/android/keyboard.js",
        "id": "ionic-plugin-keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ],
        "runs": true
    },
    {
        "file": "plugins/jpush-phonegap-plugin/www/JPushPlugin.js",
        "id": "jpush-phonegap-plugin.JPushPlugin",
        "clobbers": [
            "JPush"
        ]
    },
    {
        "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
        "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
        "clobbers": [
            "cordova.plugins.barcodeScanner"
        ]
    },
    {
        "file": "plugins/com.xinlaihome.smartconfig/www/smartconfig.js",
        "id": "com.xinlaihome.smartconfig.smartconfig",
        "clobbers": [
            "navigator.smartconfig"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.pylonproducts.wifiwizard": "0.2.11",
    "com.yoopoon.cordova.plugin.alipay": "5.3.0",
    "cordova-plugin-compat": "1.0.0",
    "cordova-plugin-console": "1.0.3",
    "cordova-plugin-device": "1.1.2",
    "cordova-plugin-splashscreen": "3.2.2",
    "cordova-plugin-statusbar": "2.1.3",
    "cordova-plugin-vibration": "2.1.1",
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-sqlite-storage": "1.4.7",
    "cordova.weixin.pay": "5.3.0",
    "ionic-plugin-keyboard": "2.2.1",
    "jpush-phonegap-plugin": "2.2.4",
    "phonegap-plugin-barcodescanner": "6.0.1",
    "com.xinlaihome.smartconfig": "5.3.0"
};
// BOTTOM OF METADATA
});