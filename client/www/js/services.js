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

.factory('FavouriteService', function () {
  function add (type, typeIndex, storageIndex) {
    var isExist = false, favourites = get();

    for (var i = 0; i < favourites.length; i++) {
      if (favourites[i].type === type && favourites[i].typeIndex === typeIndex && favourites[i].storageIndex === storageIndex) {
        isExist = true;
      }
    }

    if (!isExist) {
      favourites.push({type: type, typeIndex: typeIndex, storageIndex: storageIndex});
      window.localStorage.setItem('waterstoragefavourites', angular.toJson(favourites));
    }
  }

  function get () {
    var favourites_json = window.localStorage.getItem('waterstoragefavourites');

    if (favourites_json) {
      return angular.fromJson(favourites_json);
    }

    return [];
  }

  function remove (index) {
    var favourites = get();

    favourites.splice(index, 1);

    window.localStorage.setItem('waterstoragefavourites', angular.toJson(favourites));
  }

  return {
    add: add,
    get: get,
    remove: remove
  };
});

