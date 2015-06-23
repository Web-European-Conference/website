/*
* @Author: imperugo
* @Date:   2015-06-23 21:50:13
* @Last Modified by:   imperugo
* @Last Modified time: 2015-06-23 21:56:32
*/


(function (scheduleController) {

	'use strict';
	var logger = require('../utils/logger');
	var Q = require('q');

	scheduleController.init = function (app) {
        app.get("/schedule/getTrackSessions", function (req, res) {

        	var track = req.query.track;

            res.json ({
                track: track
            });
        });
    };


})(module.exports);

