import * as firmata from 'firmata'
import { Express } from 'express';

export default function routes(app: Express, board: firmata) {

     app.post('/pinmode', (req, res) => {   
        board.pinMode(req.body.pin, req.body.mode)
        res.send("ok");
    })

    app.post('/digitalwrite', (req, res) => {
        board.digitalWrite(req.body.pin, req.body.value);
        res.send("ok");
    })

    app.post('/analogwrite', (req, res) => {
        board.analogWrite(req.body.pin, req.body.value);
        res.send("ok");
    })

}

