import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as firmata from 'firmata';
import * as Etherport from 'etherport-client';
import registerRoutes from './routes';

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
const port = process.env.PORT || 3001

board.on('ready', () => {
    console.log('board ready')
    registerRoutes(app, board);

    app.listen(port, () => {
        console.log("listening on " + port)
    })
    
})
board.on('fail',()=>{
    console.log('board failed')
})

board.on('error',()=>{
    console.log('board failed')
})

