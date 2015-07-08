module.exports = ['CommonStorage', function(CommonStorage) {
  'use strict';
  var self = this;

  var save = function() {
    CommonStorage.set('servers', self.items);
  };
  var setActive = function() {
    self.active = self.active || self.items[0];
  };
  self.items = CommonStorage.get('servers') || [];
  setActive();

  self.add = function() {
    var url = prompt('Please enter the server URL:');
    if (!url) {
      return;
    }

    if (url.indexOf('http:') !== -1) {
      return alert('Please enter the URL without any protocol!');
    }
    
    self.items.push(url);
    setActive();
    save();
  };
  self.remove = function() {};

  return self;
}];