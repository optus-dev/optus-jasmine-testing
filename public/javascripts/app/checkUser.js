/*global console*/
/**
 * SM 08Nov12: Example "checkUser" style plugin.
 */
(function(window, undefined) {

    var $ = window.jQuery;

    // Constructor pattern
    function CheckUser(elem, options) {

        // Override default options
        this.options = $.extend({
            serverError: "Error: Cannot communicate with server.",
            inputValidCss: 'inputValid',
            inputInvalidCss: 'inputInvalid'
        }, options);

        // Cache element references
        this.$elem       = $(elem);
        this.$input      = this.$elem.find("input[name=username]");
        this.$button     = this.$elem.find(".checkUserButton");
        this.$resultElem = this.$elem.find(".checkUserResult");

        // Server XHR url
        // SM 09Nov12: Don't cache this, to keep plugin flexible
        //this.dataUrl = this.$elem.attr('data-url');

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

            // Dynamically get the url each time, to allow us to change the value on the fly
            var dataUrl = this.$elem.attr('data-url');

            // Note for future: success, error, complete -> done, fail, always
            // Note: Must proxy to keep 'this' in scope

            $.ajax({
                type: "GET",
                url: dataUrl,
                data: { userName: userName },
                dataType: "json"
            })
            .done($.proxy(this.doCheckDone, this))
            .fail($.proxy(this.doCheckFail, this));

        },

        doCheckDone: function (jsonData) {
            console.log("doCheckError done jsonData:", jsonData);
            if (jsonData.success) {
                if (jsonData.data.availableUsername) {
                    this.$resultElem.addClass("hidden");
                    this.$input.removeClass(this.options.inputInvalidCss).addClass(this.options.inputValidCss);
                } else {
                    // TODO Username is not available
                }
            } else {
                // TODO System failed to check either way
            }
        },

        doCheckFail: function (xhr, status) {
            console.log("doCheckError fail xhr:", xhr, "status", status);
            this.$input.removeClass(this.inputValidCss).addClass(this.inputInvalidCss);
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