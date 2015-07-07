module.exports = function(control) {
  'use strict';

  control.client.subscribe('/initial_url', function(data) {
    console.log('onInitialUrl', data);
  });

  control.client.subscribe('/url_changed', function(data) {
    console.log('onUrlChanged', data);
  });

  control.hardware.listener.onGazeData = function(gazeData) {
    // console.log('\033[2J');
    // console.log(gazeData);
  };

};