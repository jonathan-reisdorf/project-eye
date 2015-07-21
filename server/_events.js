module.exports = function(control, tests, heatmaps) {
  'use strict';

  control.server.get('/tools/calibrate', function(req, res) {
    var exec = require('child_process').exec;
    exec('calibrate.cmd');
    res.send('OK');
  });

  heatmaps.onFinishedTest = function(data) {
      control.client.publish('/tests/' + data.test_id + '/user/' + data.user_id, {
        server : {
          finishedTest : true
        }
      });
  };

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

    control.hardware.listener.onGazeData = function(gazeData) {
      var coords = heatmaps.processEyeData(gazeData);
      control.client.publish('/tests/' + data.test_id + '/user/' + data._id, {
        eye : coords
      });
    };
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