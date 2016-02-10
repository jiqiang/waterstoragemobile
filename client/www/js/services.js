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
  function add (type, typeIndex, subType, subTypeIndex, storageIndex) {
    var isExist = false, favourites = get();

    for (var i = 0; i < favourites.length; i++) {
      if (favourites[i].type === type
          && favourites[i].subType === subType
          && favourites[i].typeIndex === typeIndex
          && favourites[i].storageIndex === storageIndex
          && favourites[i].subTypeIndex === subTypeIndex) {
        isExist = true;
      }
    }

    if (!isExist) {
      favourites.push({type: type, subType: subType, typeIndex: typeIndex, storageIndex: storageIndex, subTypeIndex: subTypeIndex});
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
})

.factory('SearchService', function () {

  var i, j, k, l, list;

  function listItemExists (item) {
    for (k = 0; k < list.length; k++) {
      if (item.name === list[k].name && item.type === list[k].type) {
        return true;
      }
    }
    return false;
  }

  function addToList (item) {

    if (!listItemExists(item)) {
      list.push(item);
    }

  }

  function createList (rawData) {

    list = [];

    // National
    addToList({
      name: 'Australia',
      type: 'National',
      href: '#/tab/figure'
    });

    for (i = 0; i < rawData.states.length; i++) {

      // State
      addToList({
        name: rawData.states[i].title,
        type: 'State',
        href: '#/tab/storages/states/storages/' + i + '/-1'
      });

      // City and system
      for (j = 0; j < rawData.states[i].cityandsystem.length; j++) {
        addToList({
          name: rawData.states[i].cityandsystem[j].title,
          type: 'City / System',
          href: '#/tab/storages/states/cityandsystem/' + i + '/' + j
        });
      }

      // Storage
      for (j = 0; j < rawData.states[i].storages.length; j++) {
        addToList({
          name: rawData.states[i].storages[j].title,
          type: 'Water Storage',
          href: '#/tab/storage/states/storages/' + i + '/-1/' + j
        });
      }
    }

    // Drainage
    for (i = 0; i < rawData.drainages.length; i++) {
      addToList({
        name: rawData.drainages[i].title,
        type: 'Drainage Division',
        href: '#/tab/storages/drainages/storages/' + i + '/-1'
      });
    }

    // Sort list
    list.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }
      else {
        return 0;
      }
    });

    return list;

  }

  return {
    createList: createList
  };

});
