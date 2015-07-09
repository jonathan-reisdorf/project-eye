'use strict';

var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('eyetracking', server);

db.open(function(err, db) {
  if(!err) {
    console.log("Connected to 'eyetracking' database");
  }
});

exports.findById = function(req, res) {
  var id = req.params.id;

  console.log('Retrieving test: ' + id);
  db.collection('tests', function(err, collection) {
    collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
      res.send(item);
    });
  });
};

exports.findAll = function(req, res) {
  db.collection('tests', function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
    });
  });
};

exports.addTest = function(req, res) {
  var test = req.body;
  console.log('Adding test: ' + JSON.stringify(test));
  db.collection('tests').insert(test, {safe:true}, function(err, result) {
    if (err) {
      res.send({'error':'An error has occurred'});
    } else {
      console.log('Success: ' + JSON.stringify(result[0]));
      res.send(result[0]);
    }
  });
};

exports.updateTest = function(req, res) {
  var id = req.params.id;
  var test = req.body;
  console.log('Updating test: ' + id);
  console.log(JSON.stringify(test));
  db.collection('tests', function(err, collection) {
    collection.update({'_id':new BSON.ObjectID(id)}, test, {safe:true}, function(err, result) {
      if (err) {
        console.log('Error updating test: ' + err);
        res.send({'error':'An error has occurred'});
      } else {
        console.log('' + result + ' document(s) updated');
        res.send(test);
      }
    });
  });
};

exports.deleteTest = function(req, res) {
  var id = req.params.id;
  console.log('Deleting test: ' + id);
  db.collection('tests', function(err, collection) {
    collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
      if (err) {
        res.send({'error':'An error has occurred - ' + err});
      } else {
        console.log('' + result + ' document(s) deleted');
        res.send(req.body);
      }
    });
  });
};