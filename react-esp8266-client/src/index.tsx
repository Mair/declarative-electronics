import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { Provider } from './composable-electronics';

ReactDOM.render(
  <Provider serviceUrl="ws://localhost:3001" chipDefinition="ESP8266_NODE_MCU">
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();