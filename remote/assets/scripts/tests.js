module.exports = ['$rootScope', 'CommonStorage', function($scope, CommonStorage) {
  'use strict';
  var self = this;

  self.items = [];

  self.init = function(client) {
    self.items = [];

    client.subscribe('/eye_position', function(data) {
      // do sth
    });
  };

  return self;
}];