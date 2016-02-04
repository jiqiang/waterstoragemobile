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

.controller('FiguresCtrl', ['$scope', 'Chats', function($scope, Chats) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
}])

.controller('StoragesCtrl', ['$scope', '$stateParams', function ($scope, $stateParams) {

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

}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SearchCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
