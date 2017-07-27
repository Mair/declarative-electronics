import * as express from 'express';
import * as bodyParser from 'body-parser'
import * as firmata from 'firmata'
import * as Etherport from 'etherport-client'

const etherPort = new Etherport.EtherPortClient({
    host: "192.168.1.108",  // IP ESP8266
    port: 3030
})
const board = new firmata(etherPort);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
})
const port = process.env.PORT || 3000

board.on('ready', () => {

    app.post('/digitalwrite', (req, res) => {
        req.body.pins.map(pin => board.digitalWrite(pin.pin, pin.digit))
        
        res.send("ok");

    })

    app.listen(port, () => {
        console.log("listening on " + port)
    })
})

