/* global GLOBAL */
/// <reference path="../../typings/express/express.d.ts"/>

(function (homeController) {

    homeController.init = function (app) {

        var data = require("../data/schedule");
        var _ = require('underscore');

        app.get("/", function (req, res) {

            data.getTrackSessions(function(err, tracks) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.render("home/index", {
                        applicationName: "Web European Conference",
                        title: "Web European Conference",
                        csrfToken: req.csrfToken(),
                        // embed the livereload script
                        livereload: GLOBAL.env === 'dev',
                        tracks: _.groupBy(tracks,function(o) {
                            return o.track;
                        })
                    });
                }
            });

            
        });
    };

})(module.exports);