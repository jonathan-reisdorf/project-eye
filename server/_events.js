module.exports = function(control, tests, heatmaps) {
  'use strict';

  control.hardware.listener.onGazeData = function(gazeData) {
    // console.log('\033[2J');
    heatmaps.processEyeData(gazeData);
  };

  control.server.get('/tools/calibrate', function(req, res) {
    var exec = require('child_process').exec;
    exec('calibrate.cmd');
    res.send('OK');
  });

  var subscribeNewUser = function(data) {
    control.client.subscribe('/tests/' + data.test_id + '/user/' + data._id, function(userData) {
      if (userData.db) {
        heatmaps.dbDetailChanged(userData.db);

        tests.usersDb.db.open(function() {
          tests.usersDb.update({
            params : {
              id : data._id
            },
            body : userData.db
          }, {
            send : function(result) {
              // todo: handle error case etc.
            }
          }, true);
        });
      }

      if (userData.temporary) {
        heatmaps.temporaryDetailChanged(userData.temporary);
      }
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