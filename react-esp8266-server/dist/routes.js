"use strict";
exports.__esModule = true;
var url = require("url");
var pinMode_1 = require("./pinMode");
function routes(app, board, wss) {
    var pinMapSet = {};
    wss.on("error", function (err) { return console.error(err); });
    wss.on("connection", function connection(ws, req) {
        var pongReceivedBridge;
        var checkIsAlive = function () {
            return new Promise(function (res) {
                var timeOutHandel = setTimeout(function () { return res(false); }, 5000);
                pongReceivedBridge = function () {
                    clearTimeout(timeOutHandel);
                    res(true);
                };
                ws.ping("", false, true);
            });
        };
        ws.on("pong", function () {
            if (pongReceivedBridge) {
                pongReceivedBridge();
            }
        });
        ws.on("message", function incoming(message) {
            try {
                var payload_1 = JSON.parse(message.toString());
                switch (payload_1.command) {
                    case "digitalWrite":
                        checkAndSetPinMode(payload_1.pin, pinMode_1.PinMode.OUTPUT);
                        board.digitalWrite(payload_1.pin, payload_1.value);
                        break;
                    case "digitalRead":
                        checkAndSetPinMode(payload_1.pin, pinMode_1.PinMode.INPUT);
                        board.digitalRead(payload_1.pin, function (value) {
                            checkIsAlive().then(function (isAlive) {
                                if (!isAlive) {
                                    ws.terminate();
                                    return;
                                }
                                ws.send(JSON.stringify({
                                    command: "digitalRead",
                                    pin: payload_1.pin,
                                    value: value
                                }), function (err) {
                                    console.error(err);
                                });
                            });
                        });
                        break;
                    case "analogWrite":
                        checkAndSetPinMode(payload_1.pin, pinMode_1.PinMode.PWM);
                        board.analogWrite(payload_1.pin, payload_1.value);
                        break;
                    case "analogRead":
                        checkAndSetPinMode(payload_1.pin, pinMode_1.PinMode.ANALOG);
                        board.analogRead(payload_1.pin, function (value) {
                            checkIsAlive().then(function (isAlive) {
                                if (!isAlive) {
                                    ws.terminate();
                                    return;
                                }
                                ws.send(JSON.stringify({
                                    command: "analogRead",
                                    pin: payload_1.pin,
                                    value: value,
                                    mode: pinMode_1.PinMode.ANALOG
                                }), function (err) {
                                    if (!err) {
                                        return;
                                    }
                                    console.error("error reading analog.", err);
                                });
                            });
                        });
                        break;
                    default:
                        console.error("unknown command ", payload_1);
                }
            }
            catch (err) {
                ws.send(JSON.stringify({ command: "error", err: err }));
            }
        });
        ws.on("error", function (error) { return console.error(error); });
    });
    function checkAndSetPinMode(pin, mode) {
        try {
            if (pinMapSet[pin] != mode) {
                board.pinMode(pin, mode);
                pinMapSet[pin] = mode;
            }
        }
        catch (err) {
            throw "invalid pin mode set. pin " + pin + " mode " + mode;
        }
    }
    // let lastReadAnalogueInput = 0;
    // app.post('/pinmode', (req, res) => {
    //     board.pinMode(req.body.pin, req.body.mode)
    //     res.send("ok");
    //     if (req.body.mode === firmata.PIN_MODE.ANALOG) {
    //         registerAnalogueInput(req.body.pin);
    //     }
    // })
    // function registerAnalogueInput(pin) {
    //     board.analogRead(pin, (val) => {
    //         lastReadAnalogueInput = val;
    //     })
    // }
    // app.post('/digitalwrite', (req, res) => {
    //     board.digitalWrite(req.body.pin, req.body.value);
    //     res.send("ok");
    // })
    // let lastReadDigit = 0;
    // app.post('/digitalread', (req, res) => {
    //     board.digitalRead(req.body.pin, (val) => {
    //         lastReadDigit = val;
    //     });
    //     res.send({ lastReadDigit });
    // })
    // app.post('/analogwrite', (req, res) => {
    //     board.analogWrite(req.body.pin, req.body.value);
    //     registerAnalogueInput(req.body.pin);
    //     res.send("ok");
    // })
    // app.post('/analogread', (req, res) => {
    //     // be sure this is set to analogue
    //     board.pinMode(req.body.pin, firmata.PIN_MODE.ANALOG)
    //     registerAnalogueInput(req.body.pin);
    //     res.send({ lastRead: lastReadAnalogueInput })
    // })
}
exports["default"] = routes;
//# sourceMappingURL=routes.js.map