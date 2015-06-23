/* 
 * @Author: imperugo
 * @Date:   2015-06-23 22:37:52
 * @Last Modified by:   imperugo
 * @Last Modified time: 2015-06-23 23:58:33
 */

(function(data) {

    'use strict';
    var database = require("./database");

    data.getTrackSessions = function(next) {
        database.getDatabase(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                db.tracks
                	.find()
                	.sort({"time": 1})
                	.toArray(function(err, results) {
	                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

})(module.exports);
