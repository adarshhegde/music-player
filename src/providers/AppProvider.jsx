import React, { useState } from "react";
import MainContext from "../contexts/MainContext";
import axios from 'axios';

function readableDuration(seconds) {
    let sec = Math.floor( seconds );    
    let min = Math.floor( sec / 60 );
    min = min >= 10 ? min : '0' + min;    
    sec = Math.floor( sec % 60 );
    sec = sec >= 10 ? sec : '0' + sec;    
    return min + ':' + sec;
}


const AppProvider = props => {
    const [playerexpanded, setplayerexpanded] = useState(false)
    const store = {
        playerexpanded, setplayerexpanded
    }

    return (
    <MainContext.Provider value={store}>
        {props.children}
    </MainContext.Provider>
    )
}

export default AppProvider;