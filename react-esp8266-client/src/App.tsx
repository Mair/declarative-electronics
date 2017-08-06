import * as React from "react";
import "./App.css";
import * as CompEl from ".//composable-electronics";
import { SketchPicker } from "react-color";

interface AppState {
  lEDiSoN: boolean;
  ledrgb: string;
  lastReadInput: number;
}

const ledStyle = {
  width: "20px",
  height: "20px",
  border: "1px solid black",
  borderRadius: "20px"
};

class App extends React.Component<{}, AppState> {
  state: AppState = { lEDiSoN: true, ledrgb: "#ffffff", lastReadInput: 0 };

  ledOn = () => <div style={{ ...ledStyle, backgroundColor: "yellow" }} />;
  ledOnColor = ({ rgbColor }) =>
    <div style={{ ...ledStyle, backgroundColor: rgbColor }} />
  ledOff = () => <div style={ledStyle} />;

  render() {
    const percent = (this.state.lastReadInput - 440) / 563 * 100;
    return (   
        <div className="demoPane">
          <div className="controllSegent">
            <button
              onClick={() => this.setState({ lEDiSoN: !this.state.lEDiSoN })}
            >
              click me
            </button>
            <CompEl.Led
              isOn={this.state.lEDiSoN}
              pin="D1"
              onTemplate={this.ledOn}
              offTemplate={this.ledOff}
            />
          </div>
          <div className="controllSegent">
            <SketchPicker
              disableAlpha={true}
              onChangeComplete={color => this.setState({ ledrgb: color.hex })}
              color={this.state.ledrgb}
            />
            <CompEl.LedRGB
              RPin="D6"
              GPin="D5"
              BPin="D7"
              isOn={true}
              offTemplate={this.ledOff}
              onTemplate={() =>
                <this.ledOnColor rgbColor={this.state.ledrgb} />}
              rgbColor={this.state.ledrgb}
            />
          </div>
          <div className="controllSegent">
            <CompEl.Pin
              mode={CompEl.PinMode.ANALOG}
              pin="A0"
              value={0}
              onPinRead={val => this.setState({ lastReadInput: val })}
            />
            <div style={{width : '100%', height: '10px', border: '1px solid black'}}>
              <div style={{width:  percent , height: '100%', backgroundColor: 'red'}} />
              </div>
            {this.state.lastReadInput}
          </div>
        </div>
    );
  }
}

export default App;
