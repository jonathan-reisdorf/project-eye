'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('eyetracking', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'eyetracking' database");
  }
});

exports.generic = function(collectionName, server) {
  var expose = {
    db : db,
    collection : db.collection(collectionName)
  };

  expose.findById = function(req, res) {
    var id = req.params.id;

    console.log('Retrieving ' + collectionName + ': ' + id);
    expose.collection.findOne({ '_id' : mongo.ObjectID(id) }, function(err, item) {
      res.send(item);
    });
  };

   expose.findBy = function(req, res) {
    var firstParamName = Object.keys(req.params)[0],
      firstParam = req.params[firstParamName];

    var query = {};
    query[firstParamName] = firstParam;

    console.log('Retrieving ' + collectionName + ' by ' + firstParamName  + ': ' + firstParam);
    expose.collection.count(function(err, count) {
      if (count) {
        expose.collection.find(query).toArray(function(err, item) {
          res.send(item);
        });
      } else {
        res.send([]);
      }
    });
  };

  expose.findAll = function(req, res) {
    console.log('Retrieving ' + collectionName);
    expose.collection.find().toArray(function(err, items) {
      res.send(items);
    });
  };

  expose.add = function(req, res) {
    var item = req.body;
    console.log('Adding ' + collectionName + ': ' + JSON.stringify(item));
    expose.collection.insert(item, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        console.log('Success: ' + JSON.stringify(result.ops[0]));
        res.send(result.ops[0]);
      }
    });
  };

  expose.update = function(req, res, incrementally) {
    var id = req.params.id;
    var item = req.body;
    item = incrementally ? { $set : item } : item;
    console.log('Updating ' + collectionName + ': ' + id);
    expose.collection.update({ '_id' : mongo.ObjectID(id) }, item, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating ' + collectionName + ': ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(item);
      }
    });
  };

  expose.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ' + collectionName + ': ' + id);
    expose.collection.remove({ '_id' : mongo.ObjectID(id) }, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  };

  if (server) {
    server.get('/' + collectionName, expose.findAll);
    server.get('/' + collectionName + '/:id', expose.findById);
    server.post('/' + collectionName, expose.add);
    server.put('/' + collectionName +'/:id', expose.update);
    server.delete('/' + collectionName + '/:id', expose.delete);
  }

  return expose;
};