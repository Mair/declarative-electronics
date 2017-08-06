import * as React from 'react';
import * as CompEl from '../../';
import { hexToRgb } from './../../helpers/hexToRgb';

interface LedProps {
    RPin: number | string;
    GPin: number | string;
    BPin: number | string;
    isOn: boolean;
    rgbColor: string;
    onTemplate: React.StatelessComponent;
    offTemplate: React.StatelessComponent;
}
export class LedRGB extends React.Component<LedProps> {
    render() {
        const rgb = hexToRgb(this.props.rgbColor);
        if (!rgb) {
            console.error('Input of RGB is invalid. It should be in hex notation eg. #123456 ');
            return null;
        }
        return (
            <div>
                <CompEl.Pin
                    mode={CompEl.PinMode.PWM}
                    pin={this.props.RPin}
                    value={rgb.r}
                />

                <CompEl.Pin
                    mode={CompEl.PinMode.PWM}
                    pin={this.props.GPin}
                    value={rgb.g}
                />
                <CompEl.Pin
                    mode={CompEl.PinMode.PWM}
                    pin={this.props.BPin}
                    value={rgb.b}
                />

                {this.props.isOn &&
                    this.props.onTemplate(this.props)
                }
                {!this.props.isOn &&
                    this.props.offTemplate(this.props)
                }

            </div>
        );
    }
}