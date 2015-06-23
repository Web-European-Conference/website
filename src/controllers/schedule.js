/*
 * @Author: imperugo
 * @Date:   2015-06-23 21:50:13
 * @Last Modified by:   imperugo
 * @Last Modified time: 2015-06-23 23:44:39
 */


(function(scheduleController) {

    'use strict';
    var logger = require('../utils/logger');
    var data = require("../data/schedule");

    scheduleController.init = function(app) {

        app.get("/schedule/getTrackSessions", function(req, res) {
            data.getTrackSessions(req.query.track, function(err, tracks) {
                if (err) {
                    res.send(400, err);
                } else {
                    res.set("Content-Type", "application/json");
                    res.json(tracks);
                }
            });
        });
    };


})(module.exports);
