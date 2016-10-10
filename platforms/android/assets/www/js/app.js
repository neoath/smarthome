// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'chart.js', 'ngCordova',
 'WifiServices'])

.controller('WifiController', ['$scope', 'WifiService','$state', function ($scope, WifiService,$state) {

    $scope.wifiList = [];

    window.setTimeout(function () {
        $scope.wifiList = WifiService.list();
        // alert($scope.wifiList);
        $scope.$apply();
    }, 5000);

    $scope.getList = function () {
        $scope.wifiList = WifiService.list();
    }

    $scope.connectWifi = function (name) {
        WifiService.connectionToWifi(name);
    }
    $scope.jumptoSender = function(ssid){
          $scope.NetConfigViewModel.SSID = ssid;
          $scope.NetConfigViewModel.password = ssid;



          var scClass = navigator.smartconfig;
          if(scClass){
            alert("class linked");

            var data = {};
            scClass.gateWayIp(
              data,
              function(resultMsg){
              alert(resultMsg);
              $ionicLoading.show({
                template:"成功",
                noBackdrop: true,
                duration: 500
              });
            },function(resultMsg){
              alert(resultMsg);
              $ionicLoading.show({
                template:"失败",
                noBackdrop: true,
                duration: 500
              });
            });       
          }

          else{
            alert("class link fail");
          }

          $scope.NetConfigViewModel.GatewayIP = resultMsg;
          
          $state.go('app.devicenetworkconnect');
    }
}])

// .run(function($ionicPlatform) {
//   $ionicPlatform.ready(function() {
//     // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     // for form inputs)
//     if (window.cordova && window.cordova.plugins.Keyboard) {
//       cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
//       cordova.plugins.Keyboard.disableScroll(true);
//     }
//     if (window.StatusBar) {
//       // org.apache.cordova.statusbar required
//       StatusBar.styleDefault();
//     }

//     //启动极光推送服务
//     window.plugins.jPushPlugin.init();
//     //调试模式
//     window.plugins.jPushPlugin.setDebugMode(true);
//   });
// })

.run(function($ionicPlatform,$state,jpushService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    //推送初始化
    var setTagsWithAliasCallback = function(event){
      window.alert('result code:'+event.resultCode+' tags:'+event.tags+' alias:'+event.alias);
    }
    var openNotificationInAndroidCallback = function(data){
      var json=data;
      window.alert(json);
      if(typeof data === 'string'){
        json=JSON.parse(data);
      }
      var id=json.extras['cn.jpush.android.EXTRA'].id;
      window.alert(id);
      $state.go('alarm');
      // $state.go('detail',{id:id});
    }
    var config={
      stac:setTagsWithAliasCallback,
      oniac:openNotificationInAndroidCallback
    };
    
    jpushService.init(config);
  });

  window.onerror = function(msg, url, line) {  
   var idx = url.lastIndexOf("/");  
   if(idx > -1) {  
    url = url.substring(idx+1);  
   }  
   alert("ERROR in " + url + " (line #" + line + "): " + msg);  
   return false;  
  };
})

.config(function($stateProvider,$urlRouterProvider,$httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/side-menu-left.html'
    // controller: 'AppCtrl'
  })


 .state('app.dashboard', {
      url: "/dashboard",
    abstract: true,
      views: {
        'menuContent' :{
          templateUrl: "templates/dashboard.html"
        }
      }
    })
  .state('app.dashboard.overview', {
      url: "/overview",
      views: {
          'overview-tab': {
              templateUrl: "templates/overview.html"
          }
      }
  })
  .state('app.dashboard.alarms', {
      url: "/alarms",
      views: {
          'alarms-tab': {
              templateUrl: "templates/alarms.html"
        }
      }
    })
  .state('app.dashboard.usersetting', {
      url: "/usersetting",
      views: {
          'usersetting-tab': {
              templateUrl: "templates/usersetting.html"
        }
      }
    })


   
  .state('app.arm', {
      url: "/arm",
      views: {
        'menuContent' :{
          templateUrl: "templates/arm.html"
        }
      }
    })  
  .state('app.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "templates/about.html"
        }
      }
    })    
  .state('app.camera', {
      url: "/camera",
      views: {
        'menuContent' :{
          templateUrl: "templates/camera.html"
        }
      }
  })
        .state('app.nodes', {
            url: "/nodes",
            views: {
                'menuContent': {
                    templateUrl: "templates/nodes.html"
                }
            }
        })
  .state('app.nodeedit', {
      url: "/nodeedit",
      views: {
        'menuContent' :{
            templateUrl: "templates/nodeedit.html"
        }
      }
    })        

  .state('app.nodeType', {
      url: "/nodeType",
      views: {
        'menuContent' :{
          templateUrl: "templates/nodeType.html"
        }
      }
    })  
	.state('app.node', {
      url: "/node",
      views: {
        'menuContent' :{
          templateUrl: "templates/node-single.html"
        }
      }
    })
  //.state('app.usersetting', {
  //    url: "/usersetting",
  //    views: {
  //      'menuContent' :{
  //        templateUrl: "templates/usersetting.html"
  //      }
  //    }
  //  })
  .state('app.userinfo', {
      url: "/userinfo",
      views: {
        'menuContent' :{
          templateUrl: "templates/userinfo.html"
        }
      }
    })  

  .state('app.subusers', {
      url: "/subusers",
      views: {
        'menuContent' :{
          templateUrl: "templates/subusers.html"
        }
      }
    })  
  .state('app.subuserinfo', {
      url: "/subuserinfo",
      views: {
        'menuContent' :{
          templateUrl: "templates/subuserinfo.html"
        }
      }
    })  
  .state('app.settings', {
      url: "/settings",
      views: {
        'menuContent' :{
          templateUrl: "templates/settings.html"
        }
      }
  })
  .state('app.messagesetting', {
      url: "/messagesetting",
      views: {
          'menuContent': {
              templateUrl: "templates/messagesetting.html"
          }
      }
  })
  .state('app.deviceselect', {
      url: "/deviceselect",
      views: {
        'menuContent' :{
          templateUrl: "templates/deviceselect.html"
        }
      }
    })    
  .state('app.devicemanage', {
      url: "/devicemanage",
      views: {
        'menuContent' :{
          templateUrl: "templates/devicemanage.html"
        }
      }
  })
  .state('app.devicedetails', {
      url: "/devicedetails",
      views: {
          'menuContent': {
              templateUrl: "templates/devicedetails.html"
          }
      }
  })
.state('app.deviceedit', {
    url: "/deviceedit",
    views: {
        'menuContent': {
            templateUrl: "templates/deviceedit.html"
        }
    }
})
  .state('app.deviceBind', {
      url: "/deviceBind",
      views: {
        'menuContent' :{
          templateUrl: "templates/deviceBind.html"
        }
      }
    }) 
  .state('app.deviceinfo', {
      url: "/deviceinfo",
      views: {
        'menuContent' :{
          templateUrl: "templates/deviceinfo.html"
        }
      }
    })    
  .state('app.devicenetwork', {
      url: "/devicenetwork",
      views: {
        'menuContent' :{
          templateUrl: "templates/devicenetwork.html"
        }
      }
    })  
  .state('app.devicenetworkconnect', {
      url: "/devicenetworkconnect",
      views: {
        'menuContent' :{
          templateUrl: "templates/devicenetworkconnect.html"
        }
      }
    })                         
  .state('app.notifies', {
      url: "/notifies",
      views: {
        'menuContent' :{
          templateUrl: "templates/notifies.html"
        }
      }
    })
  .state('app.alarming', {
      url: "/alarming",
      views: {
        'menuContent' :{
          templateUrl: "templates/alarming.html"
        }
      }
    })
  .state('app.purchasedevices', {
      url: "/purchasedevices",
      views: {
        'menuContent' :{
          templateUrl: "templates/purchasedevices.html"
        }
      }
    })    
  .state('app.purchaseinfo', {
      url: "/purchaseinfo",
      views: {
        'menuContent' :{
          templateUrl: "templates/purchaseinfo.html"
        }
      }
    })  
  .state('app.purchasemethod', {
      url: "/purchasemethod",
      views: {
        'menuContent' :{
          templateUrl: "templates/purchasemethod.html"
        }
      }
    })    
  .state('app.battery', { 
      url: '/battery', 
      views: { 
        'menuContent': { 
          templateUrl: 'templates/battery.html'
        } 
      } 
    })
  .state('app.manustackpre', { 
      url: '/manustackpre', 
      views: { 
        'menuContent': { 
          templateUrl: 'templates/manustackpre.html'
        } 
      } 
    })     
  .state('app.manustack', { 
      url: '/manustack', 
      views: { 
        'menuContent': { 
          templateUrl: 'templates/manustack.html'
        } 
      } 
    }) 
  .state('app.vib', { 
    url: '/vib', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/vib.html', 
             //绑定controller 
             //controller: 'VibrationCtrl' 
        } 
      } 
    })

  .state('app.changepassword', { 
    url: '/changepassword', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/changepassword.html', 
             //绑定controller 
             //controller: 'VibrationCtrl' 
        } 
      } 
    }) 
  .state('app.changepasswordout', {
      url: '/changepasswordout',
      views: {
          'menuContent': {
              templateUrl: 'templates/changepasswordout.html',
              //绑定controller 
              //controller: 'VibrationCtrl' 
          }
      }
  })
  .state('app.version', { 
    url: '/version', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/version.html', 
             //绑定controller 
             //controller: 'VibrationCtrl' 
        } 
      } 
    }) 
  .state('app.help', { 
    url: '/help', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/help.html', 
             //绑定controller 
             //controller: 'VibrationCtrl' 
        } 
      } 
    })       
    .state('app.login', { 
    url: '/login', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/login.html', 
        } 
      } 
    })      
    .state('app.register', { 
    url: '/register', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/register.html', 
        } 
      } 
    })  
    .state('app.findPassword', { 
    url: '/findPassword', 
    views: { 
        'menuContent': { 
             templateUrl: 'templates/findPassword.html', 
        } 
      } 
    })
    .state('app.wifi', {
        url: '/wifi',
        views: {
            'menuContent': {
                templateUrl: 'templates/wifi.html',
            }
        }
    })
    .state('app.politics', {
        url: '/politics',
        views: {
            'menuContent': {
                templateUrl: 'templates/politics.html',
            }
        }
    })
    .state('app.sc', {
        url: '/sc',
        views: {
            'menuContent': {
                templateUrl: 'templates/sc.html',
            }
        }
    })
    .state('app.maintanance', {
        url: '/maintanance',
        views: {
            'menuContent': {
                templateUrl: 'templates/maintanance.html',
            }
        }
    })
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard/overview');
  $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain;charset=UTF-8';
});
