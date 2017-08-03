import { PinMode } from "../index";

export interface Commands {
  digitalWrite: (pin: number, value: number) => void;
  digitalRead: (pin: number, callback: (value: number) => void) => void;
  analogRead: (pin: number, callback: (value: number) => void) => void;
  analogWrite: (pin: number, value: number) => void;
}

interface Payload {
  command: string;
  pin: number;
  value: number;
  mode?: PinMode;
}

interface Registration {
  pin: number;
  mode: PinMode;
  registerEvent: (payload: Payload) => void;
}

// by convention this class will map the method name to firmata's method name which is also the api endpoint
export class PinApi {
  socket: WebSocket;
  constructor() {
    this.socket = new WebSocket("ws://localhost:3001");
    this.sendCommand = this.sendCommand.bind(this);
    this.digitalRead = this.digitalRead.bind(this);
    this.digitalWrite = this.digitalWrite.bind(this);
    this.receivedMessage = this.receivedMessage.bind(this);
    this.analogRead = this.analogRead.bind(this);
    this.analogWrite = this.analogWrite.bind(this);
  }

  // tslint:disable-next-line:member-ordering
  private initialized = false;
  ensureSocketReady() {
    return new Promise<Commands>((res, rej) => {
      if (this.initialized) {
        res(this.commands);
        return;
      }
      this.socket.onopen = e => {
        console.log("socket opened");
        res(this.commands);
      };
      this.socket.onerror = e => {
        console.log("socket error", e);
        rej(e);
      };
      this.socket.close = e => console.log("socket closed", e);
      this.socket.onmessage = this.receivedMessage;
      this.initialized = true;
    });
  }

  // tslint:disable-next-line:member-ordering
  registeredListers = new Array<Registration>();
  receivedMessage(e: MessageEvent) {
    try {
      const payload = JSON.parse(e.data) as Payload;
      if (payload.command === "error") {
        throw payload;
      }
      this.registeredListers.map(listener => listener.registerEvent(payload));
    } catch (err) {
      console.error("error in comms", err);
    }
  }

  get commands(): Commands {
    return {
      digitalWrite: this.digitalWrite,
      digitalRead: this.digitalRead,
      analogRead: this.analogRead,
      analogWrite: this.analogWrite
    };
  }

  private sendCommand(command: string, pin: number, value?: number) {
    this.socket.send(JSON.stringify({ command, pin, value }));
  }

  private digitalWrite(pin: number, value: number) {
    this.sendCommand("digitalWrite", pin, value);
  }

  private digitalRead(pin: number, callback: (value: number) => void) {
    this.sendCommand("digitalRead", pin);
    if (
      this.registeredListers.findIndex(
        reg => reg.pin === pin && reg.mode === PinMode.INPUT
      ) === -1
    ) {
      this.registeredListers.push({
        mode: PinMode.INPUT,
        pin,
        registerEvent: payload => {
          if (payload.pin === pin && payload.mode === PinMode.INPUT) {
            callback(payload.value);
          }
        }
      });
    }
  }

  private analogWrite(pin: number, value: number) {
    this.sendCommand("analogWrite", pin, value);
  }

  private analogRead(pin: number, callback: (value: number) => void) {
    this.sendCommand("analogRead", pin);
    if (
      this.registeredListers.findIndex(
        reg => reg.pin === pin && reg.mode === PinMode.ANALOG
      ) === -1
    ) {
      this.registeredListers.push({
        mode: PinMode.ANALOG,
        pin,
        registerEvent: payload => {
          if (payload.pin === pin && payload.mode === PinMode.ANALOG) {
            callback(payload.value);
          }
        }
      });
    }
  }
}
