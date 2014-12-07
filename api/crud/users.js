
// [DEPENDENCIES]
var formidable = require('formidable');
var MD5 = require('MD5');


/*
** Utils Functions
*/
Array.prototype.isArray = true;
String.prototype.isString = true;
/*
** End Utils Functions
*/


/*
** BEGIN USER FUNCTIONS
*/


// Function to validate some formats
var UserValidator = { }; // better would be to have module create an object
UserValidator.login = function(param)
{
    var good_login = /[^a-zA-Z0-9_]/;
    //console.log(good_name.test(param));
    if (good_login.test(param))
	return (false);
    return (true);
}
UserValidator.email = function(param)
{
    /////
    // TODO
    // User a Email Validator
    /////
    return (UserValidator.name(param));
}
UserValidator.password = function(param)
{
    
    return (true);
}
UserValidator.firstname = function(param)
{
    return (UserValidator.name(param));
}
UserValidator.lastname = function(param)
{
    return (UserValidator.name(param));


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
UserValidator.birth = function(param)
{
    var good_birth = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

    return (good_birth.test(param));
}
UserValidator.diets = function(param)
{
    if (param.isArray) {
	for (i = 0 ; i < param.length ; i++) {
	    if (!((param[i]).isString))
		return (false);
	}
	return (true);
    }
    return (false);
}
UserValidator.fridge_component = function(param) {
    // TODO
    return (true);
}
UserValidator.fridge = function(param)
{
    if (param.isArray) {
	for (i = 0 ; i < param.length ; i++) {
	    if (!(UserValidator["fridge_component"](param[i])))
		return (false);
	}
	return (true);
    }
    return (false);
}
UserValidator.tools = function(param)
{
    return (UserValidator["diets"](param));
}
//var funcstr = "steps";
//RecipeValidator[funcstr]();




// [CREATE] Post User
exports.post_user = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

	var login = fields.login;
	var email = fields.email;
	var password = fields.password;
	var firstname = fields.firstname;
	var lastname = fields.lastname;
	var birth = fields.birth;
	var diets = fields.diets;
	var fridge = fields.fridge;
	var tools = fields.tools;
	

	/*
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
	*/

	// We create the new recipe
	var user = {
	    "login": login,
	    "email":email,
	    "password":MD5(password),
	    "firstname":firstname,
	    "lastname":lastname,
	    "birth":birth,
	    "diets":diets,
	    "fridge":fridge,
	    "tools":tools
	};
	
	
	db.collection('users', function(err, collection_users) {
	    if (err) {
		res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});	
	    }
	    else {
		collection_users.insert(user, function(err, result) {
		    if (err) {
			res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else {
			delete result[0].password;
			delete result[0].fridge;
			delete result[0].tools;
			res.status(200).send({"res":true, "_id":result[0]});
		    }
		});
	    }
	});
    });
};






// [READ] Get User By Id
exports.get_user_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    db.collection('users', function(err, collection) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection.findOne({"_id" : new BSON.ObjectID(id)}, function(err, user) {
		if (err) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This user does not exists !"});
		}
		else if (user == null) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This 'id' user was not found !"});
		}
		else {
		    delete user.password;
		    delete user.access_token;
		    delete user.fridge;
		    delete user.tools;
		    res.status(200).send(user);
		}
	    });
	}
    });
};







// [UPDATE] Put User By Id
exports.put_user_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;


    db.collection('users', function(err, collection_users) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {


		var users_updated_fields = ["login", "firstname", "lastname", "birth", "diets", "fridge", "tools"];

		var keys = Object.keys(fields);
                var f = {};
                for (i = 0; i < keys.length; i++) {
                    //console.log(i);
                    //console.log(keys[i]);

                    if (users_updated_fields.indexOf(keys[i]) == -1)
                        // This keys was not found
			return (res.send({"res":false, "error_code":0009, "msg":"The field '"+keys[i]+"' cannot be updated !"}));
		    else if (UserValidator[keys[i]](fields[keys[i]]) == false)
			return (res.send({"res":false, "error_code":0005, "msg":"The '"+keys[i]+"' field is not in the right format !"}));
		    else
                        // We can add this fields to the future update request 
                        f[keys[i]] = fields[keys[i]];
                }

                // Here we can execute the update request
                //console.log(f);

		req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
		collection_users.update({"_id": new BSON.ObjectID(req.params.id)}, {$set: f}, {}, function(err, nbrUpdatedFields) {
		    if (err) {
			res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else if (nbrUpdatedFields == null) {
			return (res.send({"res":false, "error_code":0005, "msg":"This 'ud' user was not found !"}));
		    }
		    else {
			return (res.send({"res":true}));
		    }
		});
		
	    });
	}
    });
};





// [DELETE] User By Id
exports.delete_user_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;
    db.collection('users', function(err, collection_users) {
	if (err) {
	    res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
	    collection_users.remove({_id: new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		//console.log(NbrRemovedDocs);
		if (err) {
		    res.send({"res":false, "error_code":0004, "msg":"Can not remove this user !"});
		}
		else if (NbrRemovedDocs == 1) {
		    res.send({"res":true});
		}
		else {
		    res.send({"res":false, "error_code":0004, "msg":"Can not remove this user !"});
		}
	    });
	}

    });
};



/*
** END USER FUNCTIONS
*/
