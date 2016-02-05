// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('watsto', ['ionic', 'watsto.controllers', 'watsto.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    resolve: {
      storage: ['DataService', function (DataService) {
        return DataService.fetch();
      }]
    },
    controller: 'TabCtrl'
  })

  // Each tab has its own nav history stack:

  .state('tab.favourites', {
    url: '/favourites',
    views: {
      'tab-favourites': {
        templateUrl: 'templates/tab-favourites.html',
        controller: 'FavouritesCtrl'
      }
    }
  })

  .state('tab.about', {
    url: '/about',
    views: {
      'tab-about': {
        templateUrl: 'templates/tab-about.html',
        controller: 'AboutCtrl'
      }
    }
  })
  .state('tab.features', {
    url: '/features',
    views: {
      'tab-about': {
        templateUrl: 'templates/about-features.html'
      }
    }
  })
  .state('tab.copyright', {
    url: '/copyright',
    views: {
      'tab-about': {
        templateUrl: 'templates/about-copyright.html'
      }
    }
  })
  .state('tab.disclaimer', {
    url: '/disclaimer',
    views: {
      'tab-about': {
        templateUrl: 'templates/about-disclaimer.html'
      }
    }
  })

  .state('tab.figures', {
      url: '/figures',
      views: {
        'tab-figures': {
          templateUrl: 'templates/tab-figures.html',
          controller: 'FiguresCtrl'
        }
      }
    })

  .state('tab.storages', {
    url: '/storages/:type/:typeIndex',
    views: {
      'tab-figures': {
        templateUrl: 'templates/tab-storages.html',
        controller: 'StoragesCtrl'
      }
    }
  })

  .state('tab.storage-detail', {
    url: '/storage/:type/:typeIndex/:storageIndex',
    views: {
      'tab-figures': {
        templateUrl: 'templates/storage-detail.html',
        controller: 'StorageDetailCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-search': {
        templateUrl: 'templates/tab-search.html',
        controller: 'SearchCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/about');

});
