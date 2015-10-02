'use strict';

var Datastore = require('nedb');

exports.generic = function(collectionName, server) {
  var expose = {
    collection : new Datastore({ filename: 'db/' + collectionName + '.json', autoload: true })
  };

  expose.findById = function(req, res) {
    var id = req.params.id;

    expose.collection.findOne({ '_id' : id }, function(err, doc) {
      res.send(doc);
    });
  };

   expose.findBy = function(req, res) {
    var firstParamName = Object.keys(req.params)[0],
      firstParam = req.params[firstParamName];

    var query = {};
    query[firstParamName] = firstParam;

    expose.collection.find(query, function(err, docs) {
      res.send(docs || []);
    });
  };

  expose.findAll = function(req, res) {
    expose.collection.find({}, function(err, docs) {
      res.send(docs);
    });
  };

  expose.add = function(req, res) {
    var item = req.body;

    expose.collection.insert(item, function(err, doc) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(doc);
      }
    });
  };

  expose.update = function(req, res, incrementally) {
    var id = req.params.id;
    var item = req.body;
    delete item._id;
    item = incrementally ? { $set : item } : item;

    expose.collection.update({ '_id' : id }, item, {}, function(err, numReplaced, doc) {
      if (err) {
        res.send({'error':'An error has occurred'});
      } else {
        res.send(doc);
      }
    });
  };

  /* expose.delete = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ' + collectionName + ': ' + id);
    expose.collection.remove({ '_id' : id }, {}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  }; */

  if (server) {
    server.get('/' + collectionName, expose.findAll);
    server.get('/' + collectionName + '/:id', expose.findById);
    server.post('/' + collectionName, expose.add);
    server.put('/' + collectionName +'/:id', expose.update);
    // server.delete('/' + collectionName + '/:id', expose.delete);
  }

  return expose;
};