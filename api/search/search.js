
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
** BEGIN SEARCH FUNCTIONS
*/



var promise = require('promise');
// [READ] Research in recipes
exports.search_recipe = function(req, res) {
    var db = req.db;
    var BSON = req.BSON;
    
    var q = req.query.q;
    console.log("query : " + q);

    if (q === undefined || q === "")
	return (res.status(400).send({"res":false, "error_code":5547, "msg":"You have to send a query ([...]?q=[QUERY]) in the url !"}));

    var q_tab = q.split(" ");
    console.log(q_tab);

    
    var fields_to_test = ["name", "description", "steps.title", "steps.content"];


    var result_recipes = [];
    var reg = "(";
    for (i = 0 ; i < q_tab.length ; i++)
	reg += (i == q_tab.length - 1 ? (q_tab[i]+")") : ((q_tab[i]+"|")));
    console.log(reg);
    //reg = /(Nom|description)/i;
    reg = new RegExp(reg, "i");

    var in_find = [];
    for (i = 0 ; i < fields_to_test.length ; i++)
	{
	    var doc = {};
	    doc[fields_to_test[i]] = {$regex: reg};
	    in_find.push(doc);
	}


	
    var p = new promise(function(resolve, reject) {
	//reject("ERROR BANANE !");
	//resolve("SUCCESS BANANE !");
	
		
	db.collection('recipes', function(err, collection_recipes) {
	    if (err) {
		console.log("err : " + err);
		//return (res.status(400).send({"res":false, "error_code":5568, "msg":"An error happened during the database access !"}));
		reject({"res":false, "error_code":5568, "msg":"An error happened during the database access !"});
	    }
	    else {
		//collection_recipes.find({ name: { $regex: q, $options:"$i"}}).toArray(function(err, results) {
		//collection_recipes.find({$or : [{"name": {$regex: reg}}, {"description": {$regex: reg}}]}).toArray(function(err, results) {
		collection_recipes.find({$or : in_find}).toArray(function(err, results) {
		    if (err) {
			console.log("err : " + err);
			//return (res.status(400).send({"res":false, "error_code":5568, "msg":"An error happened during the database access !"}));
reject({"res":false, "error_code":5568, "msg":"An error happened during the database access !"});
		    }
		    else {
			console.log("Results found : " + results.length);
			for (var i = 0; i < results.length ; i++) {
			    console.log(results[i]._id);
			    if (result_recipes.indexOf(results[i]) == -1) {
				result_recipes.push(results[i]);
			    }
			}
			
			//return (res.status(200).send({"res":true, "results":result_recipes}));
			resolve();
		    }
		});
	    }
	});
	
	
	
    }).then(function(data) {
	console.log("onFulfilled");
	//console.log(data);
	
	return (res.status(200).send({"res":true, "results":result_recipes}));
    }, function(err) {
	console.log("onRejected");
	console.log(err);
	return (res.status(400).send(err));
    });

    
    
};





/*
** END USER FUNCTIONS
*/
