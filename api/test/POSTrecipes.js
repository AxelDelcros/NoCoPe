var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var winston = require('winston');
var config = require('./config');

describe('CREATE recipe', function() {
    
    var url = config.server.url;
    var port = config.server.port;
    

    // within before() you can run all the operations that are needed to setup your tests. In this case
    // I want to create a connection with the database, and when I'm done, I call done().
    before(function(done) {
	// In our tests we use the test db
	//mongoose.connect(config.db.mongodb);
	done();
    });


    // use describe to give a title to your test suite, in this case the tile is "Account"
    // and then specify a function in which we are going to declare all the tests
    // we want to run. Each test starts with the function it() and as a first argument 
    // we have to provide a meaningful title for it, whereas as the second argument we
    // specify a function that takes a single parameter, "done", that we will use 
    // to specify when our test is completed, and that's what makes easy
    // to perform async test!
    describe('Posting a Recipe', function() {
	var recipe = {
	    name: 'Recipe Name',
	    description: 'Recipe Description',
	    duration: '1H15',
	    steps: '[{"name": "step name", "duration": "1H10", "content": "step content"}]',
	    ingredients: '[]',
	    products: '[]',
	    tags: '[]'
	};




	it('Should create a user in the database', function(done) {
	    // once we have specified the info we want to send to the server via POST verb,
	    // we need to actually perform the action on the resource, in this case we want to 
	    // POST on /api/profiles and we want to send some info
	    // We do this using the request object, requiring supertest!
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(200);
		    // Here we can test the JSon object returned

		    // We can test too the object created in the database

		    done();
		});
	});





    });
});
