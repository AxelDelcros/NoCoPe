
// [DEPENDENCIES]
var formidable = require('formidable');


/*
** Utils Functions
*/
Array.prototype.isArray = true;
/*
** End Utils Functions
*/


/*
** BEGIN RECIPE FUNCTIONS
*/


// Function to validate some formats
var RecipeValidator = { }; // better would be to have module create an object
RecipeValidator.name = function(param)
{
    var good_name = /[^a-zA-Z0-9_ ]/;
    //console.log(good_name.test(param));
    if (good_name.test(param))
	return (false);
    return (true);
}
RecipeValidator.description = function(param)
{
    return (RecipeValidator.name(param));
}
RecipeValidator.content = function(param)
{
    return (RecipeValidator.name(param));
}
RecipeValidator.duration = function(param)
{
    var good_date1 = /^[0-9]{1}H([0-9]{2})?$/;
    var good_date2 = /^[0-9]{2}$/;

    //console.log(param);
    if (!(good_date1.test(param)) && !(good_date2.test(param)))
	return (false);
    /*
    var tab = param.split("H");
    //console.log(tab);
    if (parseInt(tab[1]) > 0 && parseInt(tab[1]) <= 59)
	return (true);
    */
    return (true);
}
RecipeValidator.step = function(param)
{
    //console.log("STEP !!!");
    //console.log(param);
    //console.log(typeof param);
    if (typeof param == "object") {

	var keys = Object.keys(param);
	//console.log(keys.length);
	if (keys.length == 3) {
	    if (keys[0] == "name" && keys[1] == "duration" && keys[2] == "content") {
		//console.log("Good keys !");
		//console.log(RecipeValidator["name"](param[keys[0]]));
		//console.log(RecipeValidator["duration"](param[keys[1]]));
		//console.log(RecipeValidator["content"](param[keys[2]]));

		//console.log(keys[1]);
		//console.log(param[keys[1]]);
		//console.log(typeof param[keys[1]]);
		if (RecipeValidator["name"](param[keys[0]]) && RecipeValidator["duration"](param[keys[1]]) && RecipeValidator["content"](param[keys[2]])) {
		    return (true);
		}
	    }
	}
    }
    return (false);
}
RecipeValidator.steps = function(param)
{
    if (param.isArray) {
	for (i = 0 ; i < param.length ; i++) {
	    if (!(RecipeValidator["step"](param[i])))
		return (false);
	}
	return (true);
    }
    return (false);
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
	
	console.log(name);
	if (name === undefined || name === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'name' in the form ! (it's maybe empty)"}));
	if (RecipeValidator["name"](name) == false)
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"The field 'name' is not in the right format ! It should contain only letters, numbers, spaces and underscores !"}));
	if (description === undefined || description === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'description' in the form ! (it's maybe empty)"}));

	if (RecipeValidator["description"](description) == false)
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"The field 'description' is not in the right format ! It should contain only letters, numbers, spaces and underscores !"}));
	if (duration === undefined || duration === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'duration' in the form ! (it's maybe empty)"}));
	if (RecipeValidator["duration"](duration) == false)
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"The field 'duration' is not in the right format ! It should be like 'YYYY-MM-DD' !"}));

	if (steps === undefined || steps === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'steps' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		steps = JSON.parse(steps);
	    }
	    catch (e) {
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'steps' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the step variable
	    if (RecipeValidator["steps"](steps) == false)
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'steps' field is not in the right format !"}));
	}

	if (ingredients === undefined || ingredients === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'ingredients' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		ingredients = JSON.parse(ingredients);
	    }
	    catch (e) {
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'ingredients' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the ingredients variable
	    if (RecipeValidator["ingredients"](steps) == false)
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'ingredients' field is not in the right format !"}));
	}

	if (products === undefined || products === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'products' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		products = JSON.parse(products);
	    }
	    catch (e) {
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'products' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the ingredients variable
	    if (RecipeValidator["products"](steps) == false)
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'products' field is not in the right format !"}));
	}

	if (tags === undefined || tags === "")
	    return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'tags' in the form ! (it's maybe empty)"}));
	if (true) {
	    try {
		tags = JSON.parse(tags);
	    }
	    catch (e) {
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'tags' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the tags variable
	    if (RecipeValidator["tags"](steps) == false)
		return (res.status(400).send({"res":false, "error_code":0005, "msg":"The 'tags' field is not in the right format !"}));
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
		res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});	
	    }
	    else {
		collection_recipes.insert(recipe, function(err, result) {
		    if (err) {
			res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else {
			res.status(200).send({"res":true, "_id":result[0]._id});
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
