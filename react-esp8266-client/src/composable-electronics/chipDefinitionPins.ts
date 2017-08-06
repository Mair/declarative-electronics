
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

export interface PinDefinition {
  names: string[];
  number: number;
  validModes: PinMode[];
}
export interface ChipDefinition {
  pins: PinDefinition[];
}

console.log(PinMode.INPUT);
const ESP8266_NODE_MCU: ChipDefinition = {
  pins: [
    {
      names: ["D0"],
      number: 16,
      // validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
        validModes: [0, 1, 2]
    },
    {
      names: ["D1"],
      number: 5,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D2"],
      number: 4,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D3 A0"],
      number: 0,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM, PinMode.ANALOG]
    },
    {
      names: ["D4"],
      number: 2,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D5"],
      number: 14,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D6"],
      number: 12,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D7"],
      number: 13,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D8"],
      number: 15,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D9", "RX"],
      number: 13,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    {
      names: ["D10", "TX"],
      number: 1,
      validModes: [PinMode.INPUT, PinMode.OUTPUT, PinMode.PWM]
    },
    { names: ["A0"], number: 0, validModes: [PinMode.ANALOG] }
  ]
};

export function validatePinNumber(
  chipSet: ChipDefinition,
  pinNumber: number,
  mode: PinMode
) {
  const pin = chipSet.pins.find(p => p.number === pinNumber);
  if (!pin) {
    throw `cannot find pin number ${pinNumber} for loaded chipDefinition. 
       Please use alternative or update definition`;
  }
  const gotPin = pin.validModes.find(pmode => pmode === mode);
  if (!gotPin) {
      const validModes = pin.validModes.reduce((prev, curr) => prev += ' ' + PinMode[curr], '');
      console.error(`invalid mode ${PinMode[mode]} for pin ${pinNumber} (${pin.names.join(' ') }.
      valid modes for this pin include ${validModes}`);
  }
}

export function lookUpName(chipSet: ChipDefinition, pinName: string) {
  const pin = chipSet.pins.find(p => {
    const foundName = p.names.find(name => name === pinName);
    return !!foundName;
  });
  if (!pin) {
    throw `cannot find pin name ${pinName} for loaded chipDefinition. Please use a number or update definition`;
  }
  return pin.number;
}

export function getChipDefinitionFromName(chipDefinitionName: string) {
  switch (chipDefinitionName) {
    case "ESP8266_NODE_MCU":
      return ESP8266_NODE_MCU;
    default:
      throw `${chipDefinitionName} is not known. Please omit the chipDefinition on the provider
            and use numbers on the pins or create your own definition (see TODO: add doc). 
            known definitions are ESP8266_NODE_MCU, ...`;
  }
}

export default {
  ESP8266_NODE_MCU
};
