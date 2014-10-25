var request = require('supertest');
var app = require('../server.js');
 
describe('GET /', function() {
  it('respond with nocope', function(done) {
    request(app).get('/').expect('Nocope', done);
  });
});