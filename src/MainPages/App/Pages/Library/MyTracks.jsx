import React, { Component, useContext } from 'react';
import MainContext from "../../../../contexts/MainContext";
import PlaylistContext from "../../../../contexts/PlaylistContext";
import PlaylistProvider from "../../../../providers/PlaylistProvider";
import axios from 'axios';
import {Spring, animated} from 'react-spring/renderprops'
import PlayerContext from '../../../../contexts/PlayerContext';
import LoginContext from '../../../../contexts/LoginContext';
import { AiOutlineLoading } from 'react-icons/ai';
import { FaRegSmileBeam } from 'react-icons/fa';

function MyTracks(props) {
    let playlistctx = useContext(PlaylistContext);
    let playerctx = useContext(PlayerContext);
    let loginctx = useContext(LoginContext);

    // async getTracks() {
    //     let serverurl = "http://" + window.location.hostname + ":4829";
    //     if(window.location.host.indexOf("web.app") !== -1 || window.location.host.indexOf("firebaseapp.com") !== -1) 
    //     serverurl = ("https://notspotify-server.herokuapp.com");
    //     let token = localStorage.getItem("token")
    //     if(token === "" || token === null || token === undefined) throw Error("No token.");
    //     const res = await axios.post(`${serverurl}/library/mytracks`,{},
    //     {headers: {
    //         'Authorization': `Basic ${token}`
    //       }});
    //       console.log(res.data);
    //     return (res.data);
    // }

    // async componentDidMount() {

    //     try {
    //         this.setState({ tracklist: await this.getTracks() });
    //     } catch (e) {
    //         //...handle the error...
    //         console.log(e)
    //     }

    // }

    return (<div className="track-list-container">

        {playlistctx.allplaylistsloaded && playlistctx.mytracks.map((track, idx) => {
            //   this.context.player.tryQueue.bind(this,
            // this.state.tracklist[track].source, this.state.tracklist[track]
            // )

            return (


                <Spring
                    from={{ opacity: 0 }}
                    to={{ opacity: 1 }}
                >
                    {(styles) => {
                        return <p
                            className={["track", (playlistctx.currentlyplaying !== null && playlistctx.currentlyplaying.track_id === track.track_id ? "playing" : ""),
                            (loginctx.login.offline ? playlistctx.trackCache.getTrack(track.track_id) === false ? "disabled" : "" : "")
                            
                        ].join(" ")}
                            key={idx} style={{...styles}}
                            onClick={() => playerctx.tryPlay({track_id: track.track_id,source: track.source},"mytracks",track)}>
                            <span className="track-name">{track.name}</span>
                            <span className="track-author">{track.author}</span>
                            <span className="track-image"><img alt={track.name} src={track.image} /></span>
                            {playerctx.loading === track.track_id && <span className="track-spinner"><AiOutlineLoading /></span>}
                        </p>
                    }}
                </Spring>
            )
        })}

{playlistctx.allplaylistsloaded && playlistctx.mytracks.length == 0 && 
                <Spring from={{ position:"relative", opacity:0, top:20 }} to={{opacity:0.6, top:30, position:"relative"}}>
                    { (styles) => <p style={{textAlign:"center",...styles}} class="empty-notice">
                        Oops! Play a track or import them to see them here.<br/>
                        <br/><br/>
                        You can add songs by opening youtube,<br/>
                         and sharing any video to this app.<br/>
                    <FaRegSmileBeam style={{fontSize:"20px", color:"#aeaeae",margin:"20px 0"}}/>
                    or click here
                    </p> }
                </Spring>
                } 

    </div>);

}
export default MyTracks;