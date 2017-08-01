"use strict";
exports.__esModule = true;
var firmata = require("firmata");
function routes(app, board) {
    var lastReadAnalogueInput = 0;
    app.post('/pinmode', function (req, res) {
        board.pinMode(req.body.pin, req.body.mode);
        res.send("ok");
        if (req.body.mode === 2 /* ANALOG */) {
            registerAnalogueInput(req.body.pin);
        }
    });
    function registerAnalogueInput(pin) {
        board.analogRead(pin, function (val) {
            lastReadAnalogueInput = val;
        });
    }
    app.post('/digitalwrite', function (req, res) {
        board.digitalWrite(req.body.pin, req.body.value);
        res.send("ok");
    });
    app.post('/analogwrite', function (req, res) {
        board.analogWrite(req.body.pin, req.body.value);
        registerAnalogueInput(req.body.pin);
        res.send("ok");
    });
    app.post('/analogread', function (req, res) {
        // be sure this is set to analogue
        board.pinMode(req.body.pin, 2 /* ANALOG */);
        registerAnalogueInput(req.body.pin);
        res.send({ lastRead: lastReadAnalogueInput });
    });
}
exports["default"] = routes;
//# sourceMappingURL=routes.js.map