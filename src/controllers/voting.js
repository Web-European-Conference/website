/*
 * @Author: imperugo
 * @Date:   2015-06-23 21:50:13
 * @Last Modified by:   imperugo
 * @Last Modified time: 2015-07-01 00:28:22
 */


(function(votingController) {

    'use strict';
    var logger = require('../utils/logger');
    var data = require("../data/voting");
    var _ = require('underscore');

    votingController.init = function(app) {

        app.post("/voting/vote/", function(req, res) {

            req.assert('sessionId', 'Field required').notEmpty();
            req.assert('sessionId', 'Invalid session id').isInt();
            req.assert('vote', 'Field required').notEmpty();
            req.assert('vote', 'Invalid vote').isInt();

            var sessionId = parseInt(req.body.sessionId);
            var vote = parseInt(req.body.vote);

            var errors = req.validationErrors();

            if (errors) {
                logger.warn("Wrong request: ", errors);
                return res.json(400, errors);
            }

            data.voteSession(vote, sessionId, function(err, newAverageVote) {
                if (err) {
                    res.status(400).send("Failed to add vote to data store");
                } else {
                    res.set("Content-Type", "application/json");
                    res.status(201).send(newAverageVote[0]);
                }
            });
        });

        app.get("/voting/votes/", function(req, res) {
            data.getVotes(function(err, results) {
                if (err) {
                    res.status(400).send("Failed to retrieve votes from data store");
                } else {
                    res.set("Content-Type", "application/json");
                    res.status(200).send(results);
                }
            });
        });
    };


})(module.exports);
