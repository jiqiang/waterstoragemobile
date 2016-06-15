angular.module('watsto.controllers', ['watsto.services', 'ionic'])

.controller('AppCtrl', ['$scope', '$ionicScrollDelegate', function ($scope, $ionicScrollDelegate) {
  $scope.platform = ionic.Platform.platform();
  $scope.scrollToTop = function() {
    $ionicScrollDelegate.scrollTop(true);
  }
}])

.controller('TabCtrl', ['$scope', '$state', '$ionicPopup', 'DataService', function ($scope, $state, $ionicPopup, DataService) {
  $scope.goSearch = function(e) { $state.go('tab.search'); }
  $scope.goAbout = function(e) { $state.go('tab.about'); }

  $scope.isFigureIncreased = DataService.isFigureIncreased;
  /*
  var detailsPopup;
  $scope.showPopup = function() {
    detailsPopup = $ionicPopup.show({
      templateUrl: 'templates/water-storage-summary-details.html',
      scope: $scope,
    });
  }

  $scope.closePopup = function() {
    detailsPopup.close();
  }
  */
}])

.controller('FavouritesCtrl', [
  '$scope',
  'FavouriteService',
  'storage',
  function ($scope, FavouriteService, storage) {

  $scope.removeFavourite = function (index) {
    $scope.favouritesData.splice(index, 1);
    FavouriteService.remove(index);
  }

  $scope.$on('$ionicView.enter', function (e) {
    $scope.data = storage;
    var obj,
        _type,
        _subType,
        _typeIndex,
        _subTypeIndex,
        _storageIndex,
        favouritesData = [],
        favourites = FavouriteService.get();

    for (var i = 0; i < favourites.length; i++) {

      _type = favourites[i].type;
      _subType = favourites[i].subType;
      _typeIndex = favourites[i].typeIndex;
      _subTypeIndex = favourites[i].subTypeIndex;
      _storageIndex = favourites[i].storageIndex;

      if (_type !== null && _typeIndex !== null && _subType === null && _subTypeIndex === null && _storageIndex === null) {
        obj = $scope.data[_type][_typeIndex];
        obj.href = "#/tab/storages/" + _type + "/storages/" + _typeIndex + "/-1";
      }
      else if (_type !== null && _typeIndex !== null && _subType !== null && _subTypeIndex !== null && _storageIndex === null) {
        obj = $scope.data[_type][_typeIndex][_subType][_subTypeIndex];
        obj.href = "#/tab/storages/" + _type + "/cityandsystem/" + _typeIndex + "/" + _subTypeIndex;
      }
      else if (_type !== null && _typeIndex !== null && _subType === 'storages' && _subTypeIndex === -1 && _storageIndex !== null) {
        obj = $scope.data[_type][_typeIndex].storages[_storageIndex];
        obj.href = "#/tab/storage/" + _type + "/storages/" + _typeIndex + "/" + _subTypeIndex + "/" + _storageIndex;
      }
      else if (_type !== null && _typeIndex !== null && _subType === 'cityandsystem' && _subTypeIndex !== null && _storageIndex !== null) {
        obj = $scope.data[_type][_typeIndex]['cityandsystem'][_subTypeIndex].storages[_storageIndex];
        obj.href = "#/tab/storage/" + _type + "/cityandsystem/" + _typeIndex + "/" + _subTypeIndex + "/" + _storageIndex;
      }

      favouritesData.push(obj);
    }
    $scope.favouritesData = favouritesData;
  });
}])

.controller('AboutCtrl', function($scope) {})

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
}]);
