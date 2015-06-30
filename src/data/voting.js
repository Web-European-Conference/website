/* 
 * @Author: imperugo
 * @Date:   2015-06-23 22:37:52
 * @Last Modified by:   imperugo
 * @Last Modified time: 2015-06-30 23:01:42
 */

(function(data) {

    'use strict';
    var database = require("./database");

    data.voteSession = function(vote, sessionid, next) {
        database.getDatabase(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                var vote = {
                    createAt: new Date(),
                    sessionId: sessionid,
                    vote: vote
                };

                db.votes
                    .insert(vote, function(err) {
                        if (err) {
                            next(err);
                        } else {
                            next(null);
                        }
                    });
            }
        });
    };

})(module.exports);
