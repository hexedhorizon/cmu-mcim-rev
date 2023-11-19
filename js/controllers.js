angular.module('cmu-mcim.controllers', [])
  // APP 
  .controller('AppCtrl', function($scope, $ionicConfig, $ionicPopup) {
    $scope.feed = function(){
      var alertPopup = $ionicPopup.alert({
            title: 'Notice',
            template: 'You need a data connection to view full content the page'
      })
    }
    
  })
  
  // FEED
  .controller('FeedsCategoriesCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup) {
    var alertPopup = $ionicPopup.alert({
            title: 'Notice',
            template: 'You need a data connection to view full content the page'
      })
    $scope.feeds_categories = [];

    $http.get('json/feed/feeds-categories.json').success(function(response) {
      $scope.feeds_categories = response;
    });
     $scope.showHelp = function() {
       $ionicActionSheet.show({
          titleText: ''+
                      '<h4 class="actionsheet-title ">Help<h4>'+
                      '<h3 class="actionsheet-title ">Click on a news category to start</h3>'+

              '',
          buttons: [
        { text: '<i class="icon ion-share"></i> Share' },
        { text: '<i class="icon ion-arrow-move"></i> Move' },
        ],
          destructiveText: '<i class="icon ion-android-cancel"></i>Close',
          
          cancel: function() {
            console.log('CANCELLED');
          },
          buttonClicked: function(index) {
            console.log('BUTTON CLICKED', index);
            return true;
          },
          destructiveButtonClicked: function() {
            console.log('DESTRUCT');
            return true;
          }
        });
        
    };
  })
  .controller('CategoryFeedsCtrl', function($scope, $http, $stateParams) {
    $scope.category_sources = [];

    $scope.categoryId = $stateParams.categoryId;

    $http.get('json/feed/feeds-categories.json').success(function(response) {
      var category = _.find(response, {id: $scope.categoryId});
      $scope.categoryTitle = category.title;
      $scope.category_sources = category.feed_sources;
    });
  })
  .controller('FeedEntriesCtrl', function($scope, $stateParams, $http, FeedList, $q, $ionicLoading, BookMarkService) {

     

    $scope.feed = [];

    var categoryId = $stateParams.categoryId,
        sourceId = $stateParams.sourceId;

    $scope.doRefresh = function() {

      $http.get('json/feed/feeds-categories.json').success(function(response) {

        $ionicLoading.show({
          template: 'Loading entries...'
        });

        var category = _.find(response, {id: categoryId }),
            source = _.find(category.feed_sources, {id: sourceId });

        $scope.sourceTitle = source.title;

        FeedList.get(source.url)
        .then(function (result) {
          $scope.feed = result;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        }, function (reason) {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        });
      });
    }; 

    $scope.doRefresh();
   
    $scope.bookmarkPost = function(post){
      $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
      BookMarkService.bookmarkFeedPost(post);
    };
  })
  .controller('BookMarksCtrl', function($scope, $rootScope, BookMarkService, $state) {

    $scope.bookmarks = BookMarkService.getBookmarks();

    // When a new post is bookmarked, we should update bookmarks list
    $rootScope.$on("new-bookmark", function(event){
      $scope.bookmarks = BookMarkService.getBookmarks();
    });

    $scope.goToFeedPost = function(link){
      window.open(link, '_blank', 'location=yes');
    };
    $scope.goToWordpressPost = function(postId){
      $state.go('app.post', {postId: postId});
    };
  })
  .controller('WordpressCtrl', function($scope, $http, $ionicLoading, PostService, BookMarkService) {
    $scope.posts = [];
    $scope.page = 1;
    $scope.totalPages = 1;

    $scope.doRefresh = function() {
      $ionicLoading.show({
        template: 'Loading posts...'
      });

      //Always bring me the latest posts => page=1
      PostService.getRecentPosts(1)
      .then(function(data){
        $scope.totalPages = data.pages;
        $scope.posts = PostService.shortenPosts(data.posts);

        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.loadMoreData = function(){
      $scope.page += 1;

      PostService.getRecentPosts($scope.page)
      .then(function(data){
        //We will update this value in every request because new posts can be created
        $scope.totalPages = data.pages;
        var new_posts = PostService.shortenPosts(data.posts);
        $scope.posts = $scope.posts.concat(new_posts);

        $scope.$broadcast('scroll.infiniteScrollComplete');
      });
    };

    $scope.moreDataCanBeLoaded = function(){
      return $scope.totalPages > $scope.page;
    };

    $scope.bookmarkPost = function(post){
      $ionicLoading.show({ template: 'Post Saved!', noBackdrop: true, duration: 1000 });
      BookMarkService.bookmarkWordpressPost(post);
    };

    $scope.doRefresh();
  })
  .controller('WordpressPostCtrl', function($scope, post_data, $ionicLoading) {

    $scope.post = post_data.post;
    $ionicLoading.hide();

    $scope.sharePost = function(link){
      window.plugins.socialsharing.share('Check this post here: ', null, null, link);
    };
  })
  .controller('mapCtrl', function($scope, $http,$ionicActionSheet){

   $scope.showLegends = function(){
      $ionicActionSheet.show({
          titleText: ''+
                      '<h3 class="actionsheet-title ">Help<h3>'+
                      '<h4 class="actionsheet-title ">Tap a location pin <i class="actionsheet-logo fa ion-android-pin"></i> to view location</h4>'+
                      '<br>'+
                      '<h4 class="actionsheet-title "></i>Map Legends</h4>'+
                      '<h4 class="actionsheet-title "><i class="actionsheet-logo fa fa-institution"></i>  College</h4>'+
                      '<h4 class="actionsheet-title "><i class="actionsheet-logo fa fa-building-o"></i>  Office | Facility</h4>'+
                      '<h4 class="actionsheet-title "><i class="actionsheet-logo fa fa-soccer-ball-o"></i>  Sports and Recreational Facility</h4>'+
                      '<h4 class="actionsheet-title "><i class="actionsheet-logo fa fa fa-home"></i>  Dormitory</h4>'+
                      '<h4 class="actionsheet-title "><i class="actionsheet-logo fa fa fa-medkit"></i>  Hospital</h4>'+
                      '<h4 class="actionsheet-title "><i class="actionsheet-logo fa fa fa-binoculars"></i>  Landmarks</h4>'+
              '',
          destructiveText: '<i class="icon ion-android-cancel"></i>Close',
         //cancelText: '<i class="icon fa fa-institution"></i>',
          cancel: function() {
            console.log('CANCELLED');
          },
          buttonClicked: function(index) {
            console.log('BUTTON CLICKED', index);
            return true;
          },
          destructiveButtonClicked: function() {
            console.log('DESTRUCT');
            return true;
          }
        });
    };
  })
  .controller('searchCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup,$ionicModal){

    $http.get('json/search/search-data.json').success(function(searchdatas) {
      $scope.searchData= searchdatas;
    });
    
    $scope.showHelp = function() {
        $ionicActionSheet.show({
          titleText: ''+
                      '<h4 class="actionsheet-title ">Help<h4>'+
                      '<h3 class="actionsheet-title "></h3>'+

              '',
          destructiveText: '<i class="icon ion-android-cancel"></i>Close',
          //cancelText: '<i class="icon fa fa-institution"></i>',
          cancel: function() {
            console.log('CANCELLED');
          },
          buttonClicked: function(index) {
            console.log('BUTTON CLICKED', index);
            return true;
          },
          destructiveButtonClicked: function() {
            console.log('DESTRUCT');
            return true;
          }
        });
        
    };
  })
  //OFFLINE
   
   .controller('casviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup, $ionicLoading){
       
    })
    .controller('cbmviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    .controller('cfesviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    .controller('cheviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    .controller('coaviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    .controller('coeviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    .controller('coedviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    .controller('conviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
       
    })
    .controller('cvmviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        
    })
    /*
  
  //Local
  /*  
   .controller('casviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup, $ionicLoading){
       $http.get('http://cmunav.musuan.site/php/cas.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/cas_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });

    })
    .controller('cbmviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/cbm.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/cbm_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('cfesviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/cfes.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/cfes_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('cheviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/che.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/che_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('coaviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/coa.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/coa_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('coeviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
       $http.get('http://cmunav.musuan.site/php/coe.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/coe_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('coedviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/coed.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/coed_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('conviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/nursing.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/con_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    })
    .controller('cvmviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        $http.get('http://cmunav.musuan.site/php/cvm.php').success(
          function(response){
            console.log(response);
            $scope.items = response;
        });

        $http.get('http://cmunav.musuan.site/php/cvm_courses.php').success(
          function(response){
            console.log(response);
            $scope.items1 = response;
        });
    }) 
  */
  //Online 
    .controller('casviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup, $ionicLoading){
        /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
         $http.get('http://cmunav.musuan.site/php/cas.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/cas_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });

      })
      .controller('cbmviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
           /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/cbm.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/cbm_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('cfesviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
           /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/cfes.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/cfes_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('cheviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
       /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/che.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/che_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('coaviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/coa.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/coa_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('coeviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
         $http.get('http://cmunav.musuan.site/php/coe.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/coe_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('coedviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
       /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/coed.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/coed_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('conviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/nursing.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/con_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
      .controller('cvmviewCtrl', function($scope, $http,$ionicActionSheet,$ionicPopup){
        /*
         var alertPopup = $ionicPopup.alert({
              title: 'Data Connection Needed',
              template: 'Internet connection is needed to view the full content of the page'
            })
        */
          $http.get('http://cmunav.musuan.site/php/cvm.php').success(
            function(response){
              console.log(response);
              $scope.items = response;
          });

          $http.get('http://cmunav.musuan.site/php/cvm_courses.php').success(
            function(response){
              console.log(response);
              $scope.items1 = response;
          });
      })
  
  .controller('routeCtrl', function($state,$scope,$ionicPopup,$ionicModal,$timeout,$ionicActionSheet){
    $scope.showHelp = function() {
        $ionicActionSheet.show({
          titleText: ''+
                      '<h3 class="actionsheet-title ">Quick Guide<h3>'+
                      '<h4 class="actionsheet-title ">1. Enter a starting location</h4>'+
                      '<h4 class="actionsheet-title ">2. Enter a destination</h4>'+
                      '<h4 class="actionsheet-title ">3. Tap the "Show Path" button to view the corresponding route</h4>'+              
              '',
          destructiveText: '<i class="icon ion-android-cancel"></i>Close',
          //cancelText: '<i class="icon fa fa-institution"></i>',
          cancel: function() {
            console.log('CANCELLED');
          },
          buttonClicked: function(index) {
            console.log('BUTTON CLICKED', index);
            return true;
          },
          destructiveButtonClicked: function() {
            console.log('DESTRUCT');
            return true;
          }
        });
        
    };
    $scope.mgcas = function() {
        $ionicActionSheet.show({
          titleText: ''+
                      '<h3 class="actionsheet-title ">Quick Guide<h3>'+
                      '<h4 class="actionsheet-title ">1. Enter a starting location</h4>'+
                      '<h4 class="actionsheet-title ">2. Enter a destination</h4>'+
                      '<h4 class="actionsheet-title ">3. Tap the "Show Path" button to view the corresponding route</h4>'+
                            
              '',
          destructiveText: '<i class="icon ion-android-cancel"></i>Close',
          //cancelText: '<i class="icon fa fa-institution"></i>',
          cancel: function() {
            console.log('CANCELLED');
          },
          buttonClicked: function(index) {
            console.log('BUTTON CLICKED', index);
            return true;
          },
          destructiveButtonClicked: function() {
            console.log('DESTRUCT');
            return true;
          }
        });
    };
     
    $scope.selectedLocationFrom = "";
    $scope.routeLocationsFrom = [
      "College of Agriculture",                            
      "College of Arts and Sciences",                            
      "College of Business Management",
      "College of Education",
      "College of Engineering",                   
      "College of Forestry and Environmental Science",
      "College of Human Ecology",
      "College of Nursing",
      "College of Veterinary Medicine",
      "Main Gate"
      //"Administration Building"                               
    ];

    $scope.selectedLocationTo = "";
    $scope.routeLocationsTo = [
      "College of Agriculture",                            
      "College of Arts and Sciences",                            
      "College of Business Management",
      "College of Education",
      "College of Engineering",                   
      "College of Forestry and Environmental Science",
      "College of Human Ecology",
      "College of Nursing",
      "College of Veterinary Medicine",
      "Market",
      "Administration Building"
    ];

     $scope.goToRoute = function(routeFrom,routeTo){
        $scope.routeFrom = routeFrom;
        $scope.routeTo = routeTo;
        var routeID;
        var from;
        var to; 

          if ($scope.routeFrom===''){
            var alertPopup = $ionicPopup.alert({
            title: 'Invalid Input',
            template: 'Please enter a starting point!'
          })
          }else if($scope.routeTo===''){
            var alertPopup = $ionicPopup.alert({
            title: 'Invalid Input',
            template: 'Please enter a destination!'
          })
          }else if($scope.routeFrom===''&&$scope.routeTo===''){
            var alertPopup = $ionicPopup.alert({
            title: 'Invalid Input',
            template: 'Please Enter Something!'
          })
          }else if($scope.routeFrom=='Main Gate'&&$scope.routeTo=='Main Gate'){
            var alertPopup = $ionicPopup.alert({
            title: 'Invalid Input',
            template: 'Please try another route!'
          })
          }else{
            //Main Gate to destination
              if($scope.routeFrom==="Main Gate" && $scope.routeTo==="Administration Building"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-adm');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Arts and Sciences"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-cas-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Agriculture"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-coa-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Business Management"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-cbm-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Education"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-coed-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Engineering"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-coeng-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Forestry and Environmental Science"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-cfes-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Human Ecology"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-che-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Nursing"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.mg-con-m');
              }
              else if($scope.routeFrom==="Main Gate" && $scope.routeTo==="College of Veterinary Medicine"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
              $state.go('app.mg-cvm-m');
              }
            //Market
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-cas-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-coa-m');
              }
              else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-cbm-m');
              }
              else if($scope.routeFrom==="College of Education" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-coed-m');
              }
              else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-coe-m');
              }
              else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-cfes-m');
              }
              else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-che-m');
              }
              else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.market-con-m');
              }
              else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="Market"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
              $state.go('app.market-cvm-m');
              }
            //College of Agriculture to destination
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="Administration Building"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-adm');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Arts and Sciences"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-cas-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Business Management"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-cbm-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Education"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-coed-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Engineering"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-coe-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Forestry and Environmental Science"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-cfes-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Human Ecology"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-che-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Nursing"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-con-m');
              }
              else if($scope.routeFrom==="College of Agriculture" && $scope.routeTo==="College of Veterinary Medicine"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.coa-cvm-m');
              }
            //Arts and Sciences to destination
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="Administration Building"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-adm');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Agriculture"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-coa-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Business Management"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-cbm-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Education"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-coed-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Engineering"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-coe-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Forestry and Environmental Science"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-cfes-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Human Ecology"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-che-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Nursing"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-con-m');
              }
              else if($scope.routeFrom==="College of Arts and Sciences" && $scope.routeTo==="College of Veterinary Medicine"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cas-cvm-m');
              }
            //Business Management to destination
              else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="Administration Building"){
                routeID = from +'-'+ to;
                console.log("Your route was from "+ from +" to "+ to);
                $state.go('app.cbm-adm');
              }
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-cas-m');
                      }
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-coa-m');
                      }
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Engineering"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-coe-m');
                      }
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Education"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-coed-m');
                      }
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Forestry and Environmental Science"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-cfes-m');
                      }
                      
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Human Ecology"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-che-m');
                      }
                        else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Nursing"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-con-m');
                      }
                       else if($scope.routeFrom==="College of Business Management" && $scope.routeTo==="College of Veterinary Medicine"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cbm-cvm-m');
                      }
            //Engineering to Destination
                else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="Administration Building"){
                  routeID = from +'-'+ to;
                  console.log("Your route was from "+ from +" to "+ to);
                  $state.go('app.coe-adm');
                }
                       else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-cas-m');
                      }
                      else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Business Management"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-cbm-m');
                      }
                       else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-coa-m');
                      }
                       else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Education"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-coed-m');
                      }
                      else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Forestry and Environmental Science"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-cfes-m');
                      }
                       else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Human Ecology"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-che-m');
                      }
                        else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Nursing"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coe-con-m');
                      }
                      else if($scope.routeFrom==="College of Engineering" && $scope.routeTo==="College of Veterinary Medicine"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                        $state.go('app.coe-cvm-m');
                      }
            //Education to destination
                      else if($scope.routeFrom==="College of Education" && $scope.routeTo==="Administration Building"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-adm');
                      }
                      else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-coa-m');
                      }
                      else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-cas-m');
                      }
                      else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Business Management"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-cbm-m');
                      }
                       else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Engineering"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-coe-m');
                      }
                       else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Forestry and Environmental Science"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-cfes-m');
                      }
                      else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Human Ecology"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-che-m');
                      }
                      else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Nursing"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-con-m');
                      }
                       else if($scope.routeFrom==="College of Education" && $scope.routeTo==="College of Veterinary Medicine"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.coed-cvm-m');
                      }
            //cfes to destination
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="Administration Building"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-admin');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-coa-m');
                      }
                       else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-cas-m');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Business Management"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-cbm-m');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Engineering"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-coe-m');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Education"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-coed-m');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Human Ecology"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-che-m');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Nursing"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-con-m');
                      }
                      else if($scope.routeFrom==="College of Forestry and Environmental Science" && $scope.routeTo==="College of Veterinary Medicine"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cfes-cvm-m');
                      }
            //Human ecology to des
                      else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="Administration Building"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-admin');
                      }
                      else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-coa-m');
                      }
                       else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-cas-m');
                      }
                      else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Business Management"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-cbm-m');
                      }
                       else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Engineering"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-coe-m');
                      }
                       else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Education"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-coed-m');
                      }
                      else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Forestry and Environmental Science"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-cfes-m');
                      }
                      else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Nursing"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-con-m');
                      }
                      else if($scope.routeFrom==="College of Human Ecology" && $scope.routeTo==="College of Veterinary Medicine"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.che-cvm-m');
                      }
            //Nursing to destination
              else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="Administration Building"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-adm');
                      }
                       else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-coa-m');
                      }
                      else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-cas-m');
                      }
                      else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Business Management"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-cbm-m');
                      }
                        else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Engineering"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-coe-m');
                      }
                    else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Education"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-coed-m');
                      }
                       else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Forestry and Environmental Science"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-cfes-m');
                      }
                     else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Human Ecology"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-che-m');
                      }
                       else if($scope.routeFrom==="College of Nursing" && $scope.routeTo==="College of Veterinary Medicine"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.con-cvm-m');
                      }
            //cvm to destination
               else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="Administration Building"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-adm');
                      }
                       else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Agriculture"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-coa-m');
                      }
                      else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Arts and Sciences"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-cas-m');
                      }
                       else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Business Management"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-cbm-m');
                      }
                       else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Engineering"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-coe-m');
                      }
                      else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Education"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-coed-m');
                      }
                      else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Forestry and Environmental Science"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-cfes-m');
                      }
                      else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Human Ecology"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-che-m');
                      }
                       else if($scope.routeFrom==="College of Veterinary Medicine" && $scope.routeTo==="College of Nursing"){
                        routeID = from +'-'+ to;
                        console.log("Your route was from "+ from +" to "+ to);
                         $state.go('app.cvm-che-m');
                      }        
            }

    };
  })

  .controller('WebMapCtrl', function($scope, $ionicLoading) {

    $scope.info_position = {
      lat: 7.858943 ,
      lng: 125.05227
    };
  
    $scope.center_position = {
      lat: 7.858943 ,
      lng: 125.05227
    };
  
    $scope.my_location = "";
  
    $scope.$on('mapInitialized', function(event, map) {
      $scope.map = map;
    });
  
    $scope.centerOnMe= function(){
  
      $scope.positions = [];
  
      $ionicLoading.show({
        template: 'Loading...'
      });
  
      // with this function you can get the user’s current position
      // we use this plugin: https://github.com/apache/cordova-plugin-geolocation/
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.current_position = {lat: position.coords.latitude, lng: position.coords.longitude};
        $scope.my_location = position.coords.latitude + ", " + position.coords.longitude;
        $scope.map.setCenter(pos);
        $ionicLoading.hide();
      }, function(err) {
           // error
          $ionicLoading.hide();
      });
    };
  })
  
;

