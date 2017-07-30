import * as React from 'react';
import { PinApi } from '../api/PinApi';
import * as CompElec from '../';

const api = new PinApi();

interface PinProps {
    pin: number;
    value: number;
    mode: CompElec.PinMode;
}
export default class Pin extends React.PureComponent<PinProps> {

    componentDidMount() {
        this.initialMount();
    }

    async initialMount() {
        await api.pinMode(this.props.pin, this.props.mode);
        actionPin(this.props);
    }

    componentWillReceiveProps(nextProps: PinProps) {
        if (nextProps.mode === this.props.mode &&
            nextProps.pin === this.props.pin &&
            nextProps.value === this.props.value) {
            return;
        }
        actionPin(nextProps);
    }
    
    render() {
        return (
            null
        );
    }
}

export const actionPin = ({ pin, value, mode }) => {
    const { PinMode } = CompElec;
    switch (mode) {
        case PinMode.OUTPUT:
            api.digitalWrite(pin, value);
            break;
        case PinMode.PWM:
            api.analogWrite(pin, value);
            break;
        default:
            Promise.resolve();
    }
}
