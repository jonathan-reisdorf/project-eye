module.exports = function(control) {
  'use strict';

  var testsDb = require('./db/_tests');

  control.server.get('/tests', testsDb.findAll);
  control.server.get('/tests/:id', testsDb.findById);
  control.server.post('/tests', testsDb.addTest);
  control.server.put('/tests/:id', testsDb.updateTest);
  control.server.delete('/tests/:id', testsDb.deleteTest);
};