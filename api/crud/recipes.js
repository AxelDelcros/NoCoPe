
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
exports.RecipeValidator = { }; // better would be to have module create an object
exports.RecipeValidator.name = function(param)
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
exports.RecipeValidator.description = function(param)
{
    var good_description = /[^a-zA-Z0-9_ \-\(\)\[\]\"\']/;
    //console.log(good_name.test(param));
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'description' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'description' can't be empty !"});
    if (good_description.test(param))
        return ({"res":false, "error_code":0007, "msg":"The field 'description' is not in the right format ! It can only contain letters, numbers and underscores !"});
    return (true);
}
exports.RecipeValidator.duration = function(param)
{
    var good_date1 = /^[0-9]{1}H([0-9]{2})?$/;
    var good_date2 = /^[0-9]{2}$/;

    //console.log(param);
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'duration' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'duration' can't be empty !"});
    if (!(good_date1.test(param)) && !(good_date2.test(param)))
	return ({"res":false, "error_code":5478, "msg":"The field 'duration' is not in the right format !"});
    /*
    var tab = param.split("H");
    //console.log(tab);
    if (parseInt(tab[1]) > 0 && parseInt(tab[1]) <= 59)
	return (true);
    */
    return (true);
}
exports.RecipeValidator.step = function(param)
{
    if (typeof param == "object") {

	var keys = Object.keys(param);
	//console.log(keys.length);
	if (keys.length == 3) {
	    if (keys[0] == "name" && keys[1] == "duration" && keys[2] == "content") {

		var ret;
		if (((ret = exports.RecipeValidator["name"](param[keys[0]])) !== true) || ((ret = exports.RecipeValidator["duration"](param[keys[1]])) !== true) || ((ret = exports.RecipeValidator["content"](param[keys[2]])) !== true)) {
		    return (ret);
		}
		else {
		    return (true);
		}
	    }
	}
    }
    return ({"res":false, "error_code":0005, "msg":"The 'steps' array contains a entry that not respect the 'step' format !"});
}
exports.RecipeValidator.steps = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'steps' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'steps' can't be empty !"});
    try {
	param = JSON.parse(param);
    }
    catch (e) {
	console.log(e);
	return ({"res":false, "error_code":0005, "msg":"The 'steps' field is not an array !"});
    }
    if (param.isArray) {
	var ret;
	for (i = 0 ; i < param.length ; i++) {
	    if ((ret = exports.UserValidator["step"](param[i])) !== true)
		return (ret);
	    
	}
	return (true);
    }
    return ({"res":false, "error_code":0005, "msg":"The 'steps' field is not an array !"});
}
exports.RecipeValidator.ingredients = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'ingredients' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'ingredients' can't be empty !"});
    //console.log(param);
    return (true);
}
exports.RecipeValidator.tools = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'tools' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'tools' can't be empty !"});
    //console.log(param);
    return (true);
}
exports.RecipeValidator.products = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'products' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'products' can't be empty !"});
    //console.log(param);
    return (true);
}
exports.RecipeValidator.tags = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'tags' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'tags' can't be empty !"});
    //console.log(param);
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
//exports.RecipeValidator[funcstr]();




// [CREATE] Post Recipe
exports.post_recipe = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

	// We set the uid to 'null' if the user is not logged
	var uid = (req.private_var_user === undefined ? null : req.private_var_user.id);
	var name = fields.name;
	var description = fields.description;
	var duration = fields.duration;
	var steps = fields.steps;
	var ingredients = fields.ingredients;
	var tools = fields.tools;
	var products = fields.products;
	var tags = fields.tags;
	
	if ((ret = exports.RecipeValidator["name"](name)) !== true)
            return (res.status(400).send(ret));
	if ((ret = exports.RecipeValidator["description"](description)) !== true)
            return (res.status(400).send(ret));
	//if ((ret = exports.RecipeValidator["duration"](duration)) !== true)
        //return (res.status(400).send(ret));
	if ((ret = exports.RecipeValidator["steps"](steps)) !== true)
            return (res.status(400).send(ret));
	if ((ret = exports.RecipeValidator["ingredients"](ingredients)) !== true)
            return (res.status(400).send(ret));
	if ((ret = exports.RecipeValidator["tools"](tools)) !== true)
            return (res.status(400).send(ret));
	if ((ret = exports.RecipeValidator["products"](products)) !== true)
            return (res.status(400).send(ret));
	if ((ret = exports.RecipeValidator["tags"](tags)) !== true)
            return (res.status(400).send(ret));


	// We create the new recipe
	var recipe = {
	    "uid": uid,
	    "name":name,
	    "name_url":exports.nameToUrl(name),
	    "description":description,
//	    "duration":duration,
	    "steps":steps,
	    "ingredients":ingredients,
	    "tools":tools,
	    "products":products,
	    "submit_date":new Date(),
	    "tags":tags
	};
	
	
	db.collection('recipes', function(err, collection_recipes) {
	    if (err) {
		return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	    }
	    else {
		collection_recipes.insert(recipe, function(err, result) {
		    if (err) {
			return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
		    }
		    else {
			return (res.status(200).send({"res":true, "id":result[0]._id}));
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
    if (id.length != 24)
   	return (res.status(400).send({"res":false, "error_code":5554, "msg":"This recipe 'id' was not found !"}));
    db.collection('recipes', function(err, collection) {
	if (err) {
	    return (res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	}
	else {
	    collection.findOne({"_id" : new BSON.ObjectID(id)}, function(err, recipe) {
		if (err) {
		    return (res.status(400).send({"res":false, "error_code":5554, "msg":"This recipes does not exists !"}));
		}
		else if (recipe == null) {
		    return (res.status(400).send({"res":false, "error_code":5554, "msg":"This recipe 'id' was not found !"}));
		}
		else {
		    recipe.id = recipe._id;
		    delete recipe._id;
		    return (res.status(200).send(recipe));
		}
	    });
	}
    });
};





// [READ] Get Recipe By Name_Url
exports.get_recipe_by_name_url = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var name_url = req.params.name_url;
    db.collection('recipes', function(err, collection) {
	if (err) {
	    return (res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	}
	else {
	    collection.findOne({"name_url" : name_url}, function(err, recipe) {
		if (err) {
		    return (res.status(400).send({"res":false, "error_code":5555, "msg":"This recipes does not exists !"}));
		}
		else if (recipe == null) {
   		    return (res.status(400).send({"res":false, "error_code":5559, "msg":"The recipe : "+name_url+" was not found !"}));
		}
		else {
		    recipe.id = recipe._id;
		    delete recipe._id;
		    return (res.status(200).send(recipe));
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
    var id = req.params.id;
    if (id.length != 24)
   	return (res.status(400).send({"res":false, "error_code":5554, "msg":"This recipe 'id' was not found !"}));

    db.collection('recipes', function(err, collection_recipes) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
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
			return (res.status(400).send({"res":false, "error_code":0009, "msg":"The field '"+keys[i]+"' cannot be updated !"}));
		    else if (exports.RecipeValidator[keys[i]](fields[keys[i]]) == false)
			return (res.status(400).send({"res":false, "error_code":0005, "msg":"The '"+keys[i]+"' field is not in the right format !"}));
		    else
                        // We can add this fields to the future update request 
                        f[keys[i]] = fields[keys[i]];
                }

                // Here we can execute the update request
                //console.log(f);

		collection_recipes.update({"_id": new BSON.ObjectID(id)}, {$set: f}, {}, function(err, nbrUpdatedFields) {
		    if (err) {
			return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
		    }
		    else if (nbrUpdatedFields == null) {
			return (res.status(400).send({"res":false, "error_code":0005, "msg":"This recipe 'id' was not found !"}));
		    }
		    else {
			return (res.status(200).send({"res":true}));
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
    if (id.length != 24)
   	return (res.status(400).send({"res":false, "error_code":5554, "msg":"This recipe 'id' was not found !"}));

    db.collection('recipes', function(err, collection_recipes) {
	if (err) {
	    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	}
	else {
	    collection_recipes.remove({_id: new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		//console.log(NbrRemovedDocs);
		if (err) {
		    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Can not remove this recipe !"}));
		}
		else if (NbrRemovedDocs == 1) {
		    return (res.status(200).send({"res":true}));
		}
		else {
		    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Can not remove this recipe !"}));
		}
	    });
	}
    });
};



/*
** END RECIPE FUNCTIONS
*/
