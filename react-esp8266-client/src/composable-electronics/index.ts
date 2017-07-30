import Pin from './components/pin';
import { Led } from './components/gadget/Led';
import { LedRGB } from './components/gadget/LedRGB';

export {
  Pin,
  Led,
  LedRGB
};

export enum PinMode {
  INPUT = 0x00,
  OUTPUT = 0x01,
  ANALOG = 0x02,
  PWM = 0x03,
  SERVO = 0x04,
  SHIFT = 0x05,
  I2C = 0x06,
  ONEWIRE = 0x07,
  STEPPER = 0x08,
  SERIAL = 0x0A,
  PULLUP = 0x0B,
  IGNORE = 0x7F,
  UNKOWN = 0x10
}
