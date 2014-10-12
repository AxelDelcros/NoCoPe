var request = require('supertest');
var app = require('../server.js');
 
describe('GET /', function() {
  it('respond with hello world', function(done) {
    request(app).get('/').expect('hello world', done);
  });
});