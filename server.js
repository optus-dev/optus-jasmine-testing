/*global connect require __dirname console*/
/**
 * Simple connect static server for testing
 */

var middleware = require('connect');

var server = middleware.createServer(
    middleware.favicon(),
    middleware.logger(),
    middleware['static'](__dirname + '/public')
);

server.listen(3000);

console.log("Static server listening at port 3000... (ctrl+c to stop)");