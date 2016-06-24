// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','chart.js','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // navigator.splashscreen.hide();
  });
})

.config(function($stateProvider,$urlRouterProvider,$httpProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/side-menu-left.html'
    // controller: 'AppCtrl'
  })
  .state('app.overview', {
      url: "/overview",
      views: {
        'menuContent' :{
          templateUrl: "templates/overview.html"
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
  .state('app.camera', {
      url: "/camera",
      views: {
        'menuContent' :{
          templateUrl: "templates/camera.html"
        }
      }
    })  
    .state('app.dashboard', {
      url: "/dashboard",
      views: {
        'menuContent' :{
          templateUrl: "templates/dashboard.html"
        }
      }
    }) 
  .state('app.addNode', {
      url: "/add-node",
      views: {
        'menuContent' :{
          templateUrl: "templates/add-node.html"
        }
      }
    })       
  .state('app.dashboard.home', {
      url: "/home",
      views: {
        'home-tab' :{
          templateUrl: "templates/home.html"
        }
      }
    })
  .state('app.dashboard.favorites', {
      url: "/favorites",
      views: {
        'favorites-tab' :{
          templateUrl: "templates/favorites.html"
        }
      }
    })
  .state('app.dashboard.settings', {
      url: "/settings",
      views: {
        'settings-tab' :{
          templateUrl: "templates/settings.html"
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
  .state('app.usersetting', {
      url: "/usersetting",
      views: {
        'menuContent' :{
          templateUrl: "templates/usersetting.html"
        }
      }
    })
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
  .state('app.devicemanage', {
      url: "/devicemanage",
      views: {
        'menuContent' :{
          templateUrl: "templates/devicemanage.html"
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
  .state('app.notifies', {
      url: "/notifies",
      views: {
        'menuContent' :{
          templateUrl: "templates/notifies.html"
        }
      }
    })
  .state('app.alarm', {
      url: "/alarm",
      views: {
        'menuContent' :{
          templateUrl: "templates/alarm.html"
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
  .state('app.battery', { 
      url: '/battery', 
      views: { 
        'menuContent': { 
          templateUrl: 'templates/battery.html'
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
  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/overview');
  $httpProvider.defaults.headers.post['Content-Type'] = 'text/plain;charset=UTF-8';
});
