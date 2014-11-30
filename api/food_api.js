
// Includinf the mongoDB module
var mongo = require('mongodb');
var formidable = require('formidable');




// Configuring the connection to MongoDB Server
var MongoDBServer = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure,
MongoDBPort = 27018;

var server = new MongoDBServer('localhost', MongoDBPort, {euto_reconnect: true});
db = new Db('food_db', server, {safe: true});

db.open(function(err, db) {

    if (!err) {
	console.log("Connected to 'food_db' database !");
    }
    else {
	console.log('An error happened during the connection to the MongoDB server !');
    }

});







/*
** TEST FUNCTIONS
*/

// Get a collection
exports.get_collection = function(req, res) {
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
};

/*
** END TEST FUNCTIONS
*/






/*
** RECIPE FUNCTION
*/

// [CREATE] Post Recipe
exports.post_recipe = function(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

	var _uid = fields._uid;
	var name = fields.name;
	var description = fields.description;
	var duration = fields.duration;
	var steps = fields.steps;
	var ingredients = fields.ingredients;
	var products = fields.products;
	var tags = fields.tags;
	

	// We set the _uid to 'null' if it is not sent
	_uid = _uid === undefined ? null : _uid;
	
	if (name === undefined || name === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'name' in the form ! (it's maybe empty)"}));

	if (description === undefined || description === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'description' in the form ! (it's maybe empty)"}));

	if (duration === undefined || duration === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'duration' in the form ! (it's maybe empty)"}));

	if (steps === undefined || steps === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'steps' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		steps = JSON.parse(steps);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'steps' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the step variable
	}

	if (ingredients === undefined || ingredients === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'ingredients' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		ingredients = JSON.parse(ingredients);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'ingredients' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the ingredients variable
	}

	if (products === undefined || products === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'products' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		products = JSON.parse(products);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'products' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the ingredients variable
	}

	if (tags === undefined || tags === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'tags' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		tags = JSON.parse(tags);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'tags' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the tags variable
	}

	
	// We create the new recipe
	var recipe = {
	    "_uid": _uid,
	    "name":name,
	    "description":description,
	    "duration":duration,
	    "steps":steps,
	    "ingredients":ingredients,
	    "products":products,
	    "submit_date":new Date(),
	    "tags":tags
	};
	

	db.collection('recipes', function(err, collection_recipes) {
	    if (err) {
		res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});	
	    }
	    else {
		collection_recipes.insert(recipe, function(err, result) {
		    if (err) {
			res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else {
			res.send({"res":true, "_id":result[0]._id});
		    }
		});
	    }
	});
    });
};

// [READ] Get Recipe By Id
exports.get_recipe_by_id = function(req, res) {
    var id = req.params.id;
    db.collection('recipes', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection.findOne({"_id" : new BSON.ObjectID(id)}, function(err, recipe) {
		console.log(recipe);
		if (err) {
		    res.send({"res":false, "error_code":5554, "msg":"This recipes does not exists !"});
		}
		else {
		    res.send(recipe);
		}
	    });
	}
    });
};

// [UPDATE] Put Recipe By Id
exports.put_recipe_by_id = function(req, res) {


    //collection_users.update({"connection_token":access_token}, {$set: {"connection_date":[], "connection_token":[]}});

    db.collection('recipes', function(err, collection_recipes) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {
		var up_fields = false;
		if (fields.name != null && fields.name != false)
		    up_fields.name = fields.name;
		collection_recipes.update({"_id": new BSON.ObjectID(req.params.id)}, {$set: {"name": "COUCOU"}}, {}, function(err, result) {
		    console.log(err);
		    console.log(result);
		    if (err) {

			res.send(err);
		    }
		    else {
			res.send(result);
		    }
		});
		
	    });
	}
    });
};

// [DELETE] Recipe By Id
exports.delete_recipe_by_id = function(req, res) {
    var id = req.params.id;
    db.collection('recipes', function(err, collection_recipes) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection_recipes.remove({_id: new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		console.log(NbrRemovedDocs);
		if (err) {
		    res.send({"res":false, "error_code":0004, "msg":"Can not remove this recipe !"});
		}
		else if (NbrRemovedDocs == 1) {
		    res.send({"res":true});
		}
		else {
		    res.send({"res":false, "error_code":0004, "msg":"Can not remove this recipe !"});
		}
	    });
	}

    });
};

/*
** END RECIPE FUNCTION
*/



/*
** GET FUNCTION
*/

// GET RECIPE BY ID

// GET INGREDIENT BY ID
exports.get_user_id = function(req, res) {
    db.collection('ingredients', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({_id : collection.params.id}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};

// GET TOOL BY ID
exports.get_tool_id = function(req, res) {
    db.collection('tools', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({_id : collection.params.id}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};

// GET FRIDGE BY ID
exports.get_fridge_id = function(req, res) {
    db.collection('fridges', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({_id : collection.params.id}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};

// GET USER BY ID
exports.get_user_id = function(req, res) {
    db.collection('users', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({_id : collection.params.id}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};







// USER LOGIN
exports.user_login = function(req, res) {
    res.send("Login");
}

//USER LOGOUT
exports.user_logout = function(req, res) {
    res.send("Logout");
}

// USER CHECK TOKEN
exports.check_authentification = function(req, res, next) {
    return (next());
}





// GET RECIPE BY NAME
exports.get_recipe_by_name = function(req, res) {
    db.collection('recipe', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({name : collection.params.name}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};

// GET INGRE BY NAME
exports.get_recipe = function(req, res) {
    db.collection('recipe', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({name : collection.params.name}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};

// GET USER AUTHEN
/*exports.get_recipe = function(req, res) {
    db.collection('recipe', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":5554});
	}
	else {
	    collection.findOne({password : collection.params.password}, function(err, item) {
		if (err) {
		    res.send({"res":false, "error_code":4448});
		}
		else {
		    res.send(item);
		}
	    });
	}
    });
};
*/


/*
** PUT FUNCTION
*/


// PUT RECIPE
exports.put_recipe = function(req, res) {
};

/*
** END PUT FUNCTION
*/




/*
** DELETE FUNCTION
*/

// DELETE RECIPE

/*
** END DELETE FUNCTION
*/