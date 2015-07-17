module.exports = function(control, tests) {
  'use strict';

  var currentPageData = {},
    profileData = {},
    currentScroll = 0,
    lastEyeContact = 0,
    resolution = {};

  var actions = {
    start : function(userData) {
      this.flushData(true);
      profileData.user_id = userData._id;
      currentPageData.url = userData.last_page_url;

      control.hardware.getEyeTracker().start();
    },
    changePage : function(newUrl) {
      this.saveData();
      this.flushData(false);
      currentPageData.url = newUrl;
    },
    changeResolution : function(newResolution) {
      resolution.width = newResolution.screen_width;
      resolution.height = newResolution.screen_height;
    },
    exit : function() {
      control.hardware.resetEyetracker();
      this.saveData();
      this.flushData(true);
    },
    flushData : function(everything) {
      currentPageData = {
        map_history : [],
        map_accumulated : {}
      };

      currentScroll = 0;
      lastEyeContact = 0;

      if (everything) {
        resolution = {};
        profileData = {};
      }
    },
    saveData : function() {
      var maxDepth = 0;
      var convertedAccumulation = Object.keys(currentPageData.map_accumulated).map(function(coordString) {
        var depth = currentPageData.map_accumulated[coordString];
        maxDepth = depth > maxDepth ? depth : maxDepth;

        return coordString.split(',').map(function(part) {
          return parseInt(part);
        }).concat(depth);
      });

      var result = {
          user_id : profileData.user_id,
          url : currentPageData.url,
          accumulated : convertedAccumulation,
          history : [].concat(currentPageData.map_history),
          screen_width : resolution.width,
          screen_height : resolution.height,
          accumulated_depth : maxDepth
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
      var delay = (lastEyeContact ? (eyeData.timeSeconds - lastEyeContact) : 0) * 1000;
      delay = delay < 0 ? 0 : delay; // this covers a potential edge case that has not even been produced yet
      lastEyeContact = eyeData.timeSeconds;

      if (x < 0 || x > resolution.width || y < 0 || y > resolution.height) {
        return null;
      }

      var coords = [x, y];
      currentPageData.map_history.push(coords.concat(delay));
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