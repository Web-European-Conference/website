/*
* @Author: imperugo
* @Date:   2015-06-23 21:50:13
* @Last Modified by:   imperugo
* @Last Modified time: 2015-06-23 22:05:17
*/


(function (connection) {

	'use strict';
	var logger = require('../utils/logger');
	var configuration = require("../config/credentials");

	var MongoClient = require('mongodb').MongoClient;

	return MongoClient;

})(module.exports);

