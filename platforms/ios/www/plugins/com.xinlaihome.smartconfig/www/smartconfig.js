cordova.define("com.xinlaihome.smartconfig.smartconfig", function(require, exports, module) {

var exec = require('cordova/exec');

/**

navigator.alipay.pay({"seller":"007slm@163.com",subject":"x51","body":"x5企业版","price":"0.01","tradeNo":"123456","timeout":"30m","notifyUrl":"wwww.justep.com"},function(msgCode){alert(msgCode)},function(msg){alert(msg)})
**/

module.exports = {
    startSending: function(formdata,successCallback,errorCallback){
      console.log("Request sent to SmartConfig Plugin");
      console.log(formdata);

        if (typeof errorCallback != "function")  {
            console.log("failure parameter not a function");
            return
        }
    
        if (typeof successCallback != "function") {
            console.log("success callback parameter must be a function");
            return
        }      

      exec(successCallback,errorCallback,'SmartConfig','cordovaSendData',[formdata]);        
    },
    gateWayIp: function(formdata,successCallback,errorCallback){
      console.log("Request sent to SmartConfig Plugin");
      console.log(formdata);

        if (typeof errorCallback != "function")  {
            console.log("failure parameter not a function");
            return
        }
    
        if (typeof successCallback != "function") {
            console.log("success callback parameter must be a function");
            return
        }      

      exec(successCallback,errorCallback,'SmartConfig','getGatewayIp',[formdata]);        
    },    

    stopSending: function() {

      console.log("Request canceled via SmartConfig Plugin");

      var success = function callback(data) {
        console.log('stopSending success');
        console.log(data);
      };

      var error = function errorHandler(err) {
        console.log('stopSending error');
        console.log(err);
      };
      exec(success,error,'SmartConfig','cordovaStopSendingData',[]);   
    }
};
});
