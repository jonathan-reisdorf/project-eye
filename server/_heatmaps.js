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
      profileData.user_id = userData._id;
      currentPageData.url = userData.last_page_url;
      currentPageData.map_history = [];
      currentPageData.map_accumulated = [];
    },
    changePage : function(newUrl) {
      // @todo: save heatmap & flush currentPageData && currentScroll
    },
    changeResolution : function(newResolution) {
      resolution.width = newResolution.screen_width;
      resolution.height = newResolution.screen_height;
    },
    exit : function() {
      // @todo: save heatmap & flush all data
    },
    flushData : function() {

    },
    saveData : function() {

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
    }
  }

  return actions;
};