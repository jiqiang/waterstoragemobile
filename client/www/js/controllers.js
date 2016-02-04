angular.module('watsto.controllers', ['watsto.services'])

.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.platform = ionic.Platform.platform();
}])

.controller('TabCtrl', ['$scope', 'storage', function ($scope, storage) {
  $scope.data = storage.data;
  console.log(storage);
}])

.controller('FavouritesCtrl', ['$scope', 'Chats', function ($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}])

.controller('AboutCtrl', function($scope) {})

.controller('FiguresCtrl', ['$scope', '$ionicLoading', function ($scope, $ionicLoading) {

  $scope.$on('$ionicView.beforeEnter', function (e) {
    $ionicLoading.show({
      template: 'Loading...'
    });
  });

  $scope.$on('$ionicView.afterEnter', function (e) {
    $ionicLoading.hide();
  });
}])

.controller('StoragesCtrl', ['$scope', '$stateParams', '$ionicLoading', function ($scope, $stateParams, $ionicLoading) {

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
