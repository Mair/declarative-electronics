import * as React from "react";
import { PinApi, Commands } from "../api/PinApi";
import * as CompElec from "../";
import { compElProptypes } from './CompElProvider';
import { ChipDefinition, getChipDefinitionFromName, lookUpName, validatePinNumber } from '../chipDefinitionPins';

interface PinProps {
  pin: number | string;
  value: number;
  mode: CompElec.PinMode;
  onPinRead?: (value: number) => void;
}

export default class Pin extends React.PureComponent<PinProps> {

  private static _pinApi;
  private chipDefinitionPins: ChipDefinition;

  static contextTypes = compElProptypes;

  constructor(props: any, context: any) {
    super(props, context);
    if (!Pin._pinApi) {
      Pin._pinApi = new PinApi(context.serviceUrl);
    }
     const {chipDefinition} = context; 
      if (typeof chipDefinition === 'string') {
        this.chipDefinitionPins = getChipDefinitionFromName(chipDefinition);
      } else {
        this.chipDefinitionPins = chipDefinition;
      }

  }

  componentDidMount() {
    this.mountPin();
  }

  componentWillReceiveProps(nextProps: PinProps) {
    // parent state changes will cause this component to re-render.
    // this will inturn cause our socket to fire
    // this is undesirable unless one of the properties has changed
    if (
      nextProps.pin === this.props.pin &&
      nextProps.value === this.props.value &&
      nextProps.mode === this.props.mode
    ) {
      return;
    }
    this.mountPin();
  }

  async mountPin() {
    let pinNumber: number;
    if (typeof this.props.pin === 'number') {
      pinNumber = this.props.pin;
    } else {
      pinNumber = lookUpName(this.chipDefinitionPins, this.props.pin);
    }
    if (this.chipDefinitionPins) {
      validatePinNumber(this.chipDefinitionPins, pinNumber, this.props.mode);
    }
    try {
      const api = await Pin._pinApi.ensureSocketReady();
      actionPin(api, pinNumber, this.props.value, this.props.mode, this.props.onPinRead);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}

export const actionPin = (
  api: Commands,
  pin: number,
  value: number,
  mode: CompElec.PinMode,
  onPinRead?: (value: number) => void
) => {
  const { PinMode } = CompElec;
  switch (mode) {
    case PinMode.OUTPUT:
      api.digitalWrite(pin, value);
      break;
    case PinMode.PWM:
      api.analogWrite(pin, value);
      break;
    case PinMode.ANALOG:
      if (!onPinRead) {
        // todo: ms change this to show pin nme instead of number
        throw `pin ${pin} is set to analog input. please supply a onPinRead callback`;
      }
      api.analogRead(pin, onPinRead);
      break;
    case PinMode.INPUT:
      if (!onPinRead) {
        // todo: ms change this to show pin nme instead of number
        throw `pin ${pin} is set to digital input. please supply a onPinRead callback`;
      }
      api.digitalRead(pin, onPinRead);
      break;
    default:
      console.error("invalid mode");
  }
};
