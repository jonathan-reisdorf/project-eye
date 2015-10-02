module.exports = (function() {
  'use strict';

  var gazejs = require('gazejs')
  var eyeTracker;

  var listener = {
    onStart : function() {
      console.log('OnStart');
    },
    onStop : function() {
      console.log('OnStop');
    },
    onError : function(error) {
      console.log('OnError', error);
    }
  };

  var reset = function() {
    if (eyeTracker) {
      eyeTracker.stop();
    }

    eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);
    eyeTracker.init();
    eyeTracker.setListener(listener);
    // console.log('Library version: ' + eyeTracker.getLibraryVersion());
    // console.log('Model name: ' + eyeTracker.getModelName());
  };

  reset();

  return {
    listener : listener,
    getEyeTracker : function() {
      return eyeTracker;
    },
    resetEyetracker : reset
  };
})();