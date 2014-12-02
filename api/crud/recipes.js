
// [DEPENDENCIES]
var formidable = require('formidable');



/*
** BEGIN RECIPE FUNCTIONS
*/


// Function to validate some formats
var RecipeValidator = { }; // better would be to have module create an object
RecipeValidator.name = function(param)
{
    //console.log(param);
    return (true);
}
RecipeValidator.description = function(param)
{
    //console.log(param);
    return (true);
}
RecipeValidator.duration = function(param)
{
    //console.log(param);
    return (true);
}
RecipeValidator.steps = function(param)
{
    //console.log(param);
    return (true);
}
RecipeValidator.ingredients = function(param)
{
    //console.log(param);
    return (true);
}
RecipeValidator.products = function(param)
{
    //console.log(param);
    return (true);
}
RecipeValidator.tags = function(param)
{
    //console.log(param);
    return (true);
}
//var funcstr = "steps";
//RecipeValidator[funcstr]();




// [CREATE] Post Recipe
exports.post_recipe = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

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
	    if (RecipeValidator["steps"](steps) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'steps' field is not in the right format !"}));
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
	    if (RecipeValidator["ingredients"](steps) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'ingredients' field is not in the right format !"}));
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
	    if (RecipeValidator["products"](steps) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'products' field is not in the right format !"}));
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
	    if (RecipeValidator["tags"](steps) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'tags' field is not in the right format !"}));
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
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    db.collection('recipes', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection.findOne({"_id" : new BSON.ObjectID(id)}, function(err, recipe) {
		if (err) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This recipes does not exists !"});
		}
		else if (recipe == null) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This recipe 'id' was not found !"});
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
    var db = req.db;
    var BSON = req.BSON;


    //collection_users.update({"connection_token":access_token}, {$set: {"connection_date":[], "connection_token":[]}});

    db.collection('recipes', function(err, collection_recipes) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {


		var recipes_updated_fields = ["name", "description", "duration", "steps", "ingredients", "products", "tags"];

		var keys = Object.keys(fields);
                var f = {};
                for (i = 0; i < keys.length; i++) {
                    //console.log(i);
                    //console.log(keys[i]);

                    if (recipes_updated_fields.indexOf(keys[i]) == -1)
                        // This keys was not found
			return (res.send({"res":false, "error_code":0009, "msg":"The field '"+keys[i]+"' cannot be updated !"}));
		    else if (RecipeValidator[keys[i]](fields[keys[i]]) == false)
			return (res.send({"res":false, "error_code":0005, "msg":"The '"+keys[i]+"' field is not in the right format !"}));
		    else
                        // We can add this fields to the future update request 
                        f[keys[i]] = fields[keys[i]];
                }

                // Here we can execute the update request
                //console.log(f);

		req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
		collection_recipes.update({"_id": new BSON.ObjectID(req.params.id)}, {$set: f}, {}, function(err, nbrUpdatedFields) {
		    if (err) {
			res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else if (nbrUpdatedFields == null) {
			return (res.send({"res":false, "error_code":0005, "msg":"This recipe 'id' was not found !"}));
		    }
		    else {
			return (res.send({"res":true}));
		    }
		});
		
	    });
	}
    });
};





// [DELETE] Recipe By Id
exports.delete_recipe_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    db.collection('recipes', function(err, collection_recipes) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
	    collection_recipes.remove({_id: new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		//console.log(NbrRemovedDocs);
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
** END RECIPE FUNCTIONS
*/
