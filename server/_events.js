module.exports = function(control) {
  'use strict';

  control.hardware.listener.onGazeData = function(gazeData) {
    // console.log('\033[2J');
    // console.log(gazeData);
  };

};