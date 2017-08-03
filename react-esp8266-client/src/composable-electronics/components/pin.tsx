import * as React from "react";
import { PinApi, Commands } from "../api/PinApi";
import * as CompElec from "../";

interface PinProps {
  pin: number;
  value: number;
  mode: CompElec.PinMode;
  onPinRead?: (value: number) => void;
  pinConfiguration?: CompElec.NodeMCUV3Pins;
}

export default class Pin extends React.PureComponent<PinProps> {
  pinApi = new PinApi();

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
    try {
      const api = await this.pinApi.ensureSocketReady();
      actionPin(api, this.props, this.props.onPinRead);
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
  props: PinProps,
  onPinRead?: (value: number) => void
) => {
  const { PinMode } = CompElec;
  switch (props.mode) {
    case PinMode.OUTPUT:
      api.digitalWrite(props.pin, props.value);
      break;
    case PinMode.PWM:
      api.analogWrite(props.pin, props.value);
      break;
    case PinMode.ANALOG:
      if (!props.onPinRead) {
        // todo: ms change this to show pin nme instead of number
        throw `pin ${props.pin} is set to analog input. please supply a onPinRead callback`;
      }
      api.analogRead(props.pin, props.onPinRead);
      break;
    case PinMode.INPUT:
      if (!props.onPinRead) {
        // todo: ms change this to show pin nme instead of number
        throw `pin ${props.pin} is set to digital input. please supply a onPinRead callback`;
      }
      api.digitalRead(props.pin, props.onPinRead);
      break;
    default:
      console.error("invalid mode");
  }
};
