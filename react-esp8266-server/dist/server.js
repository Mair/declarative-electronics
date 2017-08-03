"use strict";
exports.__esModule = true;
var express = require("express");
var bodyParser = require("body-parser");
var firmata = require("firmata");
var Etherport = require("etherport-client");
var http = require("http");
var routes_1 = require("./routes");
var WebSocket = require("ws");
var etherPort = new Etherport.EtherPortClient({
    host: "192.168.1.108",
    port: 3030
});
var board = new firmata(etherPort);
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var server = http.createServer(app);
server.setMaxListeners(15);
var wss = new WebSocket.Server({ server: server });
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
});
var port = process.env.PORT || 3001;
board.on('ready', function () {
    console.log('board ready');
    routes_1["default"](app, board, wss);
    server.listen(port, function listening() {
        console.log('Listening on %d', server.address().port);
    });
});
//# sourceMappingURL=server.js.map