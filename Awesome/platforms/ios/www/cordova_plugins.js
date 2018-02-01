cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "com-badrit-macaddress.MacAddress",
    "file": "plugins/com-badrit-macaddress/www/MacAddress.js",
    "pluginId": "com-badrit-macaddress",
    "clobbers": [
      "window.MacAddress"
    ]
  },
  {
    "id": "com.pylonproducts.wifiwizard.WifiWizard",
    "file": "plugins/com.pylonproducts.wifiwizard/www/WifiWizard.js",
    "pluginId": "com.pylonproducts.wifiwizard",
    "clobbers": [
      "window.WifiWizard"
    ]
  },
  {
    "id": "es6-promise-plugin.Promise",
    "file": "plugins/es6-promise-plugin/www/promise.js",
    "pluginId": "es6-promise-plugin",
    "runs": true
  },
  {
    "id": "wifiwizard2.WifiWizard2",
    "file": "plugins/wifiwizard2/www/WifiWizard2.js",
    "pluginId": "wifiwizard2",
    "clobbers": [
      "window.WifiWizard2"
    ]
  },
  {
    "id": "cordova-plugin-ip-mac-address.addressimpl",
    "file": "plugins/cordova-plugin-ip-mac-address/www/addressimpl.js",
    "pluginId": "cordova-plugin-ip-mac-address",
    "clobbers": [
      "addressimpl"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "com-badrit-macaddress": "0.2.1",
  "com.pylonproducts.wifiwizard": "0.2.11",
  "es6-promise-plugin": "4.1.0",
  "wifiwizard2": "2.1.1",
  "cordova-plugin-ip-mac-address": "1.0.1"
};
// BOTTOM OF METADATA
});