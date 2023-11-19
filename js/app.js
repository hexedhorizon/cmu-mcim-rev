angular.module('underscore', [])
.factory('_', function() {
  return window._;
});


angular.module('cmu-mcim', [
  'ionic',
  'angularMoment',
  'cmu-mcim.controllers',
  'cmu-mcim.directives',
  'cmu-mcim.filters',
  'cmu-mcim.services',
  'cmu-mcim.factories',
  'cmu-mcim.config',
  'underscore',
  'ngResource',
  'ngCordova',
  'slugifier',
  'mapplicPlugin',
  'autocomplete'
])
.config(function($ionicConfigProvider) {

  // note that you can also chain configs
  $ionicConfigProvider.navBar.alignTitle('center');
})
.run(function($ionicPlatform, PushNotificationsService, $rootScope, $ionicConfig, $timeout) {

  $ionicPlatform.on("deviceready", function(){
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    PushNotificationsService.register();
  });
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('auth.walkthrough') > -1)
    {
      $timeout(function(){
        $ionicConfig.views.transition('android');
        $ionicConfig.views.swipeBackEnabled(false);
      	console.log("setting transition to android and disabling swipe back");
      }, 0);
    }
  });
  $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams){
    if(toState.name.indexOf('app.feeds-categories') > -1)
    {
      $ionicConfig.views.transition('platform');
      if(ionic.Platform.isIOS())
      {
        $ionicConfig.views.swipeBackEnabled(true);
      }
    	console.log("enabling swipe back and restoring transition to platform default", $ionicConfig.views.transition());
    }
  });

  $ionicPlatform.on("resume", function(){
    PushNotificationsService.register();
  });
})
.run(function($ionicPlatform, $ionicHistory, $rootScope) {
  $ionicPlatform.ready(function() {

    // For exit on back button press
     $ionicPlatform.registerBackButtonAction(function(e) {
       if ($rootScope.backButtonPressedOnceToExit) {
          navigator.app.exitApp(); // or // ionic.Platform.exitApp(); both work
       } else if ($ionicHistory.backView()) {
           $ionicHistory.goBack();
       } else {
          $rootScope.backButtonPressedOnceToExit = true;
          // "Press back button again to exit" : show toast                
          setTimeout(function() {
              $rootScope.backButtonPressedOnceToExit = false;
          }, 2000); // reset if user doesn't press back within 2 seconds, to fire exit
      }
      e.preventDefault();
      return false;
    }, 101);
   })
  })
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider.state('app',{
    url: "/app",
    abstract: true,
    templateUrl: "views/app/side-menu.html",
    controller: 'AppCtrl'
    })
    //Menu
      .state('app.bookmarks',{
        url: "/bookmarks",
        views: {
          'menuContent': {
            templateUrl: "views/app/bookmarks.html",
            controller: 'BookMarksCtrl'
          }
        }
      })
      .state('app.map-main', {
        url: "/map-main",
        views: {
          'menuContent': {
            templateUrl: "views/app/menu/map-main.html",
            controller: 'mapCtrl'
          }
        }
      })
      
     
      .state('app.search-main', {
        url: "/search-main",
        views: {
          'menuContent': {
            templateUrl: "views/app/menu/search-main.html",
            controller: 'searchCtrl'
          }
        }
      })
      .state('app.route-main', {
        url: "/route-main",
        views: {
          'menuContent': {
            templateUrl: "views/app/menu/route-main.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.about', {
        url: "/about",
        views: {
          'menuContent': {
            templateUrl: "views/app/menu/about.html",
            controller: ''
          }
        }
      })
      .state('app.tutorial', {
        url: "/tutorial",
        views: {
          'menuContent': {
            templateUrl: "views/app/menu/tutorial.html",
            controller: ''
          }
        }
      })
    //Announcements 
      .state('app.feeds-categories', {
        url: "/feeds-categories",
        views: {
          'menuContent': {
            templateUrl: "views/app/feeds/feeds-categories.html",
            controller: 'FeedsCategoriesCtrl'
          }
        }
      })

      .state('app.category-feeds', {
        url: "/category-feeds/:categoryId",
        views: {
          'menuContent': {
            templateUrl: "views/app/feeds/category-feeds.html",
            controller: 'CategoryFeedsCtrl'
          }
        }
      })

      .state('app.feed-entries', {
        url: "/feed-entries/:categoryId/:sourceId",
        views: {
          'menuContent': {  
            templateUrl: "views/app/feeds/feed-entries.html",
            controller: 'FeedEntriesCtrl'
          }
        }
      })
    //Practice
     
    //WORDPRESS
      .state('app.wordpress', {
        url: "/wordpress",
        views: {
          'menuContent': {
            templateUrl: "views/app/wordpress/wordpress.html",
            controller: 'WordpressCtrl'
          }
        }
      })
      .state('app.post', {
        url: "/wordpress/:postId",
        views: {
          'menuContent': {
            templateUrl: "views/app/wordpress/wordpress_post.html",
            controller: 'WordpressPostCtrl'
          }
        },
        resolve: {
          post_data: function(PostService, $ionicLoading, $stateParams) {
            $ionicLoading.show({
          		template: 'Loading post ...'
          	});

            var postId = $stateParams.postId;
            return PostService.getPost(postId);
          }
        }
      })
    //Preview
      .state('app.pr-cas-m', {
        url: "/pr-cas-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/cas-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-cbm-m', {
        url: "/pr-cbm-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/cbm-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-coed-m', {
        url: "/pr-coed-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/coed-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-coe-m', {
        url: "/pr-coe-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/coe-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-cfes-m', {
        url: "/pr-cfes-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/cfes-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-che-m', {
        url: "/pr-che-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/che-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
       .state('app.pr-coa-m', {
        url: "/pr-coa-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/coa-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-con-m', {
        url: "/pr-con-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/con-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-cvm-m', {
        url: "/pr-cvm-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/cvm-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-cmushs-m', {
        url: "/pr-cmushs-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/cmushs-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
      .state('app.pr-cmulhs-m', {
        url: "/pr-cmulhs-m",
        views: {
          'menuContent': {
            templateUrl: "templates/previews/cmulhs-m.html"
            //controller: 'casviewCtrl'
          }
        }
      })
    //Deeplink 
      .state('app.vw-cas-m', {
        url: "/vw-cas-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/cas-m.html",
            controller: 'casviewCtrl'
          }
        }
      })
      .state('app.vw-cbm-m', {
        url: "/vw-cbm-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/cbm-m.html",
            controller: 'cbmviewCtrl'
          }
        }
      })
      .state('app.vw-cfes-m', {
        url: "/vw-cfes-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/cfes-m.html",
            controller: 'cfesviewCtrl'
          }
        }
      })
      .state('app.vw-che-m', {
        url: "/vw-che-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/che-m.html",
            controller: 'cheviewCtrl'
          }
        }
      })
      .state('app.vw-coa-m', {
        url: "/vw-coa-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/coa-m.html",
            controller: 'coaviewCtrl'
          }
        }
      })
      .state('app.vw-coe-m', {
        url: "/vw-coe-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/coe-m.html",
            controller: 'coeviewCtrl'
          }
        }
      })
      .state('app.vw-coed-m', {
        url: "/vw-coed-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/coed-m.html",
            controller: 'coedviewCtrl'
          }
        }
      })
      .state('app.vw-con-m', {
        url: "/vw-con-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/con-m.html",
            controller: 'conviewCtrl'
          }
        }
      })
      .state('app.vw-cvm-m', {
        url: "/vw-cvm-m",
        views: {
          'menuContent': {
            templateUrl: "templates/views/cvm-m.html",
            controller: 'cvmviewCtrl'
          }
        }
      })
    //pr-rt
      .state('app.pr-rt-cas-m', {
        url: "/pr-rt-cas-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/cas-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-cbm-m', {
        url: "/pr-rt-cbm-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/cbm-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-cfes-m', {
        url: "/pr-rt-cfes-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/cfes-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-che-m', {
        url: "/pr-rt-che-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/che-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-coa-m', {
        url: "/pr-rt-coa-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/coa-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-coe-m', {
        url: "/pr-rt-coe-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/coe-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-coed-m', {
        url: "/pr-rt-coed-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/coed-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-con-m', {
        url: "/pr-rt-con-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/con-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-cvm-m', {
        url: "/pr-rt-cvm-m",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/cvm-m.html",
            controller: 'routeCtrl'
          }
        }
      })
      .state('app.pr-rt-mg', {
        url: "/pr-rt-mg",
        views: {
          'menuContent': {
            templateUrl: "templates/pr-rt/mg.html",
            controller: 'routeCtrl'
          }
        }
      })
    //Routing
      //MainGate
        .state('app.mg-adm', {
          url: "/route-main/mg-adm",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-adm.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.mg-cas-m', {
          url: "/route-main/mg-cas-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-cas-m.html"
            }
          }
        })
        .state('app.mg-coa-m', {
          url: "/route-main/mg-coa-m",
          views:{
            'menuContent' :{
                templateUrl: "templates/routing/mg-routes/mg-coa-m.html"
            }
          }
        })
        .state('app.mg-cbm-m', {
          url: "/route-main/mg-cbm-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-cbm-m.html"
            }
          }
        })
        .state('app.mg-coed-m', {
          url: "/route-main/mg-coed-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-coed-m.html"
            }
          }
        })
        .state('app.mg-coeng-m', {
          url: "/route-main/mg-coeng-m",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/mg-routes/mg-coeng-m.html"
              }
            }
        })
        .state('app.mg-cfes-m', {
          url: "/route-main/mg-cfes-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-cfes-m.html"
            }
          }
        })
        .state('app.mg-che-m', {
          url: "/route-main/mg-che-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-che-m.html"
            }
          }
        })
        .state('app.mg-con-m', {
          url: "/route-main/mg-con-m",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/mg-routes/mg-con-m.html"
              }
            }
        })
        .state('app.mg-cvm-m', {
          url: "/route-main/mg-cvm-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/mg-routes/mg-cvm-m.html"
            }
          }
        })
      //
      //Market
        .state('app.market-coa-m', {
          url: "/route-main/market-coa-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-coa-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-cas-m', {
          url: "/route-main/market-cas-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-cas-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-cbm-m', {
          url: "/route-main/market-cbm-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-cbm-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-cfes-m', {
          url: "/route-main/market-cfes-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-cfes-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-che-m', {
          url: "/route-main/market-che-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-che-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-coe-m', {
          url: "/route-main/market-coe-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-coe-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-coed-m', {
          url: "/route-main/market-coed-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-coed-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        .state('app.market-con-m', {
          url: "/route-main/market-con-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-con-m.html",
              controller: 'routeCtrl'
            }
          }
        })
         .state('app.market-cvm-m', {
          url: "/route-main/market-cvm-m",
          views:{
            'menuContent' :{
              templateUrl: "templates/routing/market-routes/market-cvm-m.html",
              controller: 'routeCtrl'
            }
          }
        })
        
      //
      //College of Agriculture
          .state('app.coa-adm', {
            url: "/route-main/coa-adm",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/coa-routes/coa-admin.html"
              }
            }
          })
          .state('app.coa-cas-m', {
            url: "/route-main/coa-cas-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coa-routes/coa-cas-m.html"
                }
              }
          })
          .state('app.coa-cbm-m', {
            url: "/route-main/coa-cbm-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coa-routes/coa-cbm-m.html"
                }
              }
          })
          .state('app.coa-coed-m', {
            url: "/route-main/coa-coed-m",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/coa-routes/coa-coed-m.html"
                }
              }
          })
          .state('app.coa-coe-m', {
            url: "/route-main/coa-coe-m",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/coa-routes/coa-coe-m.html"
              }
            }
          })
          .state('app.coa-cfes-m', {
            url: "/route-main/coa-cfes-m",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/coa-routes/coa-cfes-m.html"
              }
            }
          })
          .state('app.coa-che-m', {
            url: "/route-main/coa-che-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coa-routes/coa-che-m.html"
                }
              }
          })
          .state('app.coa-con-m', {
            url: "/route-main/coa-con-m",
            views:{
              'menuContent' :{
                templateUrl: "templates/routing/coa-routes/coa-con-m.html"
              }
            }
          })
          .state('app.coa-cvm-m', {
            url: "/route-main/coa-cvm-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coa-routes/coa-cvm-m.html"
                }
              }
          })
      //
      //college of Arts and Sciences
            .state('app.cas-adm',{
              url: "/route-main/cas-adm",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cas-routes/cas-admin.html"
                }      
              }
            })
            .state('app.cas-coa-m', {
              url: "/route-main/cas-coa-m",
                views:{
                  'menuContent' :{
                      templateUrl: "templates/routing/cas-routes/cas-coa-m.html"
                  }
                }
            })
            .state('app.cas-cbm-m', {
              url: "/route-main/cas-cbm-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cas-routes/cas-cbm-m.html"
                  }
                }
            })
            .state('app.cas-coe-m', {
              url: "/route-main/cas-coe-m",
                views:{
                  'menuContent' :{
                      templateUrl: "templates/routing/cas-routes/cas-coe-m.html"
                  }
                }
            })
            .state('app.cas-coed-m', {
              url: "/route-main/cas-coed-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cas-routes/cas-coed-m.html"
                }
              }
            })
            .state('app.cas-cfes-m', {
              url: "/route-main/cas-cfes-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cas-routes/cas-cfes-m.html"
                  }
                }
            })
            .state('app.cas-che-m', {
              url: "/route-main/cas-che-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cas-routes/cas-che-m.html"
                  }
                }
            })
            .state('app.cas-con-m', {
              url: "/route-main/cas-con-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cas-routes/cas-con-m.html"
                }
              }
            })
            .state('app.cas-cvm-m', {
              url: "/route-main/cas-cvm-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cas-routes/cas-cvm-m.html"
                  }
                }
            })
      //
      //College of Business Management
            .state('app.cbm-adm', {
              url: "/route-main/cbm-adm",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-admin.html"
                }
              }
            })
            .state('app.cbm-cas-m', {
              url: "/route-main/cbm-cas-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-cas-m.html"
                }
              }
            })
            .state('app.cbm-coa-m', {
              url: "/route-main/cbm-coa-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-coa-m.html"
                }
              }
            })
            .state('app.cbm-coe-m', {
              url: "/route-main/cbm-coe-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-coe-m.html"
                }
              }
            })
            .state('app.cbm-coed-m', {
              url: "/route-main/cbm-coed-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cbm-routes/cbm-coed-m.html"
                  }
                }
            })
            .state('app.cbm-cfes-m', {
              url: "/route-main/cbm-cfes-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-cfes-m.html"
                }
              }
            })
            .state('app.cbm-che-m', {
              url: "/route-main/cbm-che-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-che-m.html"
                }
              }
            })
            .state('app.cbm-con-m', {
              url: "/route-main/cbm-con-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-con-m.html"
                }
              }
            })
            .state('app.cbm-cvm-m', {
              url: "/route-main/cbm-cvm-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cbm-routes/cbm-cvm-m.html"
                }
              }
            })
      //
      //College of Engineering
            .state('app.coe-adm', {
              url: "/route-main/coe-adm",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-admin.html"
                }
              }
            })
            .state('app.coe-coa-m', {
              url: "/route-main/coe-coa-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-coa-m.html"
                }
              }
            })
            .state('app.coe-cas-m', {
              url: "/route-main/coe-cas-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-cas-m.html"
                }
              }
            })
             .state('app.coe-cbm-m', {
              url: "/route-main/coe-cas-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-cbm-m.html"
                }
              }
            })
            .state('app.coe-coed-m', {
              url: "/route-main/coe-coed-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-coed-m.html"
                }
              }
            })
            .state('app.coe-cfes-m', {
              url: "/route-main/coe-cfes-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-cfes-m.html"
                }
              }
            })
            .state('app.coe-che-m', {
              url: "/route-main/coe-che-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-che-m.html"
                }
              }
            })
            .state('app.coe-con-m', {
              url: "/route-main/coe-con-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-con-m.html"
                }
              }
            })
            .state('app.coe-cvm-m', {
              url: "/route-main/coe-cvm-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coe-routes/coe-cvm-m.html"
                }
              }
            })
            .state('app.coed-adm', {
              url: "/route-main/coed-adm",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coed-routes/coed-admin.html"
                }
              }
            })
      //
      //College of Education
            .state('app.coed-coa-m', {
              url: "/route-main/coed-coa-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coed-routes/coed-coa-m.html"
                }
              }
            })
            .state('app.coed-cas-m', {
              url: "/route-main/coed-cas-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coed-routes/coed-cas-m.html"
                }
              }
            })
            .state('app.coed-cbm-m', {
              url: "/route-main/coed-cbm-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coed-routes/coed-cbm-m.html"
                }
              }
            })
            .state('app.coed-coe-m', {
              url: "/route-main/coed-coe-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/coed-routes/coed-coe-m.html"
                }
              }
            })
            .state('app.coed-cfes-m', {
              url: "/route-main/coed-cfes-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/coed-routes/coed-cfes-m.html"
                  }
                }
            })
            .state('app.coed-che-m', {
              url: "/route-main/coed-che-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/coed-routes/coed-che-m.html"
                  }
                }
            })
            .state('app.coed-con-m', {
              url: "/route-main/coed-con-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coed-routes/coed-con-m.html"
                }
              }
            })
            .state('app.coed-cvm-m', {
              url: "/route-main/coed-cvm-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/coed-routes/coed-cvm-m.html"
                }
              }
            })
      //
      //College of Forestry and Environmental Science
            .state('app.cfes-admin', {
              url: "/route-main/cfes-admin",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cfes-routes/cfes-admin.html"
                }
              }
            })
            .state('app.cfes-coa-m', {
              url: "/route-main/cfes-coa-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cfes-routes/cfes-coa-m.html"
                  }
                }
            })
            .state('app.cfes-cas-m', {
              url: "/route-main/cfes-cas-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cfes-routes/cfes-cas-m.html"
                  }
                }
            })
            .state('app.cfes-cbm-m', {
              url: "/route-main/cfes-cbm-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cfes-routes/cfes-cbm-m.html"
                  }
                }
            })
            .state('app.cfes-coe-m', {
              url: "/route-main/cfes-coe-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cfes-routes/cfes-coe-m.html"
                  }
                }
            })
            .state('app.cfes-coed-m', {
              url: "/route-main/cfes-coed-m",
                views:{
                  'menuContent' :{
                      templateUrl: "templates/routing/cfes-routes/cfes-coed-m.html"
                   }
                }
            })
            .state('app.cfes-che-m', {
              url: "/route-main/cfes-che-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cfes-routes/cfes-che-m.html"
                }
              }
            })
            .state('app.cfes-con-m', {
              url: "/route-main/cfes-con-m",
              views:{
                'menuContent' :{
                  templateUrl: "templates/routing/cfes-routes/cfes-con-m.html"
                }
              }
            })
            .state('app.cfes-cvm-m', {
              url: "/route-main/cfes-cvm-m",
                views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/cfes-routes/cfes-cvm-m.html"
                  }
                }
            })
      //
      //College of Human Ecology
          .state('app.che-admin', {
            url: "/route-main/che-admin",
              views:{
                  'menuContent' :{
                    templateUrl: "templates/routing/che-routes/che-admin.html"
                    }
                  }
                })
                .state('app.che-coa-m', {
                      url: "/route-main/che-coa-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-coa-m.html"
                          }
                      }
                     })
                .state('app.che-cas-m', {
                      url: "/route-main/che-cas-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-cas-m.html"
                          }
                      }
                     })
                .state('app.che-cbm-m', {
                      url: "/route-main/che-cbm-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-cbm-m.html"
                          }
                      }
                     })
                .state('app.che-coe-m', {
                      url: "/route-main/che-coe-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-coe-m.html"
                          }
                      }
                     })
                .state('app.che-coed-m', {
                      url: "/route-main/che-coed-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-coed-m.html"
                          }
                      }
                     })
                .state('app.che-cfes-m', {
                      url: "/route-main/che-cfes-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-cfes-m.html"
                          }
                      }
                     })
                .state('app.che-con-m', {
                      url: "/route-main/che-con-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-con-m.html"
                          }
                      }
                     })
                .state('app.che-cvm-m', {
                      url: "/route-main/che-cvm-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/che-routes/che-cvm-m.html"
                          }
                      }
                     })
      //
      //College of Nursing
            .state('app.con-adm', {
                  url: "/route-main/con-adm",
                  views:{
                    'menuContent' :{
                      templateUrl: "templates/routing/con-routes/con-admin.html"
                      }
                  }
                    })
                  .state('app.con-coa-m', {
                        url: "/route-main/con-coa-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-coa-m.html"
                            }
                        }
                       })
                  .state('app.con-cas-m', {
                        url: "/route-main/con-cas-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-cas-m.html"
                            }
                        }
                       })
                  .state('app.con-cbm-m', {
                        url: "/route-main/con-cbm-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-cbm-m.html"
                            }
                        }
                       })
                  .state('app.con-coe-m', {
                        url: "/route-main/con-coe-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-coe-m.html"
                            }
                        }
                       })
                  .state('app.con-coed-m', {
                        url: "/route-main/con-coed-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-coed-m.html"
                            }
                        }
                       })
                  .state('app.con-cfes-m', {
                        url: "/route-main/con-cfes-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-cfes-m.html"
                            }
                        }
                       })
                  .state('app.con-che-m', {
                        url: "/route-main/con-che-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-che-m.html"
                            }
                        }
                       })
                  .state('app.con-cvm-m', {
                        url: "/route-main/con-cvm-m",
                        views:{
                          'menuContent' :{
                            templateUrl: "templates/routing/con-routes/con-cvm-m.html"
                            }
                        }
                       })
      //
      //College of Veterinary Medicine
                .state('app.cvm-adm', {
                      url: "/route-main/cvm-adm",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-admin.html"
                          }
                      }
                     })
                .state('app.cvm-coa-m', {
                      url: "/route-main/cvm-coa-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-coa-m.html"
                          }
                      }
                     })
                .state('app.cvm-cas-m', {
                      url: "/route-main/cvm-cas-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-cas-m.html"
                          }
                      }
                     })
                .state('app.cvm-cbm-m', {
                      url: "/route-main/cvm-cbm-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-cbm-m.html"
                          }
                      }
                     })
                .state('app.cvm-coe-m', {
                      url: "/route-main/cvm-coe-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-coe-m.html"
                          }
                      }
                     })
                .state('app.cvm-coed-m', {
                      url: "/route-main/cvm-coed-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-coed-m.html"
                          }
                      }
                     })
                .state('app.cvm-cfes-m', {
                      url: "/route-main/cvm-cfes-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-cfes-m.html"
                          }
                      }
                     })
                .state('app.cvm-che-m', {
                      url: "/route-main/cvm-che-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-che-m.html"
                          }
                      }
                     })
                .state('app.cvm-con-m', {
                      url: "/route-main/cvm-con-m",
                      views:{
                        'menuContent' :{
                          templateUrl: "templates/routing/cvm-routes/cvm-con-m.html"
                          }
                      }
                     })
          .state('app.web-map', {
              url: "/web-map",
              views: {
                'menuContent': {
                  templateUrl: "views/app/menu/web-map.html",
                  controller: 'WebMapCtrl'
                }
              }
          })
      //
  ;
  $urlRouterProvider.otherwise('/app/map-main');
});