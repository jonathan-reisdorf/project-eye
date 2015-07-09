module.exports = ['$timeout', 'CommonStorage', function($timeout, CommonStorage) {
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
    var emptyPromise = new Promise(function(fulfill) {
      return fulfill();
    });

    (self.fayeClient ? (self.fayeClient.disconnect() || emptyPromise) : emptyPromise).then(function() {
      changeConnectionStatus('connecting');
      self.fayeClient = new Faye.Client('http://' + active + '/control');
      self.subscribeClient(self.fayeClient);
    });
  };

  var save = function() {
    CommonStorage.set('servers', self.items);
  };

  self.add = function() {
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

  self.subscribeClient = function(client) {
    client.on('transport:down', function() {
      changeConnectionStatus('down');
    });

    client.on('transport:up', function() {
      changeConnectionStatus('up');
    });

    client.subscribe('/messages', function(message) {
      alert('Got a message: ' + message.text);
    });
  };

  self.setActive();

  return self;
}];