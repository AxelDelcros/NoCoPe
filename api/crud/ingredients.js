
// [DEPENDENCIES]
var formidable = require('formidable');



/*
** BEGIN INGREDIENTS FUNCTIONS
*/


// Function to validate some formats
exports.IngredientValidator = { }; // better would be to have module create an object
exports.IngredientValidator.name = function(param)
{
    var good_name = /[^a-zA-Z0-9_ \-\(\)\[\]\"\']/;
    //console.log(good_name.test(param));
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'name' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'name' can't be empty !"});
    if (good_name.test(param))
        return ({"res":false, "error_code":0007, "msg":"The field 'name' is not in the right format ! It can only contain letters, numbers, underscores and spaces !"});
    return (true);
}
exports.IngredientValidator.nutrient = function(param) {
    if (param === undefined)
	return ({"res":false, "error_code":0005, "msg":"The 'nutrients' array contains a entry that not respect the 'nutrient' format !"});
    if (param == "")
	return ({"res":false, "error_code":0005, "msg":"The 'nutrients' array contains a entry that not respect the 'nutrient' format !"});
    try {
        param = JSON.parse(param);
    }
    catch (e) {
        console.log(e);
	return ({"res":false, "error_code":0005, "msg":"The 'nutrients' array contains a entry that not respect the 'nutrient' format !"});
    }
    
    if (typeof param == "object") {
	
        var keys = Object.keys(param);
        //console.log(keys.length);
	
	if (keys.length == 2) {
            if (keys[0] == "name" && keys[1] == "value") {
                
		var ret;
		if (((ret = exports.IngredientValidator["name"](param[keys[0]])) !== true) || ((ret = exports.IngredientValidator["name"](param[keys[0]])) !== true)) {
                    return (ret);
                }
		else {
		    return (true);
		}
            }
	}
    }
    return ({"res":false, "error_code":0005, "msg":"The 'nutrients' array contains a entry that not respect the 'nutrient' format !"});
}
exports.IngredientValidator.nutrients = function(param)
{
    //console.log(param);
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'nutrients' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'nutrients' can't be empty !"});
    try {
        param = JSON.parse(param);
    }
    catch (e) {
        console.log(e);
        return ({"res":false, "error_code":0005, "msg":"The field 'nutrients' is not an array !"});
    }
    if (param.isArray) {
        var ret;
        for (i = 0 ; i < param.length ; i++) {
            if ((ret = exports.IngredientValidator["nutrient"](param[i])) !== true)
		return (ret);
        }
        return (true);
    }
    return ({"res":false, "error_code":0005, "msg":"The field 'nutrients' is not an array !"});
}
exports.IngredientValidator.tags = function(param)
{
    //console.log(param);
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'tags' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'tags' can't be empty !"});
    return (true);
}
exports.nameToUrl = function(param) {
    var to_replace = ["_", " ", "(", ")", "[", "]", "\"", "'"];
    for (i = 0; i < to_replace.length ; i++) {
	while (param.indexOf(to_replace[i]) != -1)
            param = param.replace(to_replace[i], "-");
    }
    var reg = /[-]{2,}/;
    while (reg.test(param))
	param = param.replace(reg, "-");
    param = param.replace(/^-/, "");
    param = param.replace(/-$/, "");
    param = param.toLowerCase();
    return (param);
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
	var tags = fields.tags;
	var nutrients = fields.nutrients;
	
	var ret;
        if ((ret = exports.IngredientValidator["name"](name)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.IngredientValidator["tags"](tags)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.IngredientValidator["nutrients"](nutrients)) !== true)
            return (res.status(400).send(ret));
	
	// We create the new recipe
	var ingredient = {
	    "name":name,
	    "name_url":exports.nameToUrl(name),
	    "tags":tags,
	    "nutrients":nutrients
	};
	

	db.collection('ingredients', function(err, collection_ingredients) {
	    if (err) {
		console.log(err);
		res.status(400).send({"res":false, "error_code":0005, "msg":"Something happened during the database access !"});
	    }
	    else {
		collection_ingredients.insert(ingredient, function(err, result) {
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






// [READ] Get Ingredient By Id
exports.get_ingredient_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    if (id.length != 24)
	return (res.status(400).send({"res":false, "error_code":5553, "msg":"This ingredient 'id' was not found !"}));
    db.collection('ingredients', function(err, collection_ingredients) {
	if (err) {
	    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	}
	else {
	    collection_ingredients.findOne({"_id" : new BSON.ObjectID(id)}, function(err, ingredient) {
		if (err) {
		    console.log(err);
		    return (res.status(400).send({"res":false, "error_code":5554, "msg":"This ingredient does not exists !"}));
		}
		else if (ingredient == null) {
		    return (res.status(400).send({"res":false, "error_code":5553, "msg":"This ingredient 'id' was not found !"}));
		}
		else {
		    ingredient.id = ingredient._id;
		    delete ingredient._id;
		    return (res.status(200).send(ingredient));
		}
	    });
	}
    });
};





// [READ] Get Ingredient By Name_Url
exports.get_ingredient_by_name_url = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var name_url = req.params.name_url;
    db.collection('ingredients', function(err, collection_ingredients) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection_ingredients.findOne({"name_url" : name_url}, function(err, ingredient) {
		if (err) {
		    console.log(err);
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This ingredient does not exists !"});
		}
		else if (ingredient == null) {
		    res.status(400).send({"res":false, "error_code":5553, "msg":"This ingredient 'name_url' was not found !"});
		}
		else {
		    ingredient.id = ingredient._id;
		    delete ingredient._id;
		    return (res.status(200).send(ingredient));
		}
	    });
	}
    });
};







// [UPDATE] Put Ingredient By Id
exports.put_ingredient_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;

    if (id.length != 24)
	return (res.status(400).send({"res":false, "error_code":5553, "msg":"This ingredient 'id' was not found !"}));

    db.collection('ingredients', function(err, collection_ingredients) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {


		var ingredients_updated_fields = ["name", "tags", "nutrients"];

		var keys = Object.keys(fields);
                var f = {};
                for (i = 0; i < keys.length; i++) {
                    //console.log(i);
                    //console.log(keys[i]);

                    if (ingredients_updated_fields.indexOf(keys[i]) == -1)
                        // This keys was not found
			return (res.status(400).send({"res":false, "error_code":0009, "msg":"The field '"+keys[i]+"' cannot be updated !"}));
		    else if (IngredientValidator[keys[i]](fields[keys[i]]) == false)
			return (res.status(400).send({"res":false, "error_code":0005, "msg":"The '"+keys[i]+"' field is not in the right format !"}));
		    else
                        // We can add this fields to the future update request 
                        f[keys[i]] = fields[keys[i]];
                }

                // Here we can execute the update request
                //console.log(f);

		collection_ingredients.update({"_id": new BSON.ObjectID(id)}, {$set: f}, {}, function(err, nbrUpdatedFields) {
		    if (err) {
			res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else if (nbrUpdatedFields == null) {
			return (res.status(400).send({"res":false, "error_code":0005, "msg":"This ingredient 'id' was not found !"}));
		    }
		    else {
			return (res.status(200).send({"res":true}));
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

    if (id.length != 24)
	return (res.status(400).send({"res":false, "error_code":5553, "msg":"This ingredient 'id' was not found !"}));
    db.collection('ingredients', function(err, collection_ingredients) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection_ingredients.remove({"_id": new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		//console.log(NbrRemovedDocs);
		if (err) {
		    res.status(400).send({"res":false, "error_code":0004, "msg":"Can not remove this ingredient !"});
		}
		else if (NbrRemovedDocs == 1) {
		    res.status(400).send({"res":true});
		}
		else {
		    res.status(200).send({"res":false, "error_code":0004, "msg":"Can not remove this ingredient !"});
		}
	    });
	}

    });
};



/*
** END INGREDIENT FUNCTIONS
*/
