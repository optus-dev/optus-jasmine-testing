// Simple connect static server for testing

connect = require('connect');

server = connect.createServer(
    connect.favicon(),
    connect.logger(),
    connect['static'](__dirname)
);

server.listen(3000);

console.log("Static server listening at port 3000... (ctrl+c to stop)");