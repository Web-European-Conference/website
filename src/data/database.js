/*
* @Author: imperugo
* @Date:   2015-06-23 21:50:13
* @Last Modified by:   imperugo
* @Last Modified time: 2015-06-23 23:28:08
*/


(function(databaseModule) {

	'use strict';
	var logger = require('../utils/logger');
	var configuration = require("../config/credentials");

	var mongodb = require("mongodb");
  var database = null;

	databaseModule.getDatabase = function (next) {
    if (!database) {
      // connect to the database
      mongodb.MongoClient.connect(configuration.credentials.mongo.connectionString, function (err, db) {
        if (err) {
          next(err, null);
        } else {
          database = {
            db: db,
            tracks: db.collection("tracks"),
          };
          next(null, database);
        }
      });
    } else {
      next(null, database);
    }
  };

})(module.exports);