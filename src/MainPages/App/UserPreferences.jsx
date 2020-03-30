import React, { useContext } from 'react';
import './UserPreferences.scss';

import LoginContext from '../../contexts/LoginContext';

function UserPreferences(props) {
    let lctx  = useContext(LoginContext);
    return <div id="user-preferences"  style={props.style}>
            <button onClick={ () => lctx.login.setUserPrefsVisible( !lctx.login.userPrefsVisible ) }>
                x
            </button>
            <button onClick={ () => {
                    localStorage.removeItem("offline_playlists");
                    localStorage.removeItem("token");
                    localStorage.removeItem("trackcache");
                    window.location.reload(true)
                } }>
                Reset
            </button>
            <button onClick={ () => {
                lctx.login.reset()
                } }>
                logout
            </button>
        </div>
}

export default UserPreferences;