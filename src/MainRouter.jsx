import React, { useContext } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";
import Login from './MainPages/Login/Login'
import App from './MainPages/App/App';
import AddSongFromShare from './MainPages/Share/AddSongFromShare';

import LoginContext from './contexts/LoginContext'
import PlaylistProvider from './providers/PlaylistProvider';
import PlayerProvider from './providers/PlayerProvider';
import { AiOutlineLoading } from 'react-icons/ai';

function MainRouter() {

    let context = useContext(LoginContext);
    console.log(context)
    return <React.Fragment>
{context.login.status === null ? <div id="loading"><span id="loading-spinner"><AiOutlineLoading/></span></div> :    <Router>
        <Switch>

            <Route path="/addtrack">
            {context.login.status ?  <AddSongFromShare /> : <Redirect to='/login' />}
            </Route>

            <Route path="/login">
            {!context.login.status ?  <Login /> : <Redirect to='/' />}

            </Route>


            <Route path="/">
               {context.login.status ? <PlaylistProvider><PlayerProvider> <App /> </PlayerProvider></PlaylistProvider>: <Redirect to='/login' />}
            </Route>

        </Switch>
    </Router>}
</React.Fragment>
}

export default MainRouter