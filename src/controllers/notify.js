(function (notifyController) {
    'use strict';
    var logger = require('../utils/logger');

    notifyController.init = function (app) {
        
        //
        //  TEST ENDPOINT (FOR TESTING RESPONSE CODES WITHOUT MAILCHIMP)
        //  

        // app.post('/api/notify/join', function (req, res) {

        //     // req.assert('email', 'Field required').notEmpty();
        //     // req.assert('email', 'Invalid email format').isEmail();

        //     // var errors = req.validationErrors();

        //     // res.json(400, errors);

        //     //res.status(400).send("User already subscribed");

        //     //res.status(500).send("Something went wrong. Please try again. " + error);

        //      res.send("Thanks for signing up!");

        // });

        var MailChimpAPI = require('mailchimp').MailChimpAPI;
        var credentials = require("../config/credentials.js").credentials;
        var mailChimpAPI;

        // logger.warn('AAA: ', process.env.MAILCHIMP_KEY);
        // logger.warn('BBB: ', process.env.MAILCHIMP_LIST_ID);

        try {
            mailChimpAPI = new MailChimpAPI(credentials.mailchimp.key, {
                version: '2.0'
            });
        } catch (error) {
            logger.error(error.message);
        }

        app.post('/api/notify/join', function (req, res) {

            logger.debug('email value: ' + req.body.email);

            req.assert('email', 'Field required').notEmpty();
            req.assert('email', 'Invalid email format').isEmail();

            var errors = req.validationErrors();
            var mappedErrors = req.validationErrors(true);

            if (errors) {
                logger.warn("Wrong request: ", errors);
                res.json(400, errors);
            }

            if (mailChimpAPI) {

                mailChimpAPI.lists_subscribe({
                    id: credentials.mailchimp.listId,
                    email: {
                        email: req.body.email
                    }
                }, function (error, data) {

                    logger.debug(error);
                    logger.debug(data);

                    if (error) {

                        if (error.code == 214) {
                            logger.debug("User already subscribed");
                            res.status(400).send("User already subscribed");
                        } else {
                            logger.error("There is an error calling MailChimp: " + error);
                            res.status(500).send("Something went wrong. Please try again. " + error);
                        }
                    } else {
                        logger.debug(data);
                        res.send("Thanks for signing up!");
                    }
                });

            } else {
                res.status(500).send("Failed to start MailChimp API");

            }
            
        });


        app.post('/api/contact/', function (req, res) {

            req.assert('name', 'Field required').notEmpty();
            req.assert('comments', 'Field required').notEmpty();
            req.assert('email', 'Field required').notEmpty();
            req.assert('email', 'Invalid email format').isEmail();

            var errors = req.validationErrors();
            var mappedErrors = req.validationErrors(true);

            if (errors) {
                logger.warn("Wrong request: ", errors);
                res.json(400, errors);

                return;
            }

            var model = {
                name: req.body.name,
                email: req.body.email,
                message: req.body.comments
            };

            app.mailer.send('email/contact', {
                from: req.body.email,
                to: 'info@webnetconf.eu',
                subject: 'New contact from website.', // REQUIRED.
                otherProperty: model
            }, function (err) {
                if (err) {
                    // handle error
                    logger.error(err);

                    res.send(500, 'There was an error sending the email');

                    return;
                }
            });

            app.mailer.send('email/responder', {
                from: 'info@webnectconf.eu',
                to: req.body.email,
                subject: 'Web European Conference'
            }, function (err) {
                if (err) {
                    // handle error
                    logger.error(err);

                    res.send(500, 'There was an error sending the email');

                    return;
                }
            });

            logger.log('info', 'Email Sent', model);
            res.send(200, 'Email Sent!');
        });
    };

})(module.exports);