module.exports = function(hardware) {
  'use strict';

  var http    = require('http'),
      faye    = require('faye'),
      deflate = require('permessage-deflate');

  var bayeux = new faye.NodeAdapter({ mount : '/control' });
  bayeux.addWebsocketExtension(deflate);

  var client   = bayeux.getClient(),
    httpServer = http.createServer();

  bayeux.attach(httpServer);
  httpServer.listen(7777);

  console.log('Server is running on :7777');
  return {
    client : client,
    hardware : hardware
  };
};