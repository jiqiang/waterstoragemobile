angular.module('watsto.controllers', ['watsto.services'])

.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.platform = ionic.Platform.platform();
}])

.controller('TabCtrl', ['$scope', 'FavouriteService', 'storage', function ($scope, FavouriteService, storage) {
  $scope.data = storage.data;
  console.log(storage.data);
  $scope.getColorClass = function (figure) {

    if (figure && figure.indexOf('-') === 0) {
      return "assertive";
    }
    else if (figure && figure.indexOf('+') === 0) {
      return "balanced";
    }
  };
}])

.controller('FavouritesCtrl', ['$scope', 'FavouriteService', function ($scope, FavouriteService) {

  $scope.removeFavourite = function (index) {
    $scope.favouritesData.splice(index, 1);
    FavouriteService.remove(index);
  }

  $scope.$on('$ionicView.enter', function (e) {
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

.controller('FiguresCtrl', ['$scope', '$ionicLoading', 'FavouriteService', function ($scope, $ionicLoading, FavouriteService) {

  $scope.addFavourite = FavouriteService.add;

  $scope.$on('$ionicView.beforeEnter', function (e) {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });

  $scope.summary = $scope.data.national[0];

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}])

.controller('StoragesCtrl', ['$scope', '$stateParams', '$ionicLoading', 'FavouriteService', function ($scope, $stateParams, $ionicLoading, FavouriteService) {

  $scope.$on('$ionicView.beforeEnter', function (e) {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });

  $scope.$on('$ionicView.enter', function (e) {

    $scope.type = $stateParams.type;

    $scope.subType = $stateParams.subType;

    $scope.typeIndex = $stateParams.typeIndex;

    $scope.subTypeIndex = $stateParams.subTypeIndex;

    var item;
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

  });

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}])

.controller('StorageDetailCtrl', ['$scope', '$stateParams', '$ionicLoading', function ($scope, $stateParams, $ionicLoading) {
  $scope.$on('$ionicView.beforeEnter', function (e) {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });
  if ($stateParams.subType === 'storages') {
    $scope.storageDetail = $scope.data[$stateParams.type][$stateParams.typeIndex][$stateParams.subType][$stateParams.storageIndex];
  }
  else {
    $scope.storageDetail = $scope.data[$stateParams.type][$stateParams.typeIndex][$stateParams.subType][$stateParams.subTypeIndex].storages[$stateParams.storageIndex];
  }

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SearchCtrl', [
  '$scope',
  '$ionicLoading',
  'SearchService',
  function($scope, $ionicLoading, SearchService) {

    $scope.$on('$ionicView.beforeEnter', function (e) {
      $ionicLoading.show({
        template: 'Loading...'
      });
    });

    var list = SearchService.createList($scope.data);

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


    $scope.$on('$ionicView.afterEnter', function (e) {
      $ionicLoading.hide();
    });
}]);
