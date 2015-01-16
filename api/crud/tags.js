
// [DEPENDENCIES]
var formidable = require('formidable');




/*
** BEGIN TAGS FUNCTIONS
*/


// Function to validate some formats
exports.TagValidator = { }; // better would be to have module create an object
exports.TagValidator.name = function(param)
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
//RecipeValidator[funcstr]();




// [CREATE] Post Tag
exports.post_tag = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

	var name = fields.name;
	
	var ret;
        if ((ret = exports.TagValidator["name"](name)) !== true)
            return (res.status(400).send(ret));
	
	// We create the new recipe
	var tag = {
	    "name":name,
	    "name_url":exports.nameToUrl(name)
	};
	

	db.collection('tags', function(err, collection_tags) {
	    if (err) {
		console.log(err);
		res.status(400).send({"res":false, "error_code":0005, "msg":"Something happened during the database access !"});
	    }
	    else {
		collection_tags.insert(tag, function(err, result) {
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






// [READ] Get Tag By Id
exports.get_tag_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;
    //return (res.send({"_id": "tags11111111111111111111", "name":"kasher"}));

    var id = req.params.id;
    if (id.length != 24)
	return (res.status(400).send({"res":false, "error_code":5553, "msg":"This tag 'id' was not found !"}));
    db.collection('tags').findOne({"_id" : id}, function(err, tag) {
	if (err) {
	    console.log(err);
	    return (res.status(400).send({"res":false, "error_code":5554, "msg":"This tag does not exists !"}));
	}
	else if (tag == null) {
	    return (res.status(400).send({"res":false, "error_code":5555, "msg":"This tag 'id' was not found !"}));
	}
	else {
	    tag.id = tag._id;
	    delete tag._id;
	    return (res.status(200).send(tag));
	}
    });
}







// [READ] Get Tag By Name_Url
exports.get_tag_by_name_url = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var name_url = req.params.name_url;
    db.collection('tags', function(err, collection_tags) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    collection_tags.findOne({"name_url" : name_url}, function(err, tag) {
		if (err) {
		    console.log(err);
		    res.status(400).send({"res":false, "error_code":5554, "msg":"This tag does not exists !"});
		}
		else if (tag == null) {
		    res.status(400).send({"res":false, "error_code":5553, "msg":"This tag 'name_url' was not found !"});
		}
		else {
		    tag.id = tag._id;
		    delete tag._id;
		    return (res.status(200).send(tag));
		}
	    });
	}
    });
};







// [UPDATE] Put Tag By Id
exports.put_tag_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;

    if (id.length != 24)
        return (res.status(400).send({"res":false, "error_code":5553, "msg":"This tag 'id' was not found !"}));

    db.collection('tags', function(err, collection_tags) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    var form = new formidable.IncomingForm();
	    form.parse(req, function(err, fields, files) {


		var tags_updated_fields = ["name"];

		var keys = Object.keys(fields);
                var f = {};
                for (i = 0; i < keys.length; i++) {
                    //console.log(i);
                    //console.log(keys[i]);

                    if (tags_updated_fields.indexOf(keys[i]) == -1)
                        // This keys was not found
			return (res.status(400).send({"res":false, "error_code":0009, "msg":"The field '"+keys[i]+"' cannot be updated !"}));
		    else if (TagValidator[keys[i]](fields[keys[i]]) == false)
			return (res.status(400).send({"res":false, "error_code":0005, "msg":"The '"+keys[i]+"' field is not in the right format !"}));
		    else
                        // We can add this fields to the future update request 
                        f[keys[i]] = fields[keys[i]];
                }

                // Here we can execute the update request
                //console.log(f);

		collection_tags.update({"_id": new BSON.ObjectID(id)}, {$set: f}, {}, function(err, nbrUpdatedFields) {
		    if (err) {
			res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
		    }
		    else if (nbrUpdatedFields == null) {
			return (res.status(400).send({"res":false, "error_code":0005, "msg":"This tag 'id' was not found !"}));
		    }
		    else {
			return (res.status(200).send({"res":true}));
		    }
		});
		
	    });
	}
    });
};





// [DELETE] Tag By Id
exports.delete_tag_by_id = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var id = req.params.id;

    if (id.length != 24)
        return (res.status(400).send({"res":false, "error_code":5553, "msg":"This tag 'id' was not found !"}));

    db.collection('tags', function(err, collection_tags) {
	if (err) {
	    res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
	}
	else {
	    req.params.id = req.params.id.length == 24 ? req.params.id : "000000000000000000000000";
	    collection_tags.remove({_id: new BSON.ObjectID(id)},  function(err, NbrRemovedDocs) {
		//console.log(NbrRemovedDocs);
		if (err) {
		    res.status(400).send({"res":false, "error_code":0004, "msg":"Can not remove this tag !"});
		}
		else if (NbrRemovedDocs == 1) {
		    res.status(400).send({"res":true});
		}
		else {
		    res.status(200).send({"res":false, "error_code":0004, "msg":"Can not remove this tag !"});
		}
	    });
	}

    });
};






// [READ] Find Tag
exports.find_tags = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;

    var q = req.query.q;
    if (q != undefined && q != null && q != "") {

        var c = db.collection('tags');
        c.find({"name": {$regex: q}}).toArray(function(err, docs) {
            if (err) {
                console.log(err);
                res.status(400).send({"res":false, "error_code":0004, "msg":"Something happened during the database access !"});
            }
            else {
                //console.log(docs);
                res.status(200).send(docs);
            }
        });
    }
    else {
        return (res.status(200).send([]));
    }
};




/*
** END TAG FUNCTIONS
*/
