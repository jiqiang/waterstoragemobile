angular.module('watsto.services', ['ionic'])

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

  function isFigureIncreased(figure) {
    return figure.indexOf('-') == -1 ? true : false;
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
    },

    isFigureIncreased: isFigureIncreased
  };
}])

.factory('ChartDataService', ['$http', 'ConfigService', function ($http, ConfigService) {
  return {
    fetch: function (group_type, group_value, data, event_name) {
      var timeline = [];
      if (data[group_type][group_value]) {
        timeline = [
          [data[group_type][group_value]['CY'], data[group_type][group_value]['LY'], data[group_type][group_value]['LLY']], // chart x data
          data['timeseries'], // chart y data
          event_name
        ];
      }
      else {
        timeline = [];
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
      favourites.unshift({type: type, subType: subType, typeIndex: typeIndex, storageIndex: storageIndex, subTypeIndex: subTypeIndex});
      favourites = favourites.length > 3 ? favourites.slice(0, 3) : favourites;
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

.factory('LocalStorageService', function ($window) {

  return {

    localStorageKey: '',

    use: function (name) {
      this.localStorageKey = name;
      return this;
    },

    addItem: function (obj) {
      var isItemExist = false, items = this.getItems();
      for (var i = 0; i < items.length; i++) {
        if (items[i].type === obj.type
            && items[i].subType === obj.subType
            && items[i].typeIndex === obj.typeIndex
            && items[i].storageIndex === obj.storageIndex
            && items[i].subTypeIndex === obj.subTypeIndex) {
          isItemExist = true;
        }
      }

      if (!isItemExist) {

        items.unshift({
          type: obj.type,
          subType: obj.subType,
          typeIndex: obj.typeIndex,
          storageIndex: obj.storageIndex,
          subTypeIndex: obj.subTypeIndex
        });

        items = items.length > 3 ? items.slice(0, 3) : items;
        $window.localStorage.setItem(this.localStorageKey, angular.toJson(items));
      }

      return this;
    },

    getItems: function () {
      var items_json = $window.localStorage.getItem(this.localStorageKey);

      return items_json ? angular.fromJson(items_json) : [];
    },

    removeItem: function (index) {
      var items = this.getItems();

      items.splice(index, 1);

      $window.localStorage.setItem(this.localStorageKey, angular.toJson(items));

      return this;
    }
  }
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
        href: '#/tab/storages/states/storages/' + i + '/-1' + '/-1'
      });

      // City and system
      for (j = 0; j < rawData.states[i].cityandsystem.length; j++) {
        addToList({
          name: rawData.states[i].cityandsystem[j].title,
          type: 'City / System',
          href: '#/tab/storages/states/cityandsystem/' + i + '/' + j + '/-1'
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
        href: '#/tab/storages/drainages/storages/' + i + '/-1' + '/-1'
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
})

.factory('PopupService', function ($ionicPopup) {
  return {
    getPopup: getPopup
  };

  function getPopup(scope) {
    return $ionicPopup.show({
      templateUrl: 'templates/water-storage-summary-details.html',
      scope: scope
    });
  }
})

.factory('FeedbackService', function ($http) {
  var device = ionic.Platform.device(),
      endpoint = 'http://wdev.bom.gov.au/cgi-bin/survey/survey.cgi',
      feedback = {
        Sv_SurveyId: 'APP_WATER_STORAGE',
        Sv_Title: 'Feedback for the water storage app',
        Sv_FileName: 'survey.txt',
        Sv_CGIInternal: 'E',
        Sv_CGIForwardUrl: 'www.bom.gov.au',
        Sv_Time: Date.now(),
        fb_Browser_String: device.platform + ' ' + device.model + '(' + device.manufacture + ') ' + device.version,
        fb_General_Page_Location: 'BOM Water Storage app',
        fb_Email_Address: '',
        fb_Comments: ''
      };

  console.log(device);

  return {
    send: function(email, comments) {
      feedback.fb_Email_Address = email;
      feedback.fb_Comments = comments;

      return $http({
        method: 'POST',
        url: endpoint,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        transformRequest: function(obj) {
          var str = [];
          for(var p in obj)
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          return str.join("&");
        },
        data: feedback
      });
    },
    validate: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
})

.factory('GoogleAnalyticsService', function ($window) {

  var service = {
    isGoogleAnalyticsAvailable: function () {
      return $window.analytics ? true : false;
    },

    debugMode: function () {
      console.log('Google Analytics: enable debug mode');
      $window.analytics.debugMode();
    },

    startTrackerWithId: function (id) {
      $window.analytics.startTrackerWithId(id);
      console.log('Google Analytics: start tracker with id - ' + id);
    },

    trackView: function (view) {
      $window.analytics.trackView(view);
      console.log('Google Analytics: track view - ' + view);
    }
  };

  return {
    call: function(func, params) {

      if (!service.isGoogleAnalyticsAvailable()) {
        console.log('Google Analytics: not available');
        return;
      }

      service[func].apply(undefined, params);
    }
  }

});
