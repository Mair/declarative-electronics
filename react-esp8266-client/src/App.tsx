import * as React from 'react';
import './App.css';
import * as CompEl from './/composable-electronics';
// import { SketchPicker } from 'react-color';

const logo = require('./logo.svg');

interface AppState {
  lEDiSoN: boolean;
  ledrgb: string;
  lastReadInput: number;
}

const ledStyle = {
  width: '20px',
  height: '20px',
  border: '1px solid black',
  borderRadius: '20px'
};

class App extends React.Component<{}, AppState> {
  state: AppState = { lEDiSoN: true, ledrgb: '#ffffff', lastReadInput: 0 };

  ledOn = () => <div style={{ ...ledStyle, backgroundColor: 'yellow' }} />;
  ledOnColor = ({ rgbColor }) => <div style={{ ...ledStyle, backgroundColor: rgbColor }} />;
  ledOff = () => <div style={ledStyle} />;

  render() {

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="demoPane">
          {/* <div className="controllSegent">
            <button onClick={() => this.setState({ lEDiSoN: !this.state.lEDiSoN })} > click me </button>
            <CompEl.Led isOn={this.state.lEDiSoN} pin={16} onTemplate={this.ledOn} offTemplate={this.ledOff} />
          </div>
          <div className="controllSegent">
            <SketchPicker onChangeComplete={color => this.setState({ ledrgb: color.hex })} color={this.state.ledrgb} />
            <CompEl.LedRGB
              RPin={12}
              GPin={14}
              BPin={13}
              isOn={true}
              offTemplate={this.ledOff}
              onTemplate={() => <this.ledOnColor rgbColor={this.state.ledrgb} />}
              rgbColor={this.state.ledrgb}
            />
          </div> */}
          <div className="controllSegent">
            <CompEl.Pin
              mode={CompEl.PinMode.ANALOG}
              pin={CompEl.NodeMCUV3Pins.AO}
              value={0}
              shouldRead={true}
              frequencyOfPinRead={300}
              onPinRead={val => this.setState({ lastReadInput: val.lastRead })}
            />
            {this.state.lastReadInput}
          </div>
        </div>


      </div >
    );
  }
}

export default App;
