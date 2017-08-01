import * as React from 'react';
import { PinApi } from '../api/PinApi';
import * as CompElec from '../';

const api = new PinApi();

interface PinProps {
    pin: number;
    value: number;
    mode: CompElec.PinMode;
    onPinRead?: (value) => void;
    frequencyOfPinRead?: number;
    shouldRead?: boolean;
}
export default class Pin extends React.PureComponent<PinProps> {

    componentDidMount() {
        this.initialMount();
        if (this.props.onPinRead && this.props.frequencyOfPinRead && this.props.shouldRead) {
            this.pollRead();
        }
    }

    pollRead() {
        let intervalID = setInterval(() => {
            if (!this.props.shouldRead) {
                clearInterval(intervalID)
            }
            actionPin(this.props);
        }, this.props.frequencyOfPinRead)
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
            <div>
                {this.props.children}
            </div>
        );
    }
}

export const actionPin = (props: PinProps) => {
    const { PinMode } = CompElec;
    switch (props.mode) {
        case PinMode.OUTPUT:
            api.digitalWrite(props.pin, props.value);
            break;
        case PinMode.PWM:
            api.analogWrite(props.pin, props.value);
            break;
        case PinMode.ANALOG:
            api.analogRead(props.pin)
                .then(val => {
                    if (props.onPinRead) {
                        props.onPinRead(val);
                    }
                })
        default:

            Promise.resolve();
    }
}
