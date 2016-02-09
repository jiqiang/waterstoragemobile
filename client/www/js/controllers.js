angular.module('watsto.controllers', ['watsto.services'])

.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.platform = ionic.Platform.platform();
}])

.controller('TabCtrl', ['$scope', 'FavouriteService', 'storage', function ($scope, FavouriteService, storage) {
  $scope.data = storage.data;
  console.log(storage.data);
  $scope.switchChange = function (item) {
    console.log(item);
  }
}])

.controller('FavouritesCtrl', ['$scope', 'FavouriteService', function ($scope, FavouriteService) {

  $scope.removeFavourite = function (index) {
    $scope.favouritesData.splice(index, 1);
    FavouriteService.remove(index);
  }

  $scope.$on('$ionicView.enter', function (e) {
    var obj,
        _type,
        _typeIndex,
        _storageIndex,
        favouritesData = [],
        favourites = FavouriteService.get();

    for (var i = 0; i < favourites.length; i++) {

      _type = favourites[i].type;
      _typeIndex = favourites[i].typeIndex;
      _storageIndex = favourites[i].storageIndex;

      if (_storageIndex !== null) {
        obj = $scope.data[_type][_typeIndex].storages[_storageIndex];
        obj.href = '#/tab/storage/' + _type + '/' + _typeIndex + '/' + _storageIndex;
      }
      else {
        obj = $scope.data[_type][_typeIndex];
        obj.href = '#/tab/storages/' + _type + '/' + _typeIndex;
      }
      favouritesData.push(obj);
    }
    $scope.favouritesData = favouritesData;
  });


  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}])

.controller('AboutCtrl', function($scope) {})

.controller('FiguresCtrl', ['$scope', '$ionicLoading', 'FavouriteService', function ($scope, $ionicLoading, FavouriteService) {

  $scope.addFavourite = FavouriteService.add;

  $scope.$on('$ionicView.beforeEnter', function (e) {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });

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
    if ($scope.subType == 'default') {
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

  $scope.storageDetail = $scope.data[$stateParams.type][$stateParams.typeIndex][$stateParams.subType][$stateParams.storageIndex];

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SearchCtrl', ['$scope', '$ionicLoading', function($scope, $ionicLoading) {

  $scope.$on('$ionicView.beforeEnter', function (e) {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });

  var storages = [], i, j, tempStorages;
  for (i = 0; i < $scope.data.states.length; i++) {
    for (j = 0; j < $scope.data.states[i].storages.length; j++) {
      var ts = $scope.data.states[i].storages[j];
      ts.type = 'states';
      ts.typeIndex = i;
      ts.storageIndex = j;
      storages.push(ts);
    }
  }

  $scope.storages = storages;

  $scope.keyword = {value: undefined};

  $scope.onKeywordChange = function () {
    tempStorages = [];
    for (i = 0; i < storages.length; i++) {
      if (storages[i].storage.indexOf($scope.keyword.value) != -1) {
        tempStorages.push(storages[i]);
      }
    }

    $scope.storages = tempStorages;
  }

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}]);
