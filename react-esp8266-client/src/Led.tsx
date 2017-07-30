import * as React from 'react';

interface LedProps {
    pin: number;
    digit: number;
}
export default class Led extends React.Component<LedProps, {}> {

    componentWillReceiveProps(nextProps: LedProps) {
        if (this.props.pin !== nextProps.pin || this.props.digit !== nextProps.digit) {
            this.changeColor();
        }
    }

    componentWillMount() {
        this.changeColor();
    }

    changeColor = () => {
        const myHeaders = new Headers({
            'Content-Type': 'application/json',

        });
            fetch('http://localhost:3000/digitalwrite', {
                body: JSON.stringify({
                    pins: [
                        {
                            pin: this.props.pin,
                            digit: this.props.digit
                        }
                    ]
                }),
                headers: myHeaders,
                method: 'POST'
            });
    }

    render() {
        const st: React.CSSProperties = {
            width: '50px',
            height: '50px',
            backgroundColor: this.props.digit ? 'red' : 'black'
        };
        return (
            <div>
                <div style={st} />
                
            </div>
        );
    }
}