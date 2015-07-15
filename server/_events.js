module.exports = function(control, tests, heatmaps) {
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

  var subscribeNewUser = function(data) {
    control.client.subscribe('/tests/' + data.test_id + '/user/' + data._id, function(data) {
      console.log('user detail(s) updated:', data);
      if (data.db) {
        heatmaps.dbDetailChanged(data.db);
      }
      // @todo: continue here!
    });
  };

  tests.testsDb.db.open(function() {
    tests.testsDb.collection.find().forEach(function(data) {
      control.client.subscribe('/tests/' + data._id + '/users', function(data) {
        if (data.added) {
          subscribeNewUser(data.added);
          heatmaps.start(data.added);
        }
      });
    });
  });
};