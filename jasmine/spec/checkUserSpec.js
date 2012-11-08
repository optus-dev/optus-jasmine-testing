/**
 * SM 08Nov12: Tests for the check user spec
 */
describe("Check user spec", function () {

    var $container;
    var $elem;

    var server;
    var plugin;

    var checkUserServerUrl = "/path/to/server/api";

    // mocked server json
    var checkUserSuccessJson = {
        "success": true,
        "data": {
            "availableUsername": true
        }
    };

    function createHtml(options) {
        var out = [];

        out.push('<div class="fn-checkUserNameTest" data-url="' + checkUserServerUrl + '">');
            out.push('<input type="text" name="username" placeholder="username here bro">');
            out.push('<button class="checkUserButton">Check Username</button>');
            out.push('<div class="checkUserResult hidden"></div>');
        out.push('</div>');

        return out.join("");
    }

    beforeEach(function () {

        // Mock server
        server = sinon.fakeServer.create();

        // Successful check
        server.respondWithCheckUserSuccess = function () {
            server.respondWith("GET", checkUserServerUrl, [
                "200", { "Content-Type": "application/json" },
                JSON.stringify(checkUserSuccessJson)
            ]);
        };

        // server error
        server.respondWithCheckUserServerError = function () {
            server.respondWith("GET", checkUserServerUrl, [ "500", {}, "" ]);
        };

        // Mock HTML
        $container = $("<div></div>").append(createHtml()).appendTo("body");

        // Bind plugin
        $elem = $container.find(".fn-checkUserNameTest");
        $elem.checkUser();

        // Cache reference to plugin
        plugin = $elem.data("checkUser");
    });

    afterEach(function () {
        $container.remove();
        server.restore(); // Restores the native XHR constructor.
    });

    it("will have the plugin bound to the element", function () {
        expect(plugin.constructor.name).toBe("CheckUser");
    });

    it("will have a hidden results element", function () {
        var $resultElem = $elem.find(".checkUserResult");
        expect($resultElem.is(":visible")).toBe(true);
        expect($resultElem.hasClass("hidden")).toBe(true);
    });

    describe("When no username is entered", function () {

        beforeEach(function() {
            $elem.find("input[name=username]").val("");
            $elem.find(".checkUserButton").trigger("click");
        });

        it("sends NO request to the server", function () {
            expect(server.queue).toBe(undefined);
        });

    });

    describe("For a successful check", function() {

        beforeEach(function () {

            // Setup a spy
            spyOn(plugin, "doCheck").andCallThrough();

            // Enter a value and click check
            $elem.find("input[name=username]").val("TheBigBoss");
            $elem.find(".checkUserButton").trigger("click");
        });

        // Test spy
        it("will call doCheck", function () {
            expect(plugin.doCheck).toHaveBeenCalled();
        });

        // Test XHR
        it("will send a request to the server", function () {
            console.log("server:", server);
            expect(server.queue.length).toEqual(1);
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
            var $result = $elem.find(".checkUserResult");
            expect($result.hasClass("hidden")).toBe(false);
        });

    });

});