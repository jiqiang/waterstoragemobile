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

    $scope.viewTitle = $stateParams.value;

    var typeItems = $scope.data[$stateParams.type];

    for (var i = 0; i < typeItems.length; i++) {
      if ($stateParams.type == 'states' && typeItems[i].state == $stateParams.value) {
        $scope.storages = typeItems[i].storages;
        break;
      }
      else if ($stateParams.type == 'cities' && typeItems[i].city == $stateParams.value) {
        $scope.storages = typeItems[i].storages;
        break;
      }
      else if ($stateParams.type == 'drainages' && typeItems[i].drainage == $stateParams.value) {
        $scope.storages = typeItems[i].storages;
        break;
      }
    }
  });

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
