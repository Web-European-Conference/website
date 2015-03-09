(function () {

    // Init global DOM elements, functions and arrays
    window.app = {el: {}, fn: {}};
    app.el['window'] = $(window);
    app.el['document'] = $(document);
    app.el['back-to-top'] = $('.back-to-top');
    app.el['html-body'] = $('html,body');
    app.el['loader'] = $('#loader');
    app.el['mask'] = $('#mask');

    app.fn.screenSize = function () {
        var size, width = app.el['window'].width();
        if (width < 320)
            size = "Not supported";
        else if (width < 480)
            size = "Mobile portrait";
        else if (width < 768)
            size = "Mobile landscape";
        else if (width < 960)
            size = "Tablet";
        else
            size = "Desktop";
        if (width < 768) {
            $('.animated').removeClass('animated').removeClass('hiding');
        }
        // $('#screen').html( size + ' - ' + width );
        // console.log( size, width );
    };



    $(function () {
        //Preloader
        app.el['loader'].delay(700).fadeOut();
        app.el['mask'].delay(1200).fadeOut("slow");

        // Resized based on screen size
        app.el['window'].resize(function () {
            app.fn.screenSize();
        });

        // fade in .back-to-top
        $(window).scroll(function () {
            if ($(this).scrollTop() > 500) {
                app.el['back-to-top'].fadeIn();
            } else {
                app.el['back-to-top'].fadeOut();
            }
        });

        // scroll body to 0px on click
        app.el['back-to-top'].click(function () {
            app.el['html-body'].animate({
                scrollTop: 0
            }, 1500);
            return false;
        });

        $('#mobileheader').html($('#header').html());

        function heroInit() {

           //alert(jQuery(window).height());

            var hero = jQuery('#hero'),
                    winHeight = jQuery(window).height(),
                    heroHeight = winHeight;

            hero.css({height: heroHeight + "px"});
        }
        ;

        jQuery(window).on("resize", heroInit);
        jQuery(document).on("ready", heroInit);

        $('.navigation-bar').onePageNav({
            currentClass: 'active',
            changeHash: true,
            scrollSpeed: 750,
            scrollThreshold: 0.5,
            easing: 'swing'
        });

        $('.animated').appear(function () {
            var element = $(this);
            var animation = element.data('animation');
            var animationDelay = element.data('delay');
            if (animationDelay) {
                setTimeout(function () {
                    element.addClass(animation + " visible");
                    element.removeClass('hiding');
                    if (element.hasClass('counter')) {
                        element.find('.value').countTo();
                    }
                }, animationDelay);
            } else {
                element.addClass(animation + " visible");
                element.removeClass('hiding');
                if (element.hasClass('counter')) {
                    element.find('.value').countTo();
                }
            }
        }, {accY: -150});

        $('#header').waypoint('sticky', {
            wrapper: '<div class="sticky-wrapper" />',
            stuckClass: 'sticky'
        });

        //$('.fancybox').fancybox();

        //
        //  Newsletter Signup
        //

        var $subscribe = $('#subscribe'),
            $response = $('#response'),
            $newsletterEmail = $('#NewsletterEmail'),
            $csrfToken = $('#csrfToken');

        $subscribe.on('submit', function (event) {
            event.preventDefault();

            var payload = {
                email: $newsletterEmail.val(),
                _csrf: $csrfToken.val()
            };

            console.log(payload);

            // update user interface
            $response.html('<span class="notice_message">Adding email address...</span>');
             
            // Prepare query string and send AJAX request
            $.ajax({
                url: '/api/notify/join',
                type: 'POST',
                data: payload,
                success: function(data, textStatus, jqXHR) {
                    
                    // show message
                    $response.html('<span class="success_message">' + data + '</span>');

                    // clear field
                    $newsletterEmail.val('');

                },
                error: function (jqXHR, textStatus, errorThrown) {

                    console.log(jqXHR, textStatus, errorThrown);

                    if (jqXHR.responseText) {

                        $response.html('<span class="error_message">' + jqXHR.responseText + '</span>');

                    } else if (jqXHR.responseJSON) {
                        if (jQuery.isArray(jqXHR.responseJSON)) {
                            // output messages
                            $response.html('<span class="error_message">' + jQuery.map(jqXHR.responseJSON, function (v) {
                                return v.msg;
                            }).join(', ') + '</span>');
                        }
                    }

                }
            });
        
            return false;
        });

    });

    // ****** GOOGLE MAP *******
    var map;
    var brooklyn = new google.maps.LatLng(45.513699,9.210525);

    var MY_MAPTYPE_ID = 'custom_style';

    function initialize() {

        var featureOpts = [
            {
                stylers: [
                    {saturation: -20},
                    {lightness: 40},
                    {visibility: 'simplified'},
                    {gamma: 0.8},
                    {weight: 0.4}
                ]
            },
            {
                elementType: 'labels',
                stylers: [
                    {visibility: 'on'}
                ]
            },
            {
                featureType: 'water',
                stylers: [
                    {color: '#dee8ff'}
                ]
            }
        ];

        var mapOptions = {
            zoom: 14,
            scrollwheel: false,
            panControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            center: new google.maps.LatLng(45.513699,9.210525),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, MY_MAPTYPE_ID]
            },
            mapTypeId: MY_MAPTYPE_ID
        };

        map = new google.maps.Map(document.getElementById('canvas-map'), mapOptions);
        var image = 'images/pmarker.png';
        var myLatLng = new google.maps.LatLng(45.513699,9.210525);
        var beachMarker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            icon: image
        });
        var styledMapOptions = {
            name: 'Custom Style'
        };

        var customMapType = new google.maps.StyledMapType(featureOpts, styledMapOptions);

        map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
    }

    google.maps.event.addDomListener(window, 'load', initialize);

})();
