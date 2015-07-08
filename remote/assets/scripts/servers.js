module.exports = ['$timeout', 'CommonStorage', function($timeout, CommonStorage) {
  'use strict';
  var self = this,
    Faye = require('faye');

  self.online = false;
  self.items = CommonStorage.get('servers') || [];

  self.setActive = function(item) {
    var active = item || self.active || self.items[0];
    if (active && self.items.indexOf(active) === -1) {
      active = self.items[0];
    }

    self.active = active;

    var client = new Faye.Client('http://' + active + '/control');
    self.subscribeClient(client);
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
      $timeout(function() {
        self.online = false;        
      }, 0, true);
    });

    client.on('transport:up', function() {
      $timeout(function() {
        self.online = true;        
      }, 0, true);
    });

    client.subscribe('/messages', function(message) {
      alert('Got a message: ' + message.text);
    });
  };

  self.setActive();

  return self;
}];