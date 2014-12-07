
// [DEPENDENCIES]
var formidable = require('formidable');



/*
** BEGIN INGREDIENTS FUNCTIONS
*/


// Function to validate some formats
var IngredientValidator = { }; // better would be to have module create an object
IngredientValidator.name = function(param)
{
    //console.log(param);
    return (true);
}
IngredientValidator.components = function(param)
{
    //console.log(param);
    return (true);
}
IngredientValidator.tags = function(param)
{
    //console.log(param);
    return (true);
}
IngredientValidator.nutrients = function(param)
{
    //console.log(param);
    return (true);
}
//var funcstr = "steps";
//RecipeValidator[funcstr]();




// [CREATE] Post Ingredient
exports.post_ingredient = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

	var name = fields.name;
	var components = fields.components;
	var tags = fields.tags;
	var nutrients = fields.nutrients;
	

	if (name === undefined || name === "")
	    return (res.send({"res":false, "error_code":0005, "msg":"Need to send the field 'name' in the form ! (it's maybe empty)"}));

	if (true) {
	    try {
		components = JSON.parse(components);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'components' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the step variable
	    if (IngredientValidator["components"](components) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'components' field is not in the right format !"}));
	}
	if (true) {
	    try {
		tags = JSON.parse(tags);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'tags' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the step variable
	    if (IngredientValidator["tags"](tags) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'tags' field is not in the right format !"}));
	}
	if (true) {
	    try {
		nutrients = JSON.parse(nutrients);
	    }
	    catch (e) {
		return (res.send({"res":false, "error_code":0005, "msg":"The 'nutrients' field is not in the right format !"}));
	    }
	    // here we have to test the right format of the step variable
	    if (IngredientValidator["nutrients"](nutrients) == false)
		return (res.send({"res":false, "error_code":0005, "msg":"The 'nutrients' field is not in the right format !"}));
	}
	
	// We create the new recipe
	var recipe = {
	    "name":name,
	    "components":components,
	    "tags":tags,
	    "nutrients":nutrients
	};
	

	db.collection('ingredients', function(err, collection_ingredients) {
	    if (err) {
		res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});	
	    }
	    else {
		collection_inredients.insert(recipe, function(err, result) {
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






// [READ] Get Ingredient By Id
exports.get_ingredient_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    db.collection('ingredients', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection.findOne({"_id" : new BSON.ObjectID(id)}, function(err, ingredient) {
		if (err) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This ingredient does not exists !"});
		}
		else if (ingredient == null) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This ingredient 'id' was not found !"});
		}
		else {
		    res.send(ingredient);
		}
	    });
	}
    });
};







// [UPDATE] Put Ingredient By Id
exports.put_ingredient_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;


    db.collection('ingredients', function(err, collection_ingredients) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {


		var ingredients_updated_fields = ["name", "components", "tags", "nutrients"];

		var keys = Object.keys(fields);
                var f = {};
                for (i = 0; i < keys.length; i++) {
                    //console.log(i);
                    //console.log(keys[i]);

                    if (ingredients_updated_fields.indexOf(keys[i]) == -1)
                        // This keys was not found
			return (res.send({"res":false, "error_code":0009, "msg":"The field '"+keys[i]+"' cannot be updated !"}));
		    else if (IngredientValidator[keys[i]](fields[keys[i]]) == false)
			return (res.send({"res":false, "error_code":0005, "msg":"The '"+keys[i]+"' field is not in the right format !"}));
		    else
                        // We can add this fields to the future update request 
                        f[keys[i]] = fields[keys[i]];
                }

                // Here we can execute the update request
                //console.log(f);

		req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
		collection_ingredients.update({"_id": new BSON.ObjectID(req.params.id)}, {$set: f}, {}, function(err, nbrUpdatedFields) {
		    if (err) {
			res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else if (nbrUpdatedFields == null) {
			return (res.send({"res":false, "error_code":0005, "msg":"This ingredient 'id' was not found !"}));
		    }
		    else {
			return (res.send({"res":true}));
		    }
		});
		
	    });
	}
    });
};





// [DELETE] Ingredient By Id
exports.delete_ingredient_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    db.collection('ingredients', function(err, collection_ingredients) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
	    collection_ingredients.remove({_id: new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		//console.log(NbrRemovedDocs);
		if (err) {
		    res.send({"res":false, "error_code":0004, "msg":"Can not remove this ingredient !"});
		}
		else if (NbrRemovedDocs == 1) {
		    res.send({"res":true});
		}
		else {
		    res.send({"res":false, "error_code":0004, "msg":"Can not remove this ingredient !"});
		}
	    });
	}

    });
};



/*
** END RECIPE FUNCTIONS
*/
