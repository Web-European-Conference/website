/* 
 * @Author: imperugo
 * @Date:   2015-06-23 22:37:52
 * @Last Modified by:   imperugo
 * @Last Modified time: 2015-07-01 00:29:48
 */

(function(data) {

    'use strict';
    var database = require("./database");

    data.voteSession = function(vote, sessionId, next) {
        database.getDatabase(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                var voteObject = {
                    createAt: new Date(),
                    sessionId: sessionId,
                    vote: vote
                };

                db.votes
                    .insert(voteObject, function(err) {
                        if (err) {
                            next(err);
                        } else {
                            db.votes.aggregate({
                                $match: {
                                    "sessionId": sessionId
                                }
                            }, {
                                $group: {
                                    _id: "$sessionId",
                                    avgQuantity: {
                                        $avg: "$vote"
                                    }
                                }
                            }, function(err, results) {
                                if (err) {
                                    next(err, null);
                                } else {
                                    next(null, results);
                                }
                            });
                        }
                    });
            }
        });
    };

    data.getVote = function(sessionId, next) {

        database.getDatabase(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                db.votes.aggregate({
                    $match: {
                        "sessionId": sessionId
                    }
                }, {
                    $group: {
                        _id: "$sessionId",
                        avgQuantity: {
                            $avg: "$vote"
                        }
                    }
                }, function(err, results) {
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            }
        });
    };

    data.getVotes = function(next) {

        database.getDatabase(function(err, db) {
            if (err) {
                next(err, null);
            } else {
                db.votes.aggregate({
                    $group: {
                        _id: "$sessionId",
                        avgQuantity: {
                            $avg: "$vote"
                        }
                    }
                }, function(err, results) {
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
