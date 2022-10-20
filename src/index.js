// eslint-disable-next-line filenames/no-index
import './i18n';
import {App} from './app/App';
import React from 'react';
import {render} from 'react-dom';

render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root'),
);
