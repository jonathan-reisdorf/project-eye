module.exports = function(control) {
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

      control.hardware.eyeTracker.start();
    },
    changePage : function(newUrl) {
      // @todo: save heatmap & flush currentPageData && currentScroll
    },
    changeResolution : function(newResolution) {
      resolution.width = newResolution.screen_width;
      resolution.height = newResolution.screen_height;
    },
    exit : function() {
      control.hardware.eyeTracker.release();
      // @todo: solve application freezing on eyetracker release
      // @todo: save heatmap & flush all data
    },
    flushData : function() {

    },
    saveData : function() {

    },
    processEyeData : function(eyeData) {
      if (!resolution.width || !resolution.height || !eyeData.prefered || eyeData.prefered.x === undefined || eyeData.prefered.y === undefined) {
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