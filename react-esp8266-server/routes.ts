import * as firmata from "firmata";
import { Express } from "express";
import * as WebSocket from "ws";
const url = require("url");
import { PinMode } from "./pinMode";

interface Payload {
  command: string;
  pin: number;
  value: number;
}
export default function routes(
  app: Express,
  board: firmata,
  wss: WebSocket.Server
) {
  let pinMapSet = {};

  wss.on("error", err => console.error(err));

  wss.on("connection", function connection(ws, req) {
    let pongReceivedBridge;

    const checkIsAlive = () => {
      return new Promise(res => {
        let timeOutHandel = setTimeout(() => res(false), 3000);
        pongReceivedBridge = () => {
          clearTimeout(timeOutHandel);
          res(true);
        };

        ws.ping("", false, true);
      });
    };

    ws.on("pong", () => {
      if (pongReceivedBridge) {
        pongReceivedBridge();
      }
    });

    ws.on("message", function incoming(message) {
      try {
        const payload = JSON.parse(message.toString()) as Payload;
        switch (payload.command) {
          case "digitalWrite":
            checkAndSetPinMode(payload.pin, PinMode.OUTPUT);
            board.digitalWrite(payload.pin, payload.value);
            break;
          case "digitalRead":
            checkAndSetPinMode(payload.pin, PinMode.INPUT);
            board.digitalRead(payload.pin, value => {
              checkIsAlive().then(isAlive => {
                if (!isAlive) {
                  ws.terminate();
                  return;
                }
                ws.send(
                  JSON.stringify({
                    command: "digitalRead",
                    pin: payload.pin,
                    value
                  }),
                  err => {
                    console.error(err);
                  }
                );
              });
            });
            break;
          case "analogWrite":
            checkAndSetPinMode(payload.pin, PinMode.PWM);
            board.analogWrite(payload.pin, payload.value);
            break;
          case "analogRead":
            checkAndSetPinMode(payload.pin, PinMode.ANALOG);
            board.analogRead(payload.pin, value => {
              checkIsAlive().then(isAlive => {
                if (!isAlive) {
                  ws.terminate();
                  return;
                }
                ws.send(
                  JSON.stringify({
                    command: "analogRead",
                    pin: payload.pin,
                    value,
                    mode: PinMode.ANALOG
                  }),
                  err => {
                    if (!err) {
                      return;
                    }
                    console.error("error reading analog.", err);
                  }
                );
              });
            });
            break;
          default:
            console.error("unknown command ", payload);
        }
      } catch (err) {
        ws.send(JSON.stringify({ command: "error", err }));
      }
    });

    ws.on("error", error => console.error(error));
  });

  function checkAndSetPinMode(pin, mode) {
    try {
      if (pinMapSet[pin] != mode) {
        board.pinMode(pin, mode);
        pinMapSet[pin] = mode;
      }
    } catch (err) {
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
