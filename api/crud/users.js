
// [DEPENDENCIES]
var formidable = require('formidable');
var MD5 = require('MD5');
var email_validator = require('email-validator');


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
// better would be to have module create an object
exports.UserValidator = { };
exports.UserValidator.login = function(param)
{
    var good_login = /[^a-zA-Z0-9_]/;
    //console.log(good_name.test(param));
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'login' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'login' can't be empty !"});
    if (good_login.test(param))
        return ({"res":false, "error_code":0007, "msg":"The field 'login' is not in the right format ! It can only contain letters, numbers and underscores !"});
    if (param.length < 5)
        return ({"res":false, "error_code":0007, "msg":"The field 'login' has to contain at least 5 caracteres !"});
    return (true);
}
exports.UserValidator.email = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'email' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'email' can't be empty !"});
    if (email_validator.validate(param) == false)
        return ({"res":false, "error_code":0007, "msg":"The field 'email' has to be a correct email address !"});
    return (true);
}
exports.UserValidator.field = function(param) {
    var ret;
    if (exports.UserValidator.login(param) != true && exports.UserValidator.email(param) != true)
	return ({"res":false, "error_code":0007, "msg":"The field is neither a good 'login' nor a good 'email' !"});
    return (true);
}
exports.UserValidator.password = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'password' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'password' can't be empty !"});
    if (param.length < 8)
        return ({"res":false, "error_code":0007, "msg":"The field 'password' has to contain at least 8 caracteres !"});
    return (true);
}
exports.UserValidator.firstname = function(param)
{
    var good_name = /[^a-zA-Z]/;
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'firstname' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'firstname' can't be empty !"});
    if (good_name.test(param))
        return ({"res":false, "error_code":0007, "msg":"The field 'firstname' is not in the right format ! It can only contain letters !"});
    return (true);
}
exports.UserValidator.lastname = function(param)
{
    var good_name = /[^a-zA-Z]/;
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'lastname' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'lastname' can't be empty !"});
    if (good_name.test(param))
        return ({"res":false, "error_code":0007, "msg":"The field 'lastname' is not in the right format ! It can only contain letters !"});
    return (true);
}
exports.UserValidator.sexe = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'sexe' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'sexe' can't be empty !"});
    if (param != "male" && param != "female")
        return ({"res":false, "error_code":0007, "msg":"The field 'sexe' has to be 'male' or 'female' !"});
    return (true);
}
exports.UserValidator.birth = function(param)
{
    var good_birth = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'birth' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'birth' can't be empty !"});
    if (good_birth.test(param) == false)
        return ({"res":false, "error_code":0007, "msg":"The field 'birth' is not in the right format ! It Has to be 'YYYY-MM-DD' !"});
    return (true);
}
exports.UserValidator.diets = function(param)
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
exports.UserValidator.fridge_component = function(param) {
    // TODO
    return (true);
}
exports.UserValidator.fridge = function(param)
{
    if (param.isArray) {
	for (i = 0 ; i < param.length ; i++) {
	    if (!(exports.UserValidator["fridge_component"](param[i])))
		return (false);
	}
	return (true);
    }
    return (false);
}
exports.UserValidator.tools = function(param)
{
    return (exports.UserValidator["diets"](param));
}



//var funcstr = "steps";
//RecipeValidator[funcstr]();





// [CREATE] Post User
exports.post_user = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;
    var GridStore = req.GridStore;

    //var form = new formidable.IncomingForm();
    var form = new req.gridform();



    form.on('fileBegin', function(name, file) {
        //console.log("FileBegin");
        file.metadata = {"uid":"value", "tableau":["value1", "value2", "value3"]};
    });
    form.parse(req, function(err, fields, files) {


	var keys = Object.keys(files);
	if (err) {
	    return (res.status(400).send({"res":false, "error_code":0004, "msg":"An error happened ! Please retry !"}));
	}
	else if (keys.length > 1) {
	    // Suppression de toutes les eventuelles images envoyées
	    return (res.status(400).send({"res":false, "error_code":0004, "msg":"You can just associate one image to a profile !"}));
	}

	var login = fields.login;
	var email = fields.email;
	var password = fields.password;
	var firstname = fields.firstname;
	var lastname = fields.lastname;
	var sexe = fields.sexe;
	var birth = fields.birth;

	console.log("login : " + login);
	console.log("email : " + email);
	console.log("password : " + password);
	console.log("firtname : " + firstname);
	console.log("lastname : " + lastname);
	console.log("sexe : " + sexe);
	console.log("birth : " + birth);

	var ret;
	if ((ret = exports.UserValidator["login"](login)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.UserValidator["email"](email)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.UserValidator["password"](password)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.UserValidator["firstname"](firstname)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.UserValidator["lastname"](lastname)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.UserValidator["sexe"](sexe)) !== true)
            return (res.status(400).send(ret));
        if ((ret = exports.UserValidator["birth"](birth)) !== true)
            return (res.status(400).send(ret));
	


	// We create the new recipe
	var user = {
	    "login": login,
	    "email":email,
	    "password":MD5(password),
	    "firstname":firstname,
	    "lastname":lastname,
	    "sexe":sexe,
	    "birth":birth,
	    "image":null,
	    "diets":[],
	    "followed": [],
	    "fridge":[],
	    "tools":[]
	};


	
	db.collection('users', function(err, collection_users) {
	    if (err) {
		return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	    }
	    else {
		
		collection_users.insert(user, function(err, result_user) {
		    if (err) {
			return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
		    }
		    else {
			result_user[0].id = result_user[0]._id;
			delete result_user[0]._id;
			delete result_user[0].password;
			delete result_user[0].diets;
			delete result_user[0].fridge;
			delete result_user[0].tools;
			// Create the image object
			if (keys.length != 0) {
			    //: {"name":files[keys[0]].name, "id":files[keys[0]].id}),
			    db.collection('images', function(err, collection_images) {
				var image = {
				    "uid":result_user[0].id,
				    "id_image":files[keys[0]].id
				};
				collection_images.insert(image, function(err, result_img) {
				    if (err) {
					return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
				    }
				    else {
					collection_users.update({"_id": result_user[0].id}, {$set: {"image":result_img[0]._id}}, {}, function(err, nbr) {
					    if (err) {
				    		return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
					    }
					    else {
						result_user[0].image = result_img[0]._id;
						res.status(200).send({"res":true, "user":result_user[0]});
					    }
					});
				    }
				});
			    });
			}
			else {
			    console.log("New user created !");
			    console.log(result_user[0]);
			    res.status(200).send({"res":true, "user":result_user[0]});
			}
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
		    user.id = user._id;
		    delete user._id;
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
		    else if (exports.UserValidator[keys[i]](fields[keys[i]]) == false)
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




exports.follow = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.query.id;
    if (id.lendth == 24) {

	db.collection('users', function(err, collection_users) {
	    if (err) {
		return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	    }
	    else {

		collection_users.findOne({"_id" : new BSON.ObjectID(id)}, function(err, user) {
		    if (err) {
			return (res.status(400).send({"res":false, "error_code":5554, "msg":"This user does not exists !"}));
		    }
		    else if (user == null) {
			return (res.status(400).send({"res":false, "error_code":5554, "msg":"This 'id' user was not found !"}));
		    }
		    else {
			// We add the id of the user we want to follow
			if (req.private_var_user.follow.indexOf(id) != -1) {
			    req.private_var_user.follow.push(id);
			    
			    collection_users.update({"_id": new BSON.ObjectID(req.private_var_user.id)}, {$set: {"follow": req.private_var_user.follow}}, {}, function(err, nbrUpdatedFields) {
				if (err) {
				    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
				}
				else if (nbrUpdatedFields == null) {
				    return (res.status(400).send({"res":false, "error_code":0005, "msg":"This 'id' user was not found !"}));
				}
				else {
				    return (res.status(200).send({"res":true}));
				}
			    });
			}
			else {
			    return (res.status(400).send({"res":false, "error_code":0005, "msg":"You are already following this user !"}));
			}
			
		    }
		});
		
	    }
	    
	});
    }
    else {
	return (res.status(400).send({"res":false, "error_code":4457, "msg":"This user does not exists !"}));
    }
}




/*
** END USER FUNCTIONS
*/
