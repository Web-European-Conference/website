(function (homeController) {

    homeController.init = function (app) {
        app.get("/", function (req, res) {

            res.render("home/index", {
                applicationName: "Web European Conference",
                title: "Web European Conference",
                csrfToken: req.csrfToken(),
                // embed the livereload script
                livereload: GLOBAL.env === 'dev'
            });
        });
    };

})(module.exports);