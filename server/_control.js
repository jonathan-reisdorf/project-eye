module.exports = function(hardware) {
  'use strict';

  var http    = require('http'),
      faye    = require('faye'),
      deflate = require('permessage-deflate');

  var bayeux = new faye.NodeAdapter({ mount : '/control' });
  bayeux.addWebsocketExtension(deflate);

  var client   = bayeux.getClient(),
    httpServer = http.createServer(function(request, response) {
      response.writeHead(200, { 'Content-Type': 'text/plain' });
      response.end('ERR: no mount found!');
    });

  bayeux.attach(httpServer);
  httpServer.listen(7777);

  console.log('Server is running on :7777');
  return {
    client : client,
    hardware : hardware
  };
};