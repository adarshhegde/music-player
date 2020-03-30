import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';

import MainRouter from './MainRouter';
import LoginProvider from './providers/LoginProvider';

import AppProvider from "./providers/AppProvider";
ReactDOM.render(<AppProvider>
    <LoginProvider><MainRouter /></LoginProvider>
</AppProvider>, document.getElementById('root'));

serviceWorker.register();
