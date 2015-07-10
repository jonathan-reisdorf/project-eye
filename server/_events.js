module.exports = function(control) {
  'use strict';

  control.hardware.listener.onGazeData = function(gazeData) {
    // console.log('\033[2J');
    // console.log(gazeData);
  };

  control.server.get('/tools/calibrate', function(req, res) {
    var exec = require('child_process').exec;
    exec('calibrate.cmd');
    res.send('OK');
  });
};