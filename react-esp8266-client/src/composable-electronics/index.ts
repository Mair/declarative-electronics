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

export enum NodeMCUV3Pins {
  AO = 0,
  G1 = 1,
  VU = 2,
  S3 = 3,
  S2 = 4,
  S1 = 5,
  SC = 6,
  S0 = 7,
  SK = 8,
  G2 = 9,
  V3 = 10,
  EN = 11,
  RST = 12,
  G3 = 13,
  VIN = 14,
  D0 = 15,
  D1 = 16,
  D2 = 17,
  D3 = 18,
  D4 = 19,
  V3_1 = 20,
  G4 = 21,
  D5 = 22,
  D6 = 23,
  D7 = 24,
  D8 = 25,
  RX = 26,
  TX = 27,
  G5 = 28,
  V3_2 = 29
}