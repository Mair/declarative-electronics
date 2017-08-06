// tslint:disable:member-ordering
import { PinMode } from "../index";
var throttle = require('lodash.throttle');

const analogThrottleMs = 100;

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

interface StoredReadCommand {
  pin: number;
  callback: (value: number) => void;
}

// by convention this class will map the method name to firmata's method name which is also the api endpoint
export class PinApi {
  socket: WebSocket;
  constructor(public url: string) {
    this.socket = new WebSocket(url);
    this.sendCommand = this.sendCommand.bind(this);
    this.digitalRead = this.digitalRead.bind(this);
    this.digitalWrite = this.digitalWrite.bind(this);
    this.receivedMessage = this.receivedMessage.bind(this);
    this.analogRead = this.analogRead.bind(this);
    this.analogWrite = this.analogWrite.bind(this);
    this.ensureSocketReady = this.ensureSocketReady.bind(this);
    this.recoverDeadSocket = this.recoverDeadSocket.bind(this);
  }

  private storedReadAnalogueCommands: StoredReadCommand[] = [];

  private registerReadAnalogCommands(reg: StoredReadCommand) {
    this.storedReadAnalogueCommands.push(reg);
  }

  private storedReadDigitalCommands: StoredReadCommand[] = [];

  private registerReadDigitalCommands(reg: StoredReadCommand) {
    this.storedReadDigitalCommands.push(reg);
  }

  private initialized = false;
  ensureSocketReady = () => {
    return new Promise<Commands>((res, rej) => {
      if (this.initialized) {
        res(this.commands);
        return;
      }
      this.socket.onopen = e => {
        console.log("socket opened");
        this.initialized = true;
        res(this.commands);
      };
      this.socket.onerror = e => {
        console.log("socket error", e);
        rej(e);
      };
      this.socket.close = e => {
        console.log("socket closed", e);
        this.recoverDeadSocket();
      };
      this.socket.onmessage = this.receivedMessage;
    });
  }

  tryingToRecover = false;
  recoverDeadSocket() {
    if (this.tryingToRecover) {
      return;
    }
    this.tryingToRecover = true;
    return new Promise(res => {
      console.warn("socket dead. attempting to reconnect in 3 seconds");
      let toutHandle = setInterval(async () => {
        console.warn("trying to revive socket");
        this.socket = new WebSocket(this.url);
        this.initialized = false;
        await this.ensureSocketReady();
        // recovered
        clearInterval(toutHandle);
        this.tryingToRecover = false;
        this.storedReadAnalogueCommands.map(cmd => this.analogRead(cmd.pin, cmd.callback));
        this.storedReadDigitalCommands.map(cmd => this.analogRead(cmd.pin, cmd.callback));
        res();
      }, 3000);
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

  private async sendCommand(command: string, pin: number, value?: number) {
    await this.checkSocketIsAlive();
    this.socket.send(JSON.stringify({ command, pin, value }));
  }

  private checkSocketIsAlive() {
    return new Promise(async res => {
      if (this.socket.readyState === 1) {
        res();
      } else {
        console.log("readyState", this.socket.readyState);
        await this.recoverDeadSocket();
      }
    });
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
      this.registerReadDigitalCommands({pin, callback});
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
      const doCallBack = throttle(value => {
              callback(value);
            }, analogThrottleMs, {'trailing': false });

      this.registeredListers.push({
        mode: PinMode.ANALOG,
        pin,
        registerEvent: payload => {
          if (payload.pin === pin && payload.mode === PinMode.ANALOG) {
            doCallBack(payload.value);
          }
        }
      });
      this.registerReadAnalogCommands({pin, callback});
    }
  }
}
