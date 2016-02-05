angular.module('watsto.controllers', ['watsto.services'])

.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.platform = ionic.Platform.platform();
}])

.controller('TabCtrl', ['$scope', 'FavouriteService', 'storage', function ($scope, FavouriteService, storage) {
  $scope.data = storage.data;
  console.log(storage.data);
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
        obj.title = $scope.data[_type][_typeIndex].storages[_storageIndex].storage;
      }
      else {
        obj = $scope.data[_type][_typeIndex];
        obj.href = '#/tab/storages/' + _type + '/' + _typeIndex;
        obj.title = obj[(_type == 'states' ? 'state' : (_type == 'cities' ? 'city' : 'drainage'))];
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

    var name = $stateParams.type == 'states' ? 'state' : ($stateParams.type == 'cities' ? 'city' : ($stateParams.type == 'drainages' ? 'drainage' : ''));

    var item = $scope.data[$stateParams.type][$stateParams.typeIndex];

    $scope.type = $stateParams.type;

    $scope.typeIndex = $stateParams.typeIndex;

    $scope.viewTitle = item[name];

    $scope.storages = item.storages;

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

  $scope.storageDetail = $scope.data[$stateParams.type][$stateParams.typeIndex].storages[$stateParams.storageIndex];

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SearchCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
