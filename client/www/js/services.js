angular.module('watsto.services', [])

.factory('DataService', ['$http', '$q', 'ConfigService', function($http, $q, ConfigService) {

  // Initialize data.
  var wsData = {
    cities: [],
    drainages: [],
    national: [],
    states: []
  };

  function getFromRemote () {
    console.log('get data from remote');

    return $http({
      method: 'GET',
      url: ConfigService.getDataUrl(),
      timeout: 15000
    });
  }

  function saveToLocal () {
    console.log('save data to local');

    window.localStorage.setItem('waterstoragedata', angular.toJson(wsData));
  }

  function getFromLocal () {
    console.log('get data from local');

    wsData = angular.fromJson(window.localStorage.getItem('waterstoragedata'));
  }

  function isLocalDataOutdated () {
    var timestamp = window.localStorage.getItem('waterstoragedatatimestamp');

    if (timestamp === null) {
      console.log('local data is outdated - no timestamp found');
      return true;
    }

    var now = Date.now();
    if (Math.floor(Date.now() / 1000) - timestamp > 86400) {
      console.log('local data is outdated - ' + parseInt(Math.floor(Date.now() / 1000) - timestamp));
      return true;
    }

    console.log('local data is not outdated');

    return false;
  }

  function localDataExists () {
    return window.localStorage.getItem('waterstoragedata') === null ? false : true;

  }

  function setLocalDataTimestamp () {
    window.localStorage.setItem('waterstoragedatatimestamp', Math.floor(Date.now() / 1000));
  }

  function isLocalDataLoaded () {
    if (wsData.cities.length === 0
      || wsData.drainages.length === 0
      || wsData.states.length === 0
      || wsData.national.length ===0) {
      console.log('local data is not loaded');
      return false;
    }
    console.log('local data is loaded');
    return true;
  }

  return {
    fetch: function () {

      var deferred = $q.defer();

      if (isLocalDataOutdated()) {

        getFromRemote().then(function (response) {
          wsData = response.data;
          saveToLocal();
          setLocalDataTimestamp();
          deferred.resolve(wsData);
        }, function (error) {
          console.log('can not get data from remote');
          if (localDataExists()) {
            getFromLocal();
          }
          deferred.resolve(wsData);
        });
      }
      else {
        if (!isLocalDataLoaded()) {
          getFromLocal();
        }
        deferred.resolve(wsData);
      }

      return deferred.promise;
    }
  };
}])

.factory('ChartDataService', ['$http', 'ConfigService', function ($http, ConfigService) {
  return {
    fetch: function (group_type, group_value, data) {
      var i,
          timeline = [],
          current_year = new Date().getFullYear(),
          last_year = current_year - 1,
          last_year_before = current_year - 2;
      for (i = 0; i < data.length; i++) {
        if (data[i]['grouptype'] === group_type && data[i]['groupvalue'] === group_value) {
          if (data[i]['year'] == current_year || data[i]['year'] == last_year || data[i]['year'] == last_year_before) {
            timeline.push(data[i]['proportion']);
          }
        }
      }
      return timeline;
    },

    random: function() {
      var dummyData = [], i;
      for (i = 0; i < 12; i++) {
        dummyData.push(Math.floor(Math.random()*(100-0+1)+0));
      }
      return dummyData;
    }
  }
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

})

.factory('ConfigService', function ($location) {

  function getBaseUrl () {
    var host = $location.host(),
        protocol = $location.protocol(),
        baseUrl;

    switch (host) {
      case 'localhost':
        baseUrl = 'http://localhost:8888/waterstoragemobile/server/';
        break;
      case 'wdev.bom.gov.au':
        baseUrl = 'http://wdev.bom.gov.au/water/ws_mobile_app_master/data/';
        break;
    }

    if (protocol === 'file') {
      baseUrl = '';
    }

    console.log(baseUrl);
    return baseUrl;
  }

  return {
    getDataUrl: function () {
      if ('' === getBaseUrl()) {
        return 'data/data.json';
      }
      //return getBaseUrl() + 'index.php';
      return 'data/data.json';

    },
    getChartUrl: function () {
      if ('' === getBaseUrl()) {
        return 'data/chart.json';
      }
      //return getBaseUrl() + 'chart.php';
      return 'data/chart.json';
    }
  };
});
