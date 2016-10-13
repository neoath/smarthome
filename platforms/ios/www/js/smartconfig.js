angular.module('SmartConfigServices', [])
  .factory('SmartConfigService', function () {
      function startS() {
          var apSsid = "Xiaomi_C3AD";
          var apBssid = "64:09:80:47:C3:AD";
          var apPassword = "12345678";
          var isSsidHiddenStr = "NO";
          var taskResultCountStr = "1";
          alert(apSsid);

        esptouchPlugin.smartConfig(apSsid, apBssid, apPassword, isSsidHiddenStr, taskResultCountStr, function (res) {

            alert(res);

        }, function (error) {
            alert("sss");
            console.log(error);

        });
    }

      function stopS() {
          alert("stoped");
        //esptouchPlugin.cancelConfig(function (res) {

        //    console.log(res);
        //}, function (error) {

        //    console.log(error);
        //});
    }


    return {
      start: function(){
          startS();
      },
      stop: function () {
          stopS();
      }
    };
  });