module.exports = ['$rootScope', '$timeout', 'CommonStorage', function($rootScope, $timeout, CommonStorage) {
  'use strict';
  var self = this,
    Faye = require('faye');

  self.connectionStatus = 'idle';
  var changeConnectionStatus = function(newStatus) {
    $timeout(function() {
      self.connectionStatus = newStatus;
    }, 0, true);
  };

  self.fayeClient = null;
  self.items = CommonStorage.get('servers') || [];

  self.setActive = function(item) {
    if (self.connectionStatus === 'connecting') {
      return;
    }

    var active = item || self.active || self.items[0];
    if (active && self.items.indexOf(active) === -1) {
      active = self.items[0];
    }

    if (self.active === active) {
      return;
    }

    self.active = active;

    if (!self.active) {
      return;
    }

    self.connectClient();
  };

  var save = function() {
    CommonStorage.set('servers', self.items);
  };

  self.add = function() {
    if (self.connectionStatus === 'connecting') {
      return;
    }

    var url = prompt('Please enter the server URL:');
    if (!url) {
      return;
    }

    if (url.indexOf('http:') !== -1) {
      return alert('Please enter the URL without any protocol!');
    }
    
    self.items.push(url);
    self.setActive(url);
    save();
  };

  self.remove = function(server) {
    self.items = self.items.filter(function(item) {
      return item !== server;
    });

    self.setActive();
    save();
  };

  self.connectClient = function() {
    var emptyPromise = new Promise(function(fulfill) {
      return fulfill();
    });

    $rootScope.$emit('server:disconnected');
    (self.fayeClient ? (self.fayeClient.disconnect() || emptyPromise) : emptyPromise).then(function() {
      changeConnectionStatus('connecting');
      self.fayeClient = new Faye.Client('http://' + self.active + '/control');
      self.subscribeClient(self.fayeClient);
    });
  };

  self.subscribeClient = function(client) {
    client.on('transport:down', function() {
      changeConnectionStatus('down');
    });

    client.on('transport:up', function() {
      changeConnectionStatus('up');
    });

    $rootScope.$emit('server:connected');
  };

  self.setActive();

  return self;
}];