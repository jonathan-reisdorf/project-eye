module.exports = (function() {
  'use strict';

  var gazejs = require('gazejs');
  var eyeTracker = gazejs.createEyeTracker(gazejs.TOBII_GAZE_SDK);

  eyeTracker.init();

  console.log('Library version: ' + eyeTracker.getLibraryVersion());
  console.log('Model name: ' + eyeTracker.getModelName());

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

  eyeTracker.setListener(listener);

  return {
    listener : listener,
    getEyeTracker : function() {
      return eyeTracker;
    },
    resetEyetracker : eyeTracker.stop
  };
})();