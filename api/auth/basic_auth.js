/*
** Module doing a basic authentification
*/
var formidable = require('formidable');
var uniqid = require('uniqid');
var MD5 = require('MD5');


// Block the execution of the function if the token is not right
exports.check_auth = function(req, res, next) {
    var db = req.db;
    var BSON = req.BSON;

    var token = req.get('access_token');

    if (token === undefined) {
	return (res.status(400).send({"res":false, "error_code":0004, "msg":"You need to send the HTTP Header 'access_token' !"}));
    }
    
    db.collection('users', function(err, collection_users) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
        }
        else {
	    collection_users.findOne({"access_token":token}, function(err, user) {
		if (err) {
		    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		}
                else if (user == null) {
		    res.status(400).send({"res":false, "error_code":5554, "msg":"Invalid access token ! (Maybe you need to relogin)"});
                }
                else {
		    // user found, the access token is valid
		    // We go out of the middleware
		    return (next());
		}
	    });
	}
    });
}



// Function connecting a user
exports.connect = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

        var login = fields.login;
        var password = fields.password;


	if (login === undefined || login === "")
            return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'login' in the form ! (it's maybe empty)"}));
        if (password === undefined || password === "")
            return (res.status(400).send({"res":false, "error_code":0005, "msg":"Need to send the field 'password' in the form ! (it's maybe empty)"}));


	db.collection('users', function(err, collection_users) {
	    if (err) {
		res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
            }
            else {
		collection_users.findOne({"login":login, "password":MD5(password)}, function(err, user) {
		    if (err) {
			res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
                    else if (user == null) {
			res.status(400).send({"res":false, "error_code":5554, "msg":"Bad identification !"});
                    }
                    else {
			// user found, we can create the access token

			var token = MD5(uniqid());
			//console.log(token);

			collection_users.update({"_id": new BSON.ObjectID(user._id)}, {$set: {"access_token":token}}, {}, function(err, nbrUpdatedFields) {
			    if (err) {
				res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
			    }
			    else if (nbrUpdatedFields == null) {
				res.send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
				//return (res.send({"res":false, "error_code":0005, "msg":"This recipe 'id' was not found !"}));
			    }
			    else {
				// Login okay
				delete user.password;
				return (res.send({"res":true, "access_token": token, "user": user}));
			    }
			});
			
                    }
		});
            }
	});
    });
}
