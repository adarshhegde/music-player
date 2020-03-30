import React, { Component, PureComponent, useContext, useState, useEffect } from 'react';
// import { FaSpotify, FaYoutube } from "react-icons/fa"
import axios from 'axios'
import {Spring, animated} from 'react-spring/renderprops'
import '../../../../components/Tracklist.scss';

import MainContext from "../../../../contexts/MainContext";
import PlaylistContext from "../../../../contexts/PlaylistContext";
import { FaRegSmileBeam } from 'react-icons/fa';
import PlayerContext from '../../../../contexts/PlayerContext';
import LoginContext from '../../../../contexts/LoginContext';
import {AiOutlineLoading} from 'react-icons/ai';
  
function FrequentlyPlayed(props) {
    // let context = useContext(MainContext);
    let playlistctx = useContext(PlaylistContext);
    let playerctx = useContext(PlayerContext);
    let loginctx = useContext(LoginContext);

    // let [currentloading, setcurrentloading] = setState(null);
    
        return (<div className="track-list" id="frequently-played" style={{
            "margin-top": loginctx.login.offline?"10px" :"auto"
        }}>
            <h2 className="track-list-header">{loginctx.login.offline ? "Available songs"  :   playlistctx.allplaylistsloaded && Object.keys(playlistctx.frequentlyplayed).length > 0 ? "Frequently Played" : "" }</h2>
            <div className="track-list-container">

        { loginctx.login.offline ? <React.Fragment>


            {playlistctx.allplaylistsloaded && Object.keys(playlistctx.mytracks).length > 0 && Object.keys(playlistctx.mytracks).filter(track => {
                return  playlistctx.trackCache.getTrack(playlistctx.mytracks[track].track_id) === false ? false : true;
            }).map((track, idx) => {
                 let available = true;
                 return <p
                 className={["track",
                  (playlistctx.currentlyplaying !== null && playlistctx.currentlyplaying.track_id == playlistctx.mytracks[track].track_id ? "playing" : ""),
                 (loginctx.login.offline ? available === false ? "disabled" : "" : "")
                 ].join(" ")}
                 key={idx}

                 onClick={() => playerctx.tryPlay({track_id: playlistctx.mytracks[track].track_id,source: playlistctx.mytracks[track].source},"mytracks",playlistctx.mytracks[track])}
                 >
                 <span className="track-name">{playlistctx.mytracks[track].name}</span>
                 <span className="track-author">{playlistctx.mytracks[track].author}</span>
                 <span className="track-image"><img alt={playlistctx.mytracks[track].name} src={playlistctx.mytracks[track].image} /></span>
                {playerctx.loading === playlistctx.mytracks[track].track_id && <span className="track-spinner"><AiOutlineLoading /></span>}
             </p>
            
      
     })}

        </React.Fragment> : <React.Fragment>


        {playlistctx.allplaylistsloaded && Object.keys(playlistctx.frequentlyplayed).length > 0 && Object.keys(playlistctx.frequentlyplayed).map((track, idx) => {
                 
                 return <p
                 className={["track",
                  (playlistctx.currentlyplaying !== null && playlistctx.currentlyplaying.track_id == playlistctx.frequentlyplayed[track].track_id ? "playing" : ""),
                 (loginctx.login.offline ? playlistctx.trackCache.getTrack(playlistctx.frequentlyplayed[track].track_id) === false ? "disabled" : "" : "")
                 ].join(" ")}
                 key={idx}

                 onClick={() => playerctx.tryPlay({track_id: playlistctx.frequentlyplayed[track].track_id,source: playlistctx.frequentlyplayed[track].source},"frequentlyplayed",playlistctx.frequentlyplayed[track])}
                 >
                 <span className="track-name">{playlistctx.frequentlyplayed[track].name}</span>
                 <span className="track-author">{playlistctx.frequentlyplayed[track].author}</span>
                 <span className="track-image"><img alt={playlistctx.frequentlyplayed[track].name} src={playlistctx.frequentlyplayed[track].image} /></span>
                {playerctx.loading === playlistctx.frequentlyplayed[track].track_id && <span className="track-spinner"><AiOutlineLoading /></span>}
             </p>
            
      
     })}

     {playlistctx.allplaylistsloaded && Object.keys(playlistctx.frequentlyplayed).length == 0 && 
     <Spring from={{ position:"relative", opacity:0, top:20 }} to={{opacity:1, top:30, position:"relative"}}>
         { (styles) => <p style={{textAlign:"center",...styles}} class="empty-notice">Your frequently played tracks will be here.<br/><FaRegSmileBeam style={{fontSize:"20px", color:"#aeaeae",margin:"20px 0"}}/><br/>Add app to homescreen. 👇</p> }
     </Spring>
     } 

        </React.Fragment> }

            </div>
        </div>);
    
}

export default FrequentlyPlayed;