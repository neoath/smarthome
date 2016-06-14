// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'chart.js'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
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
    });
})

.config(function ($stateProvider, $urlRouterProvider) {
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
            'menuContent': {
                templateUrl: "templates/overview.html"
            }
        }
    })
    .state('app.arm', {
        url: "/arm",
        views: {
            'menuContent': {
                templateUrl: "templates/arm.html"
            }
        }
    })
    .state('app.camera', {
        url: "/camera",
        views: {
            'menuContent': {
                templateUrl: "templates/camera.html"
            }
        }
    })
      .state('app.dashboard', {
          url: "/dashboard", abstract: true,
          views: {
              'menuContent': {
                  templateUrl: "templates/dashboard.html"
              }
          }
      })
    .state('app.dashboard.home', {
        url: "/home",
        views: {
            'home-tab': {
                templateUrl: "templates/home.html"
            }
        }
    })
    .state('app.dashboard.favorites', {
        url: "/favorites",
        views: {
            'favorites-tab': {
                templateUrl: "templates/favorites.html"
            }
        }
    })
    .state('app.dashboard.settings', {
        url: "/settings",
        views: {
            'settings-tab': {
                templateUrl: "templates/settings.html"
            }
        }
    })
    .state('app.addDevice', {
        url: "/add-device",
        views: {
            'menuContent': {
                templateUrl: "templates/add-device.html"
            }
        }
    })
    .state('app.device', {
          url: "/device",
          views: {
              'menuContent': {
                  templateUrl: "templates/device-single.html"
              }
          }
      })
    .state('app.usersetting', {
        url: "/usersetting",
        views: {
            'menuContent': {
                templateUrl: "templates/usersetting.html"
            }
        }
    })
    .state('app.userinfo', {
        url: "/userinfo",
        views: {
            'menuContent': {
                templateUrl: "templates/userinfo.html"
            }
        }
    })

    .state('app.subusers', {
        url: "/subusers",
        views: {
            'menuContent': {
                templateUrl: "templates/subusers.html"
            }
        }
    })
    .state('app.subuserinfo', {
        url: "/subuserinfo",
        views: {
            'menuContent': {
                templateUrl: "templates/subuserinfo.html"
            }
        }
    })
    .state('app.manage', {
        url: "/manage",
        views: {
            'menuContent': {
                templateUrl: "templates/manage.html"
            }
        }
    })
    .state('app.gatewaymanage', {
        url: "/gatewaymanage",
        views: {
            'menuContent': {
                templateUrl: "templates/gatewaymanage.html"
            }
        }
    })
    .state('app.gatewayinfo', {
        url: "/gatewayinfo",
        views: {
            'menuContent': {
                templateUrl: "templates/gatewayinfo.html"
            }
        }
    })

    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/arm');
});
