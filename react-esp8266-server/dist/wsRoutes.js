var express = require('express');
var http = require('http');
var url = require('url');
var WebSocket = require('ws');
var app = express();
app.use(function (req, res) {
    res.send({ msg: "hello" });
});
var server = http.createServer(app);
var wss = new WebSocket.Server({ server: server });
wss.on('connection', function connection(ws, req) {
    var location = url.parse(req.url, true);
    // You might use location.query.access_token to authenticate or share sessions
    // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    ws.send('something');
});
server.listen(8080, function listening() {
    console.log('Listening on %d', server.address().port);
});
//# sourceMappingURL=wsRoutes.js.map