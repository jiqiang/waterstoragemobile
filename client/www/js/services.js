angular.module('watsto.services', [])

.factory('DataService', ['$http', function($http) {

  function fetch () {
    return $http({
      method: 'GET',
      url: 'data/data.json',
      timeout: 15000
    });
  }

  function saveToLocal (data) {
    window.localStorage.setItem('waterstoragedata', angular.toJson(data));
  }

  function isLocalDataOutdated () {
    var timestamp = window.localStorage.getItem('waterstoragedatatimestamp');

    if (timestamp === null || Date.now() - timestamp > 86400) {
      return true;
    }

    return false;
  }

  function setTimestamp () {
    window.localStorage.setItem('waterstoragedatatimestamp', Date.now());
  }

  return {
    fetch: fetch,
    saveToLocal: saveToLocal,
    isLocalDataOutdated: isLocalDataOutdated,
    setTimestamp: setTimestamp
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
