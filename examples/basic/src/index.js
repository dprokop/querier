import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { QuerierProvider } from 'querier';

const AppComponent = () => {
  return (
    <QuerierProvider>
      <App />
    </QuerierProvider>
  );
}

ReactDOM.render(<AppComponent />, document.getElementById('root'));
registerServiceWorker();
