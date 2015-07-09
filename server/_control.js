module.exports = function(hardware) {
  'use strict';

  var express = require('express'),
      faye    = require('faye'),
      deflate = require('permessage-deflate');

  var bayeux = new faye.NodeAdapter({ mount : '/control' });
  bayeux.addWebsocketExtension(deflate);

  var client = bayeux.getClient(),
    server = express();

  bayeux.attach(server.listen(7777));
  console.log('Server is running on :7777');

  return {
    client : client,
    server : server,
    hardware : hardware
  };
};