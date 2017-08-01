import * as firmata from 'firmata'
import { Express } from 'express';

export default function routes(app: Express, board: firmata) {

    let lastReadAnalogueInput = 0;

    app.post('/pinmode', (req, res) => {
        board.pinMode(req.body.pin, req.body.mode)
        res.send("ok");
        if (req.body.mode === firmata.PIN_MODE.ANALOG) {
            registerAnalogueInput(req.body.pin);
        }
    })

    function registerAnalogueInput(pin) {
        board.analogRead(pin, (val) => {
            lastReadAnalogueInput = val;
        })
    }

    app.post('/digitalwrite', (req, res) => {
        board.digitalWrite(req.body.pin, req.body.value);
        res.send("ok");
    })

    app.post('/analogwrite', (req, res) => {
        board.analogWrite(req.body.pin, req.body.value);
        registerAnalogueInput(req.body.pin);
        res.send("ok");
    })

    app.post('/analogread', (req, res) => {
        // be sure this is set to analogue
        board.pinMode(req.body.pin, firmata.PIN_MODE.ANALOG)
        registerAnalogueInput(req.body.pin); 
        res.send({ lastRead: lastReadAnalogueInput })
    })

}

