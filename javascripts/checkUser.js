/*global console*/
/**
 * SM 08Nov12: Example "checkUser" style plugin.
 * Note: For shop, will be jQuery 1.6 compatible.
 */
(function(window, undefined) {

    var $ = window.jQuery;

    // Constructor pattern
    function CheckUser(elem, options) {

        // Override default options
        this.options = $.extend({
            serverError: "Error: Cannot communicate with server."
        }, options);

        // Cache element references
        this.$elem      = $(elem);
        this.$input     = this.$elem.find("input[name=username]");
        this.$button    = this.$elem.find(".checkUserButton");
        this.$results   = this.$elem.find(".checkUserResult");

        // Server XHR url
        this.dataUrl = this.$elem.attr('data-url');

        // Bind to events etc
        this.init();
    }

    // Extend object prototype
    CheckUser.prototype = $.extend(CheckUser.prototype, {

        init: function () {

            var self = this;

            this.$elem.delegate(".checkUserButton", "click", function () {
                self.doCheck(self.$input.val());
            });
        },

        /**
         * Pass the username to the server and determine if it can be used.
         */
        doCheck: function (userName) {

            // Don't check if empty input
            userName = $.trim(userName);
            if (userName.length === 0) {
                return;
            }

            console.log("doCheck userName:", userName);

            // Note for future: success, error, complete -> done, fail, always

            $.ajax({
                type: "GET",
                url: this.dataUrl,
                data: { userName: userName },
                dataType: "json"
            })
            .success(this.doCheckSuccess)
            .error(this.doCheckError);

        },

        doCheckSuccess: function (data) {
            console.log("doCheckSuccess data:", data);
        },

        doCheckError: function (data) {
            console.log("doCheckError data:", data);
        }

    });

    // Define jQuery plugin function
    $.fn.checkUser = function(options) {
        return this.each(function () {
            $(this).data('checkUser', new CheckUser(this, options));
        });
    };

    // Bind only on document ready
    $(document).ready(function () {
        $(".fn-checkUserName").checkUser();
    });


}(window));