
// [DEPENDENCIES]
var formidable = require('formidable');
var uniqid = require('uniqid');
var MD5 = require('MD5');

/*
** Utils Functions
*/
Array.prototype.isArray = true;
/*
** End Utils Functions
*/


/*
** BEGIN MOMENTS FUNCTIONS
*/


// Function to validate some formats
exports.MomentValidator = { }; // better would be to have module create an object
exports.MomentValidator.name = function(param)
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
//exports.MomentValidator[funcstr]();




// [CREATE] Post Moment
exports.post_moment = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;



    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

	// The user IS logged here
	var uid = req.private_var_user.id;
	var name = fields.name;
	
	if ((ret = exports.MomentValidator["name"](name)) !== true)
            return (res.status(400).send(ret));


	// We create the new recipe
	var moment = {
	    "uid": uid,
	    "name":name,
	    "name_url":exports.nameToUrl(name),
	    "date":new Date(),
	    "likes":[],
	    "comments":[],
	    "photos":[]
	};


	db.collection('moments', function(err, collection_moments) {
	    if (err) {
		return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
	    }
	    else {
		collection_moments.insert(moment, function(err, result) {
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






// [READ] Get Moment By Id
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





// [READ] Get Moment By Name_Url
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







// [UPDATE] Put Moment By Id
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
		    else if (exports.MomentValidator[keys[i]](fields[keys[i]]) == false)
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





// [DELETE] Moment By Id
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







// LIKE A MOMENT
exports.like_moment = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.query.id;
    if (id.lendth == 24) {

        db.collection('moments', function(err, collection_moments) {
            if (err) {
                return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
            }
            else {
		
                collection_moments.findOne({"_id" : new BSON.ObjectID(id)}, function(err, moment) {
                    if (err) {
                        return (res.status(400).send({"res":false, "error_code":5554, "msg":"This user does not exists !"}));
                    }
                    else if (moment == null) {
			return (res.status(400).send({"res":false, "error_code":5554, "msg":"This 'id' moment was not found !"}));
                    }
                    else {
			
			// Verifie si le user follow bien le createur du moment
			if (req.private_var_user.follow.indexOf(moment.uid) == -1) {
		            return (res.status(400).send({"res":false, "error_code":0005, "msg":"You cannot like this moment ! You have to follow its owner first !"}));	    
			}

                        // We add the id of the user we want to follow
                        if (moment.likes.indexOf(req.private_var_user._id) != -1) {
                            moment.likes.push(req.private_var_user._id);

                            collection_moments.update({"_id": new BSON.ObjectID(moment._id)}, {$set: {"likes": moment.likes}}, {}, function(err, nbrUpdatedFields) {
				if (err) {
                                    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
                                }
                                else if (nbrUpdatedFields == null) {
                                    return (res.status(400).send({"res":false, "error_code":0005, "msg":"This 'id' moment was not found !"}));
				}
                                else {
                                    return (res.status(200).send({"res":true}));
				}
                            });
			}
                        else {
                            return (res.status(400).send({"res":false, "error_code":0005, "msg":"You are already like this moment !"}));
                        }
			
                    }
		});

            }
	    
	});
    }
    else {
	return (res.status(400).send({"res":false, "error_code":6582, "msg":"You 'id' moment was not found !"}));
    }
}







// TO UNLIKE A MOMENT
exports.unlike_moment = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.query.id;
    if (id.lendth == 24) {

        db.collection('moments', function(err, collection_moments) {
            if (err) {
                return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
            }
            else {
		
                collection_moments.findOne({"_id" : new BSON.ObjectID(id)}, function(err, moment) {
                    if (err) {
                        return (res.status(400).send({"res":false, "error_code":5554, "msg":"This user does not exists !"}));
                    }
                    else if (moment == null) {
			return (res.status(400).send({"res":false, "error_code":5554, "msg":"This 'id' moment was not found !"}));
                    }
                    else {
			
			// Verifie si le user follow bien le createur du moment
			if (req.private_var_user.follow.indexOf(moment.uid) == -1) {
		            return (res.status(400).send({"res":false, "error_code":0005, "msg":"You cannot like this moment ! You have to follow its owner first !"}));	    
			}

                        // We add the id of the user we want to follow
                        if (moment.likes.indexOf(req.private_var_user._id) != -1) {
                            moment.likes.pop(moment.likes.indexOf(req.private_var_user._id));

                            collection_moments.update({"_id": new BSON.ObjectID(moment._id)}, {$set: {"likes": moment.likes}}, {}, function(err, nbrUpdatedFields) {
				if (err) {
                                    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
                                }
                                else if (nbrUpdatedFields == null) {
                                    return (res.status(400).send({"res":false, "error_code":0005, "msg":"This 'id' moment was not found !"}));
				}
                                else {
                                    return (res.status(200).send({"res":true}));
				}
                            });
			}
                        else {
                            return (res.status(400).send({"res":false, "error_code":0005, "msg":"You are already like this moment !"}));
                        }
			
                    }
		});

            }
	    
	});
    }
    else {
	return (res.status(400).send({"res":false, "error_code":6582, "msg":"You 'id' moment was not found !"}));
    }
}








// TO COMMENT A MOMENT
exports.comment_moment = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.query.id;
    if (id.lendth == 24) {

        db.collection('moments', function(err, collection_moments) {
            if (err) {
                return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
            }
            else {
		
                collection_moments.findOne({"_id" : new BSON.ObjectID(id)}, function(err, moment) {
                    if (err) {
                        return (res.status(400).send({"res":false, "error_code":5554, "msg":"This user does not exists !"}));
                    }
                    else if (moment == null) {
			return (res.status(400).send({"res":false, "error_code":5554, "msg":"This 'id' moment was not found !"}));
                    }
                    else {
			
			// Verifie si le user follow bien le createur du moment
			if (req.private_var_user.follow.indexOf(moment.uid) == -1) {
		            return (res.status(400).send({"res":false, "error_code":0005, "msg":"You cannot like this moment ! You have to follow its owner first !"}));	    
			}

			// On recupere le comment
			var form = new formidable.IncomingForm();
			form.parse(req, function(err, fields, files) {

			    if (fields.comment == undefined || fields.comment == "") {
				return (res.status(400).send({"res":false, "error_code":4587, "msg":"You need to send the field 'comment' ! (This field is maybe empty)"}));
			    }
			    
			    var comment = {
				"_id" : MD5(uniqid()),
				"date" : new Date(),
				"content" : fields.comment
			    };
                            moment.comments.push(comment);
			    
			    
			    collection_moments.update({"_id": new BSON.ObjectID(moment._id)}, {$set: {"comments": moment.comments}}, {}, function(err, nbrUpdatedFields) {
				if (err) {
				    return (res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"}));
                                }
                                else if (nbrUpdatedFields == null) {
				    return (res.status(400).send({"res":false, "error_code":0005, "msg":"This 'id' moment was not found !"}));
				}
                                else {
				    return (res.status(200).send({"res":true, "id":comment.id}));
				}
			    });
			});
		    }
		});
	    }
	});

    }	    
    else {
	return (res.status(400).send({"res":false, "error_code":6582, "msg":"You 'id' moment was not found !"}));
    }
}







/*
** END MOMENT FUNCTIONS
*/
