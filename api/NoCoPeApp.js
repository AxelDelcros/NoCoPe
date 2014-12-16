

//Including the express module
var express = require('express');

// Including the path module
var path = require('path');

// Including the http module
var http = require('http');

// Including the morgan module
var logger = require('morgan');

// Including the mongodb module
var mongo = require('mongodb');
var GridStore = mongo.GridStore;
var ObjectID = mongo.ObjectID;




var MongoDBServer = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure,
GridStore = mongo.GridStore,
MongoDBServerName = 'localhost';
MongoDBPort = 27018;
MongoDBDatabase = 'food_db';

var server = new MongoDBServer(MongoDBServerName, MongoDBPort, {auto_reconnect: true});
var db = new Db(MongoDBDatabase, server, {safe: true});

db.open(function(err, db) {

    if (!err) {
        console.log("Connected to '"+MongoDBDatabase+"' database !");
    }
    else {
        console.log("An error happened during the connection to the MongoDB server !");
	throw ("An error happened during the connection to the MongoDB server !");
    }

});





// initialise the server
var app = express();
var server_port = 5555;

app.set('port', process.env.PORT || server_port);
app.use(logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
//app.use(express.bodyParser()),
app.use(express.static(path.join(__dirname, 'public')));
// Middleware
app.use(function(req,res,next){
    // Put some variable, then we could access them easily
    req.db = db;
    req.mongo = mongo;
    req.BSON = BSON;
    req.GridStore = GridStore;
    req.ObjectID = ObjectID;

    // Put gridform variable
    req.gridform = require('gridform');
    req.gridform.db = db;
    req.gridform.mongo = mongo;

    // Allow cross-domain requests
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Request-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});



// Including the recipe CRUD
var recipes = require('./crud/recipes');
var ingredients = require('./crud/ingredients');
var users = require('./crud/users');
//var images = require('./crud/images');

var basic_auth = require('./auth/basic_auth');


var formidable = ('formidable');
app.post('/file', function(req, res) {
    var form = req.gridform();

    form.on('fileBegin', function(name, file) {
	console.log("FileBegin");
	file.metadata = {"key":"value", "tableau":["value1", "value2", "value3"]};
    });
    form.parse(req, function(err, fields, files) {

	var keys = Object.keys(files);
	for (i = 0; i < keys.length; i++) {
	    console.log(keys[i]);
	    console.log(files[keys[i]]);
	    console.log("\n\n");
	}

    });


    res.send("Coucou");

});



app.delete('/file/:id', function(req, res) {
    // Check the right
    /*
    if (req.params.id.length != 24)
	return (res.status(400).send({"res":false, "error_code":4568, "msg": "You can not remove this image !"}));
    var fileId = new req.ObjectID(req.params.id);
    req.GridStore.unlink(req.db, fileId, function(err) {
	if (err) {
	    console.log(err);
	    return (res.status(400).send({"res":false, "error_code":4568, "msg": "An error happened removing the image ! Please retry !"}));
	}
	else {
	    return (res.status(200).send({"res":true}));	    
	}
    });
    */
    res.send("Coucou");
});



app.get('/file/:id', function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    /*
    // Other way to do it, in case of future bug
    var GridStream = require('gridfs-stream');
    var fileId = new ObjectID(req.params.id);
    var gfs = GridStream(db, mongo);
    gfs.files.find({_id: fileId}).toArray(function(err, files) {
	console.log(files);
	var readstream = gfs.createReadStream({_id: fileId});
	readstream.pipe(res);
    });
    */

    if (req.params.id.length != 24)
	return (res.status(400).send({"res":false, "error_code":4568, "msg": "This image does not exists !"}));
    db.collection('images', function(err, collection_images) {
	if (err) {
	    console.log(err);
	    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during thedatabase access !"}));
	}
	else {
	    collection_images.findOne({"_id":new BSON.ObjectID(req.params.id)}, function(err, image) {
		if (err) {
		    console.log(err);
		    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during thedatabase access !"}));
		}
		else if (image == null) {
		    res.status(400).send({"res": false, "error_code":4475, "msg": "This image does not exists !"});
		}
		else {
		    var fileId = new ObjectID(image.id_image);
		    var file1 = new GridStore(db, fileId, "r");
		    if (file1 !== undefined && file1 !== null) {
			file1.open(function(err, file2) {
			    if (file2 !== undefined && file2 !== null) {
				//console.log(file.metadata);
				res.status(200);
				res.set('Content-Type', file2.contentType);
				var stream = file2.stream();
				stream.pipe(res);
			    }
			    else {
				res.status(400).send({"res": false, "error_code":4475, "msg": "This image does not exists !"});
			    }
			});
		    }
		    else {
			res.status(400).send({"res": false, "error_code":4475, "msg": "This image does not exists !"});
		    }
		}
	    });
	}
    });
});





app.get('/init', function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var default_recipes = require('./default_database').recipes;
    default_recipes.forEach(function(element, index, array) {
	db.collection('recipes', function(err, collection_recipes) {
	    element._id = new BSON.ObjectID(element._id);
	    collection_recipes.insert(element, function(err, result) {
	    });
	});
    });
    var default_ingredients = require('./default_database').ingredients;
    default_ingredients.forEach(function(element, index, array) {
	db.collection('ingredients', function(err, collection_ingredients) {
	    element._id = new BSON.ObjectID(element._id);
	    collection_ingredients.insert(element, function(err, result) {
	    });
	});
    });
    res.send({"res":true});
});


/*
** ROUTES DEFINITIONS
*/


// Test Func
app.get('/:collection', function(req, res) {
    db.collection(req.params.collection, function(err, collection) {
        if (err) {
            res.send({"res":false, "error_code":2225});
        }
        else
        {
            collection.find().toArray(function(err, items) {
                if (err) {
                    res.send({"res":false, "error_code":2226});
                }
                else {
                    res.send(items);
                }
            });
        }
    });
});

app.delete('/:collection', function(req, res) {
    db.collection(req.params.collection, function(err, collection) {
        if (err) {
	    console.log(err);
            res.status(400).send({"res":false, "error_code":2225, "msg": "An error happened accessing the database !"});
        }
        else
        {
	    collection.drop(function(err, reply) {
		if (err) {
		    console.log(err);
		    res.status(400).send({"res":false, "error_code":2226, "msg": "An error happened accessing the database !"});
		}
		else  {
		    res.status(200).send({"res":true});
		}
	    });
        }
    });
});



/*
** ROUTES AUTH
*/
app.post('/login', basic_auth.login);
/*
** END ROUTES AUTH
*/




/*
** ROUTES RECIPE
*/
//app.post('/recipes', recipes.post_recipe);
app.post('/recipes', basic_auth.check_auth, recipes.post_recipe);
app.get('/recipes/id/:id', recipes.get_recipe_by_id);
app.get('/recipes/name_url/:name_url', recipes.get_recipe_by_name_url);
app.put('/recipes/id/:id', recipes.put_recipe_by_id);
app.delete('/recipes/id/:id', recipes.delete_recipe_by_id);
/*
** END ROUTES RECIPE
*/


/*
** ROUTES INGREDIENT
*/
app.post('/ingredients', ingredients.post_ingredient);
app.get('/ingredients/id/:id', ingredients.get_ingredient_by_id);
app.put('/ingredients/id/:id', ingredients.put_ingredient_by_id);
app.delete('/ingredients/id/:id', ingredients.delete_ingredient_by_id);
/*
** END ROUTES INGREDIENT
*/


/*
** ROUTES USER
*/
app.post('/users', users.post_user);
app.get('/users/id/:id', users.get_user_by_id);
app.put('/users/id/:id', users.put_user_by_id);
app.delete('/users/id/:id', users.delete_user_by_id);
/*
** END ROUTES USER
*/






/* 
** ROUTES RECIPE
*/
//app.post('/recipe/id/:id', food_api.post_recipe);
//app.get('/recipe/', food_api.get_recipe_by_id);
//app.put('/recipe/id/:id', food_api.put_recipe_by_id);
//app.delete('/recipe/id/:id', food_api.delete_recipe_by_id);
/*
** END ROUTES RECIPE
*/


/* 
** ROUTES RECIPE
*/
//app.post('/recipe/id/:id', food_api.post_recipe);
//app.get('/recipe/', food_api.get_recipe_by_id);
//app.put('/recipe/id/:id', food_api.put_recipe_by_id);
//app.delete('/recipe/id/:id', food_api.delete_recipe_by_id);
/*
** END ROUTES RECIPE
*/


/* 
** ROUTES RECIPE
*/
//app.post('/recipe/id/:id', food_api.post_recipe);
//app.get('/recipe/', food_api.get_recipe_by_id);
//app.put('/recipe/id/:id', food_api.put_recipe_by_id);
//app.delete('/recipe/id/:id', food_api.delete_recipe_by_id);
/*
** END ROUTES RECIPE
*/


//app.get('/ingredient/id/:id', food_api.get_ingredient_id);
//app.get('/tool/id/:id', food_api.get_tool_id);
//app.get('/fridge/id/:id', food_api.get_fridge_id);
//app.get('/user/id/:id', food_api.check_authentification, food_api.get_user_id);

//app.get('/recipe/name/:name', food_api.get_recipe_by_name);
//app.get('/ingredient/name/:name', food_api.get_ingredient_by_name);



//app.post('/user/login', food_api.user_login);
//app.post('/user/logout', food_api.check_authentification, food_api.user_logout);







/*
app.get('history/:id', food_api.get_history_element);

app.get('/nutrient/:id', food_api.get_nutrient);

app.get('/product/:id', food_api.get_product);

app.get('/product/:name', food_api.get_product_by_name);
*/
/*
** ROUTES PUT DEFINITIONS
*/
/*
app.put('/recipe/:id', food_api.put_recipe);

app.put('/ingredient/:id', food_api.put_ingredient);

app.put('/user/:id', food_api.put_user);

app.get('/user/inscription', food_api.get_inscription);

app.put('/tools/:id', food_api.put_tools);

app.put('/fridge/:id', food_api.put_fridge);

app.put('/history/:id', food_api.put_history_element);

app.put('/nutrient/:id', food_api.put_nutrient);

app.put('/step/:title', food_api.put_step);

app.put('/product/:id', food_api.put_product);
*/
/*
** ROUTES DELETE DEFINITIONS
*/
/*
app.delete('/recipe/:id', food_api.delete_recipe);

app.delete('/recipe/:name', food_api.delete_recipe_using_name);

app.delete('/ingredient/:id', food_api.delete_ingredient);

app.delete('/ingredient/:name', food_api.delete_ingredient_using_name);

app.delete('/user/:id', food_api.delete_user);

app.delete('/user/:name', food_api.delete_user_using_name);

app.delete('/tools/:id', food_api.delete_tools);

app.delete('/fridge/:id', food_api.delete_fridge);

app.delete('/nutrient/:id', food_api.delete_nutrient);

app.delete('/step/:title', food_api.delete_step);

app.delete('/product/:id', food_api.delete_product);
*/
/*
** END ROUTES DEFINITIONS
*/



/*
** SERVER LAUNCHING
*/
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
/*
** END SERVER LAUNCHING
*/
