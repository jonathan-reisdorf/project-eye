module.exports = function(hardware) {
  'use strict';

  var express = require('express'),
  faye    = require('faye'),
  deflate = require('permessage-deflate');

  var bayeux = new faye.NodeAdapter({ mount : '/control' });
  bayeux.addWebsocketExtension(deflate);

  var client = bayeux.getClient(),
  server = express();

  server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
  });
  server.use(require('body-parser')());

  bayeux.attach(server.listen(7777));
  console.log('Server is running on :7777');

  return {
    client : client,
    server : server,
    hardware : hardware
  };
};