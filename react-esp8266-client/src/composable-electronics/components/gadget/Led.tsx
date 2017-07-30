import * as React from 'react';
import * as CompEl from '../../';

interface LedProps {
    pin: number;
    isOn: boolean;
    onTemplate: React.StatelessComponent;
    offTemplate: React.StatelessComponent;
}
export class Led extends React.Component<LedProps> {
    render() {
        return (
            <div>
                <CompEl.Pin
                    mode={CompEl.PinMode.OUTPUT}
                    pin={this.props.pin}
                    value={this.props.isOn ? 1 : 0}
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