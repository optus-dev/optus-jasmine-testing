/*global describe expect it beforeEach afterEach sinon spyOn console*/
/**
 * SM 08Nov12: Tests for the check user spec
 */
describe("check user spec", function () {

    var $container;
    var $elem;
    var $input;
    var $resultElem;

    var server; // sinon fake server
    var plugin;

    var checkUserServerUrl = "/path/to/server/api";

    // mocked server json
    var checkUserSuccessJson = {
        "success": true,
        "data": {
            "availableUsername": true
        }
    };

    function createHtml() {
        var out = [];

        out.push('<div class="fn-checkUserNameTest" data-url="' + checkUserServerUrl + '">');
            out.push('<input type="text" name="username" placeholder="username here bro">');
            out.push('<button class="checkUserButton">Check Username</button>');
            out.push('<div class="checkUserResult hidden"></div>');
        out.push('</div>');

        return out.join("");
    }   

    /**
     * Use Sinon to mock XHR
     * @see http://sinonjs.org/docs/#fakeServer
     */
    function mockServer() {

        // Mock server
        server = sinon.fakeServer.create();

        // Successful check
        server.respondWithCheckUserSuccess = function (getUrl) {
            server.respondWith("GET", getUrl, [
                "200", { "Content-Type": "application/json" },
                JSON.stringify(checkUserSuccessJson)
            ]);
            server.respond();
        };

        // server error
        server.respondWithCheckUserServerError = function () {
            server.respondWith("GET", checkUserServerUrl, [ "500", {}, "" ]);
            server.respond();
        };
    }

    /**
     * Setup
     */
    beforeEach(function () {

        // Use sinon's fake server for xhr
        mockServer();

        // Mock HTML
        $container = $("<div></div>").append(createHtml()).appendTo("body");

        $elem       = $container.find(".fn-checkUserNameTest");
        $resultElem = $elem.find(".checkUserResult");
        $input      = $elem.find("input[name=username]");

        // Bind plugin
        $elem.checkUser();

        // Cache reference to plugin
        plugin = $elem.data("checkUser");
    });

    /**
     * Teardown
     */
    afterEach(function () {
        $container.remove(); // Remove this spec's mocked html
        server.restore(); // Restores the native XHR constructor.
    });

    describe("when plugin is initially bound", function () {

        it("will have the plugin bound to the element", function () {
            expect(plugin.constructor.name).toBe("CheckUser");
        });

        it("will have a hidden class on the results element", function () {
            expect($resultElem.hasClass("hidden")).toBe(true);
        });

    });

    describe("when no username is entered", function () {

        beforeEach(function() {
            $elem.find("input[name=username]").val("");
            $elem.find(".checkUserButton").trigger("click");
        });

        it("sends NO request to the server", function () {
            expect(server.queue).toBe(undefined);
        });

    });

    describe("when any username is entered", function () {

        beforeEach(function () {

            // Setup a spy
            spyOn(plugin, "doCheck").andCallThrough();

            // Enter a value and click check
            $elem.find("input[name=username]").val("WhateverValueGoesHere");
            $elem.find(".checkUserButton").trigger("click");
        });        

        // Test spy
        it("will call doCheck", function () {
            expect(plugin.doCheck).toHaveBeenCalled();
        });

        // Test XHR
        it("will send a GET request to the server", function () {
            // console.log('server', server);
            expect(server.queue.length).toEqual(1);
            expect(server.queue[0].method).toEqual("GET");
        });

    });

    describe("when a valid, unique username is entered", function() {

        beforeEach(function () {

            // For testing, lets show the results element
            $resultElem.removeClass("hidden");

            // Enter a value and click check
            $elem.find("input[name=username]").val("TheBigBoss");
            $elem.find(".checkUserButton").trigger("click");

            // XHR response
            server.respondWithCheckUserSuccess(checkUserServerUrl + "?userName=TheBigBoss");            
            console.log("server:", server);
        });

        it("will hide the results element (if visible)", function () {
            expect($resultElem.hasClass("hidden")).toBe(true);
        });

        it("will flag the input as valid", function () {
            expect($input.hasClass(plugin.options.inputValidCss)).toBe(true); // Less fragile test
        });

        
    });

    // For a call to the server that results in a 500
    describe("For an ajax error", function () {

        beforeEach(function () {

            // Trigger check
            $elem.find("input[name=username]").val("MyWirelessSucks");
            $elem.find(".checkUserButton").trigger("click");

            // 500
            server.respondWithCheckUserServerError();
        });

        it("shows an error message in the results element", function () {
            expect($resultElem.is(":visible")).toBe(true);
        });

    });

});