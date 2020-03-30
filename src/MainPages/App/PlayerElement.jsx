import React, { useContext, useEffect, useState } from 'react';
import PlayerContext from "../../contexts/PlayerContext";

let ref = React.createRef();
function PlayerElement() {
    let playerctx = useContext(PlayerContext);

    let [debug, setdebug] = useState(false);


    useEffect(() => {

        setTimeout(() => { playerctx.setAudioElement(ref) },1000);

        console.log(ref);
    },[])
    
    return <React.Fragment>
            <span class="debug" onClick={setdebug.bind(null, !debug)}>debug</span>

            <audio src={playerctx.audio__source} ref={ref} controls={debug}></audio>
         </React.Fragment>
}

export default PlayerElement;