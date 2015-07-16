module.exports = function(control, tests) {
  'use strict';

  var currentPageData = {};
  var profileData = {};
  var currentScroll = 0;
  var resolution = {};

  var actions = {
    start : function(userData) {
      if (currentPageData.user_id) {
        currentPageData = {};
      }

      currentScroll = 0;
      resolution = {};
      profileData.user_id = userData._id;
      currentPageData.url = userData.last_page_url;
      currentPageData.map_history = [];
      currentPageData.map_accumulated = {};

      control.hardware.getEyeTracker().start();
    },
    changePage : function(newUrl) {
      this.saveData();
      this.flushData();
      currentPageData.url = newUrl;
    },
    changeResolution : function(newResolution) {
      resolution.width = newResolution.screen_width;
      resolution.height = newResolution.screen_height;
    },
    exit : function() {
      control.hardware.resetEyetracker();
      this.saveData();
      this.flushData();
    },
    flushData : function() {
      currentPageData = {
        map_history : [],
        map_accumulated : {}
      };

      currentScroll = 0;
    },
    saveData : function() {
      var convertedAccumulation = Object.keys(currentPageData.map_accumulated).map(function(coordString) {
        return coordString.split(',').concat(currentPageData.map_accumulated[coordString]);
      });

      var result = {
          user_id : profileData.user_id,
          url : currentPageData.url,
          accumulated : convertedAccumulation,
          history : [].concat(currentPageData.map_history)
        };

      tests.heatmapsDb.db.open(function() {
        tests.heatmapsDb.add({
          body : result
        }, {
          send : function() {}
        });
      });
    },
    processEyeData : function(eyeData) {
      if (!currentPageData.url || !resolution.width || !resolution.height || !eyeData.prefered || eyeData.prefered.x === undefined || eyeData.prefered.y === undefined) {
        return null;
      }

      var x = Math.round(eyeData.prefered.x * resolution.width);
      var y = Math.round(eyeData.prefered.y * resolution.height) + currentScroll;

      if (x < 0 || x > resolution.width || y < 0 || y > resolution.height) {
        return null;
      }

      var coords = [x, y];
      currentPageData.map_history.push(coords);
      currentPageData.map_accumulated[coords.join(',')] = (currentPageData.map_accumulated[coords.join(',')] || 0) + 1;

      return coords;
    },
    dbDetailChanged : function(newData) {
      if (newData.screen_width && newData.screen_height) {
        this.changeResolution(newData);
      }

      if (typeof newData.is_running !== 'undefined' && !newData.is_running) {
        this.exit();
      }

      if (newData.last_page_url) {
        this.changePage(newData.last_page_url);
      }
    },
    temporaryDetailChanged : function(newData) {
      if (typeof newData.scroll !== 'undefined') {
        currentScroll = parseInt(newData.scroll);
      }
    }
  }

  return actions;
};