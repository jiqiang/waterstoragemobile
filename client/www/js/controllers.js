angular.module('watsto.controllers', ['watsto.services'])

.controller('AppCtrl', ['$scope', function ($scope) {
  $scope.platform = ionic.Platform.platform();
}])

.controller('FavouritesCtrl', ['$scope', function ($scope) {

}])

.controller('AboutCtrl', function($scope) {})

.controller('FiguresCtrl', function($scope, Chats, rest) {
  console.log(rest);
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
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SearchCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
