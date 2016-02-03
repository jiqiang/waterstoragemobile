angular.module('watsto.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Tasmania',
    lastText: 'CAPACITY: 22,141,361 ML',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'New South Wales',
    lastText: 'CAPACITY: 21,352,134 ML',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Victoria',
    lastText: 'CAPACITY: 12,233,343 ML',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Western Australia',
    lastText: 'CAPACITY: 34,232,333 ML',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Queensland',
    lastText: 'CAPACITY: 12,233,343 ML',
    face: 'img/mike.png'
  } , {
    id: 5,
    name: 'South Australia',
    lastText: 'CAPACITY: 12,233,343 ML',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('DataService', ['$http', function($http) {

  function fetch () {
    return $http.get('data/data.json');
  }

  return {
    fetch: fetch
  };
}])
