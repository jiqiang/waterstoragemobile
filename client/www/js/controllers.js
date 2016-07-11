angular.module('watsto.controllers', ['watsto.services', 'ionic'])

.controller('AppCtrl', ['$scope', '$ionicScrollDelegate', function ($scope, $ionicScrollDelegate) {
  $scope.platform = ionic.Platform.platform();
  $scope.scrollToTop = function() {
    $ionicScrollDelegate.scrollTop(true);
  }
  //ionic.Platform.fullScreen(true, false);

}])

.controller('TabCtrl', [
  '$scope',
  '$state',
  'DataService',
  '$ionicScrollDelegate',
  '$document',
  '$timeout',
  '$ionicPosition',
  'FavouriteService',
  'storage',
  'LocalStorageService',
  function ($scope, $state, DataService, $ionicScrollDelegate, $document, $timeout, $ionicPosition, FavouriteService, storage, LocalStorageService) {

    $scope.data = storage;
    $scope.favourites = LocalStorageService.use('waterstoragefavourites').getItems();
    $scope.visits = LocalStorageService.use('waterstoragerecentvisits').getItems();

    $scope.onMenuClick = function() {
      $scope.favourites = LocalStorageService.use('waterstoragefavourites').getItems();
      $scope.visits = LocalStorageService.use('waterstoragerecentvisits').getItems();
    }

    $scope.goSearch = function(e) { $state.go('tab.search'); }

    $scope.goAbout = function(e) { $state.go('tab.about'); }

    $scope.goPrivacy = function() { $state.go('tab.privacy'); }

    $scope.goFeedback = function() { $state.go('tab.feedback'); }

    $scope.goScroll = function(type) {

      $timeout(function() {
        var where = $document.find('.location-list .item-divider.item-type-'+type);
        var wherePosition = $ionicPosition.offset(where);

        if (!where.hasClass('expanded')) {
          where.triggerHandler('click');
        }

        $ionicScrollDelegate.scrollBy(wherePosition.left, wherePosition.top - 43, true);
      }, 100);

    }

    $scope.isFigureIncreased = DataService.isFigureIncreased;
}])

.controller('FiguresCtrl', [
  '$scope',
  '$ionicLoading',
  'FavouriteService',
  'ChartDataService',
  'DataService',
  'storage',
  'PopupService',
  function ($scope, $ionicLoading, FavouriteService, ChartDataService, DataService, storage, PopupService) {
    var popup;

    $scope.showPopup = function() {
      popup = PopupService.getPopup($scope);
    };

    $scope.closePopup = function() {
      popup.close();
    }

    function prepare(data, action) {
      $scope.viewTitle = "AUSTRALIA";
      $scope.data = data;
      $scope.addFavourite = FavouriteService.add;
      $scope.summary = data.national[0];
      $scope.chartData = ChartDataService.fetch('National', 'National', data.chart, action);
    }

    prepare(storage, 'viewisready');

    $scope.doRefresh = function () {
      DataService.fetch().then(function (newData) {
        prepare(newData, 'dorefresh');
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.$on('$ionicView.enter', function(e) {
      $scope.viewisentered = true;
    });

}])

.controller('StoragesCtrl', [
  '$scope',
  '$stateParams',
  '$ionicLoading',
  'FavouriteService',
  'DataService',
  'ChartDataService',
  'storage',
  'PopupService',
  function ($scope, $stateParams, $ionicLoading, FavouriteService, DataService, ChartDataService, storage, PopupService) {

    var popup;

    $scope.showPopup = function() {
      popup = PopupService.getPopup($scope);
    };

    $scope.closePopup = function() {
      popup.close();
    }

    function prepare(data, action) {
      var item;

      $scope.data = data;
      $scope.type = $stateParams.type;
      $scope.subType = $stateParams.subType;
      $scope.typeIndex = $stateParams.typeIndex;
      $scope.subTypeIndex = $stateParams.subTypeIndex;
      $scope.cityandsystem = [];

      if ($scope.subType == 'storages') {
        item = $scope.data[$stateParams.type][$stateParams.typeIndex];
        $scope.cityandsystem = item.cityandsystem;
      }
      else {
        item = $scope.data[$stateParams.type][$stateParams.typeIndex].cityandsystem[$stateParams.subTypeIndex];
      }

      if ($scope.type != 'cities') {
        $scope.showCityAndSystem = $scope.cityandsystem.length > 0;
      }

      $scope.viewTitle = item.title;
      $scope.storages = item.storages;
      $scope.summary = item;
      $scope.addFavourite = FavouriteService.add;
      $scope.grouptype = item.subtype;
      $scope.groupvalue = item.title;
      $scope.chartData = ChartDataService.fetch(item.subtype, item.title, data.chart, action);
    }

    prepare(storage, 'viewisready');

    $scope.doRefresh = function () {
      DataService.fetch().then(function (newData) {
        prepare(newData, 'dorefresh');
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.$on('$ionicView.enter', function(e) {
      $scope.viewisentered = true;
    });

}])

.controller('StorageDetailCtrl', [
  '$scope',
  '$stateParams',
  '$ionicLoading',
  'DataService',
  'ChartDataService',
  'storage',
  'PopupService',
  function ($scope, $stateParams, $ionicLoading, DataService, ChartDataService, storage, PopupService) {
    var popup;

    $scope.showPopup = function() {
      popup = PopupService.getPopup($scope);
    };

    $scope.closePopup = function() {
      popup.close();
    }

    function prepare(data, action) {
      $scope.data = data;

      if ($stateParams.subType === 'storages') {
        $scope.summary = $scope.data[$stateParams.type][$stateParams.typeIndex][$stateParams.subType][$stateParams.storageIndex];
      }
      else {
        $scope.summary = $scope.data[$stateParams.type][$stateParams.typeIndex][$stateParams.subType][$stateParams.subTypeIndex].storages[$stateParams.storageIndex];
      }

      $scope.chartData = ChartDataService.fetch("storages", $scope.summary.title, storage.chart, action);
      $scope.viewTitle = $scope.summary.title;
    }

    prepare(storage, 'viewisready');

    $scope.doRefresh = function () {
      DataService.fetch().then(function (newData) {
        prepare(newData, 'dorefresh');
        $scope.$broadcast('scroll.refreshComplete');
      });
    };

    $scope.$on('$ionicView.enter', function (e) {
      $scope.viewisentered = true;
    });
}])

.controller('SearchCtrl', [
  '$scope',
  '$ionicLoading',
  'SearchService',
  'storage',
  function($scope, $ionicLoading, SearchService, storage) {

    $scope.data = storage;

    var list = SearchService.createList(storage);

    $scope.keyword = {value: undefined};

    $scope.onKeywordChange = function () {
      var newList = [];

      for (i = 0; i < list.length; i++) {
        if (list[i].name.toLowerCase().indexOf($scope.keyword.value.toLowerCase()) != -1) {
          newList.push(list[i]);
        }
      }

      $scope.list = newList;
    }

    $scope.list = list;
}])

.controller('FeedbackCtrl', ['$scope', '$ionicLoading', '$state', 'FeedbackService', function($scope, $ionicLoading, $state, FeedbackService) {
  $scope.feedback = {email: '', comments: ''};
  $scope.sendFeedback = function() {

    if ($scope.feedback.email != "" && !FeedbackService.validate($scope.feedback.email)) {
      $ionicLoading.show({ template: 'Email is invalid!', noBackdrop: true, duration: 1000 });
    }
    else if ($scope.feedback.comments == "") {
      $ionicLoading.show({ template: 'Comments is required!', noBackdrop: true, duration: 1000 });
    }
    else {
      FeedbackService
        .send($scope.feedback.email, $scope.feedback.comments)
        .then(function(response) {
          console.log(response);
          $ionicLoading.show({ template: 'Feedback sent!', noBackdrop: true, duration: 1000 });
          $state.go('tab.figures');
        }, function(response) {});
    }
  }
}]);
