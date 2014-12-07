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



	
	it('Sending a good recipe to the API', function(done) {
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





	it('Testing sending recipe with missing "name" field', function(done) {
	    var tmp = recipe.name;
	    delete recipe.name;
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.name = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with empty ("") field "name"', function(done) {
	    var tmp = recipe.name;
	    recipe.name = "";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.name = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});





	it('Testing sending recipe with missing "description" field', function(done) {
	    var tmp = recipe.description;
	    delete recipe.description;
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.description = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with empty ("") field "description"', function(done) {
	    var tmp = recipe.description;
	    recipe.description = "";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.description = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});





	it('Testing sending recipe with missing "duration" field', function(done) {
	    var tmp = recipe.duration;
	    delete recipe.duration;
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.duration = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with empty ("") field "duration"', function(done) {
	    var tmp = recipe.duration;
	    recipe.duration = "";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.duration = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with duration with just one digit', function(done) {
	    var tmp = recipe.duration;
	    recipe.duration = "6";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.duration = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with duration with 2 digits', function(done) {
	    var tmp = recipe.duration;
	    recipe.duration = "06";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.duration = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(200);
		    done();
		});
	});
	it('Testing sending recipe with duration just 1 digit hour', function(done) {
	    var tmp = recipe.duration;
	    recipe.duration = "2H";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.duration = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(200);
		    done();
		});
	});
	it('Testing sending recipe with duration with 2 digits hour', function(done) {
	    var tmp = recipe.duration;
	    recipe.duration = "12H";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.duration = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});





	it('Testing sending recipe with missing "steps" field', function(done) {
	    var tmp = recipe.steps;
	    delete recipe.steps;
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.steps = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with empty ("") field "steps"', function(done) {
	    var tmp = recipe.steps;
	    recipe.steps = "";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.steps = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});





	it('Testing sending recipe with missing "ingredients" field', function(done) {
	    var tmp = recipe.ingredients;
	    delete recipe.ingredients;
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.ingredients = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with empty ("") field "ingredients"', function(done) {
	    var tmp = recipe.ingredients;
	    recipe.ingredients = "";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.ingredients = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});





	it('Testing sending recipe with missing "tags" field', function(done) {
	    var tmp = recipe.tags;
	    delete recipe.tags;
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.tags = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});
	it('Testing sending recipe with empty ("") field "tags"', function(done) {
	    var tmp = recipe.tags;
	    recipe.tags = "";
	    request(url+':'+port)
		.post('/recipes')
		.send(recipe)
		.end(function(err, res) {
		    if (err) {
			//console.log(err);
			throw err;
		    }
		    recipe.tags = tmp;
		    // We test the ret code
		    res.should.have.ownProperty('status').equal(400);
		    done();
		});
	});







	
    });
});
