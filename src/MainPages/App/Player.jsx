import React, { Component, useContext } from 'react';
import { MdNavigateBefore, MdNavigateNext, MdPlayArrow, MdPause } from "react-icons/md"

import PlayerContext from "../../contexts/PlayerContext";
import MainContext from "../../contexts/MainContext";

function Player(props) {
    let playerctx = useContext(PlayerContext);
    let mainctx = useContext(MainContext);

        return (<div id="player-container">
                <span style={ { "--data-progress": 
                    playerctx.loading === true  ? "0%" :
                    (playerctx.metadata.currentProgress + "%")
                } }
              className="progress-bar"></span>

            <div id="song-image" style={{"--data-image":"url("+playerctx.metadata.currentImage+")"}}><img src={playerctx.metadata.currentImage} /></div>
            
            <div id="labels-container" onClick={() => mainctx.setplayerexpanded(!mainctx.playerexpanded)}>

                <span id="time-elapsed">
                    {playerctx.metadata.currentTime}
                </span>

                <span id="song-name">
                {playerctx.metadata.currentName}
                </span>

                <span id="song-author">
                {playerctx.metadata.currentAuthor}
                </span>

                <span id="time-total">
                {playerctx.metadata.currentDuration}
                </span>

            </div>
            <div id="controls-container">
                <span className="player-control" onClick={playerctx.tryPlayPrev.bind(null)}>
                    <MdNavigateBefore />
                </span>
                <span className="player-control" onClick={playerctx.playToggle}>
                    {playerctx.playing ? <MdPause/> : <MdPlayArrow/>}
                </span>

                <span className="player-control" onClick={playerctx.tryPlayNext.bind(null,null,null)}>
                    <MdNavigateNext/>
                </span>


            </div>

        </div>);
    
}

export default Player;