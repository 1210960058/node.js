var MongoClienr = require('mongodb').MongoClient,
	settings = require('./setting');
MongoClient.connect("mongodb://"+setting.host+"/"+setting.db, function(err, db){
	if(err){return console.dir(err);}
	console.log("connected to db");
	});