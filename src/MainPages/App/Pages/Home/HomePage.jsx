import React, {  useContext, useState, useEffect } from 'react';
import { FaYoutube, FaRegUser } from "react-icons/fa"
import FrequentlyPlayed from './FrequentlyPlayed';
import axios from 'axios';
import MainContext from "../../../../contexts/MainContext";
import LoginContext from "../../../../contexts/LoginContext";
import { Link } from 'react-router-dom';
import PlaylistProvider from '../../../../providers/PlaylistProvider';
import PlaylistContext from "../../../../contexts/PlaylistContext";
import PlayerContext from '../../../../contexts/PlayerContext';
import { AiOutlineDisconnect } from 'react-icons/ai';

function checkScrollBar(element, dir) {
    dir = (dir === 'vertical') ?
        'scrollTop' : 'scrollLeft';

    var res = !!element[dir];

    if (!res) {
        element[dir] = 1;
        res = !!element[dir];
        element[dir] = 0;
    }
    return res;
}

        
function HomePage(props) {

    let loginctx = useContext(LoginContext)
    let playlistctx = useContext(PlaylistContext)
    let playerctx = useContext(PlayerContext)

    // let [hostname, sethostname] = useState("");

    // const getTracks = async () => {
        
    //     let serverurl = "http://" + window.location.hostname + ":4829";
    //     if(window.location.host.indexOf("web.app") !== -1 || window.location.host.indexOf("firebaseapp.com") !== -1) 
    //     serverurl = ("https://notspotify-server.herokuapp.com");

    //     const res = await axios.get(`${serverurl}/global/newreleases`);
    //     // const res2 = await axios.get(`http://${document.location.hostname}:4829/host`);
    //     // sethostname(res2.data);
    //     return (res.data);
    // }

    // useEffect(() => {

    //     (async () => {   try {
    //           settracklist(await getTracks())
    //       } catch (e) {
    //           //...handle the error...
    //           console.log(e)
    //       }})()
  
    //   },[]);


    let recentlyAdded = React.createRef();
    let mostPlayed = React.createRef();

    const doScroll = (refc, e) => {
        let element = refc.current;
        let amount = e.deltaY > 0 ? 10 : -10;

        let i = 0;

        while (i < 10) {
            setTimeout(() => {
                element.scrollTo(element.scrollLeft + amount, 0);
            }, 10 * i);

            i++;
        }

        e.stopPropagation();
    }

    const mouseOver = (ref) => checkScrollBar(ref.current, "horizontal") && props.setScroll(false)
    const mouseLeave = (ref) => checkScrollBar(ref.current, "horizontal") && props.setScroll(true)

    return (
        <div id="homepage">
            
            <div id="profile" onClick={() => loginctx.login.setUserPrefsVisible(!loginctx.login.userPrefsVisible)}><FaRegUser /></div>

            <div id="recently-added">
                <h2 id="recently-added-header">
                    {loginctx.login.offline ? <span>You're Offline <AiOutlineDisconnect style={{
                            "vertical-align":" middle",
                            "font-size":" 17px",
                            "margin-left":" 5px",
                            "opacity":" .4",
                            "color":" red",
                    }}/></span> : "New Releases"}
                </h2>

                <div id="recently-added-list"
                    onMouseEnter={mouseOver.bind(this, recentlyAdded)}
                    onMouseLeave={mouseLeave.bind(this, recentlyAdded)}
                    onWheel={doScroll.bind(this, recentlyAdded)}
                    ref={recentlyAdded}
                    style={{
                        display: loginctx.login.offline ? "none" : " block"
                    }}
                >

                

                    {!loginctx.login.offline && playlistctx.allplaylistsloaded && Object.keys(playlistctx.newlyreleased).length > 0 && Object.keys(playlistctx.newlyreleased).map((track, idx) =>
                        <div 
                            
                        key={idx}
                      onClick={() => playerctx.tryPlay({track_id: playlistctx.newlyreleased[track].track_id,source: playlistctx.newlyreleased[track].source},"newlyreleased", playlistctx.newlyreleased[track])}
                            className={["song-card",
                            (loginctx.login.offline ? playlistctx.trackCache.getTrack(playlistctx.newlyreleased[track].track_id) === false ? "disabled" : "" : "")
                            ].join(" ")}>
                            <span className="song-provider"><FaYoutube /></span>
                            <span className="song-name">{playlistctx.newlyreleased[track].name}</span>
                            <span className="song-author">{playlistctx.newlyreleased[track].author}</span>
                            <span className="song-image"><img alt={playlistctx.newlyreleased[track].name} onLoad={(e) => {
                                setTimeout(function(target){
                                  target.closest(".song-card").setAttribute("loaded","")
                                },0, e.target)
                            } } src={playlistctx.newlyreleased[track].image} /></span>
                        </div>)}




                </div>

            </div>

            {/* <div id="most-played">
                    <span id="most-played-header">
                        Most Played
                </span>

                    <div id="most-played-list"  
                    onMouseEnter={this.mouseOver.bind(this, this.mostPlayed)}
                    onMouseLeave={this.mouseLeave.bind(this, this.mostPlayed)}
                    onWheel={this.doScroll.bind(this, this.mostPlayed)}
                    ref={this.mostPlayed}>

                        <div className="song-card">
                            <span className="song-provider"><FaSpotify /></span>
                            <span className="song-name">Sun Le Re</span>
                            <span className="song-author">Papon</span>
                            <span className="song-image"><img alt="a" src="https://i.ytimg.com/vi/CWgpfxiuY8E/maxresdefault.jpg" /></span>
                        </div>

                        <div className="song-card">
                            <span className="song-provider"><FaYoutube /></span>

                            <span className="song-name">Mehrama (From "Love Aaj Kal")</span>
                            <span className="song-author">Pritam, Darshan Raval, Anatara Mitra</span>
                            <span className="song-image"><img alt="a" src="https://cdn.wionews.com/sites/default/files/styles/story_page/public/2020/02/07/127842-untitled-design-71.jpg" /></span>
                        </div>

                        <div className="song-card">
                            <span className="song-provider"><FaSpotify /></span>

                            <span className="song-name">Don't Let Me Down</span>
                            <span className="song-author">The Chainsmokers</span>
                            <span className="song-image"><img alt="a" src="https://i1.sndcdn.com/artworks-000547109487-hmebjp-t500x500.jpg" /></span>
                        </div>

                        <div className="song-card">
                            <span className="song-name">Sun Le Re</span>
                            <span className="song-author">Papon</span>
                            <span className="song-image"></span>
                        </div>


                    </div>

                </div>

      */}
      
            <FrequentlyPlayed />
        </div>
     );
}

export default HomePage;