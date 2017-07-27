import * as React from 'react';
import './App.css';
import Led from './Led';

const logo = require('./logo.svg');

interface AppState {
  digit: number;
}
class App extends React.Component<{}, AppState> {
  state = { digit: 0 };
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Led digit={this.state.digit} pin={13} />
        <button
          value="press"
          onClick={() => {
            if (this.state.digit === 1) {
              this.setState({ digit: 0 });
            } else {
              this.setState({ digit: 1 });
            }
          }}
        >
          click me
        </button>
      </div >
    );
  }
}

export default App;
