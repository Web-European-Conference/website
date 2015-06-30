/*
 * @Author: imperugo
 * @Date:   2015-06-23 21:50:13
 * @Last Modified by:   imperugo
 * @Last Modified time: 2015-06-30 23:07:40
 */


(function(votingController) {

    'use strict';
    var logger = require('../utils/logger');
    var data = require("../data/voting");
    var _ = require('underscore');

    votingController.init = function(app) {

        app.post("/voting/vote/", function(req, res) {

        	req.assert('sessionId', 'Field required').notEmpty();
            req.assert('vote', 'Field required').notEmpty();

            var sessionId = req.params.sessionId;
            var vote = req.params.vote;

           	var errors = req.validationErrors();

            if (errors) {
                logger.warn("Wrong request: ", errors);
                return res.json(400, errors);
            }

            data.voteSession(vote, sessionId, function(err, tracks) {
                if (err) {
                    res.send(400, "Failed to add vote to data store");
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(201, "You voted!!");
                }
            });
        });
    };


})(module.exports);
