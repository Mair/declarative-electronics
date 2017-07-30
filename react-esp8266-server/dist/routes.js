"use strict";
exports.__esModule = true;
function routes(app, board) {
    app.post('/pinmode', function (req, res) {
        board.pinMode(req.body.pin, req.body.mode);
        res.send("ok");
    });
    app.post('/digitalwrite', function (req, res) {
        board.digitalWrite(req.body.pin, req.body.value);
        res.send("ok");
    });
    app.post('/analogwrite', function (req, res) {
        board.analogWrite(req.body.pin, req.body.value);
        res.send("ok");
    });
}
exports["default"] = routes;
//# sourceMappingURL=routes.js.map