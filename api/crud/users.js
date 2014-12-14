
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
var UserValidator = { }; // better would be to have module create an object
UserValidator.login = function(param)
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
UserValidator.email = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'email' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'email' can't be empty !"});
    if (email_validator.validate(param) == false)
        return ({"res":false, "error_code":0007, "msg":"The field 'email' has to be a correct email address !"});
    return (true);
}
UserValidator.password = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'password' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'password' can't be empty !"});
    if (param.length < 8)
        return ({"res":false, "error_code":0007, "msg":"The field 'password' has to contain at least 8 caracteres !"});
    return (true);
}
UserValidator.firstname = function(param)
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
UserValidator.lastname = function(param)
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
UserValidator.sexe = function(param)
{
    if (param === undefined)
        return ({"res":false, "error_code":0007, "msg":"You have to send the field 'sexe' !"});
    if (param == "")
        return ({"res":false, "error_code":0007, "msg":"The field 'sexe' can't be empty !"});
    if (param != "male" && param != "female")
        return ({"res":false, "error_code":0007, "msg":"The field 'sexe' has to be 'male' or 'female' !"});
    return (true);
}
UserValidator.birth = function(param)
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
    var GridStore = req.GridStore;

    //var form = new formidable.IncomingForm();
    var form = new req.gridform();
    form.on('fileBegin', function(name, file) {
        //console.log("FileBegin");
        //file.metadata = {"uid":"value", "tableau":["value1", "value2", "value3"]};
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

	var ret;
	if ((ret = UserValidator["login"](login)) !== true)
            return (res.status(400).send(ret));
        if ((ret = UserValidator["email"](email)) !== true)
            return (res.status(400).send(ret));
        if ((ret = UserValidator["password"](password)) !== true)
            return (res.status(400).send(ret));
        if ((ret = UserValidator["firstname"](firstname)) !== true)
            return (res.status(400).send(ret));
        if ((ret = UserValidator["lastname"](lastname)) !== true)
            return (res.status(400).send(ret));
        if ((ret = UserValidator["sexe"](sexe)) !== true)
            return (res.status(400).send(ret));
        if ((ret = UserValidator["birth"](birth)) !== true)
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
	    "image":(keys.length == 0 ? null : {"name":files[keys[0]].name, "id":files[keys[0]].id}),
	    "diets":[],
	    "fridge":[],
	    "tools":[]
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
			// On rajoute les metadata à l'image
			result[0].id = result[0]._id;
			delete result[0]._id;
			delete result[0].password;
			delete result[0].diets;
			delete result[0].fridge;
			delete result[0].tools;
			res.status(200).send({"res":true, "user":result[0]});
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
