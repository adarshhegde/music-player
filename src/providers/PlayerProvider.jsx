import React, { useState, useEffect, useContext } from "react";
import PlayerContext from "../contexts/PlayerContext";
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import PlaylistContext from "../contexts/PlaylistContext";
import LoginContext from "../contexts/LoginContext";

let serverurl = "http://" + window.location.hostname + ":4829";
if (window.location.host.indexOf("web.app") !== -1 || window.location.host.indexOf("firebaseapp.com") !== -1)
    serverurl = ("https://notspotify-server.herokuapp.com");

function readableDuration(seconds) {
    let sec = Math.floor(seconds);
    let min = Math.floor(sec / 60);
    min = min >= 10 ? min : '0' + min;
    sec = Math.floor(sec % 60);
    sec = sec >= 10 ? sec : '0' + sec;
    return min + ':' + sec;
}

const trackCache = {
    getTrack: (id) => {
     let temp = JSON.parse(localStorage.getItem("trackcache"));
     if(temp === undefined || temp === null) return false;
     let track = temp[id] || null;
     if(track === undefined || track === null) return false;
     let date1 = new Date(temp[id].t);
     let date2 = new Date();
     let diff = Math.abs(date1 - date2) / 36e5;
     if(diff < 1) return track.url;
     else return false;
    },
  
    addTrack(id, url) {
    let currentcache = JSON.parse(localStorage.getItem("trackcache")) || {};
    currentcache[id] = {t: Date.now(), url};
    localStorage.setItem("trackcache",JSON.stringify(currentcache));
    },


  };


// const token_ = localStorage.getItem("token");
// if (token_ === "" || token_ === null || token_ === undefined) throw Error("No token_.");

const PlayerProvider = props => {
    //global state of player
    const [loading, set__loading] = useState(false);
    const [playing, set__playing] = useState(false);
    const [currentPlaylist, setcurrentPlaylist] = useState(null);

    // audio element hooks
    const [audio__element, setAudioElement] = useState(React.createRef(props.ref));
    const [audio__source, setAudioSource] = useState(null);

    // displaying metadata

    const [currentTime, setcurrentTime] = useState("");
    const [currentName, setcurrentName] = useState("");
    const [currentAuthor, setcurrentAuthor] = useState("");
    const [currentDuration, setcurrentDuration] = useState("");
    const [currentProgress, setcurrentProgress] = useState(0);
    const [currentImage, setcurrentImage] = useState("");


    let playlistctx = useContext(PlaylistContext);
    let loginctx = useContext(LoginContext);

    function updatePositionState() {
        if ("setPositionState" in navigator.mediaSession) {
            navigator.mediaSession.setPositionState({
            duration: audio__element.current.duration,
            playbackRate: audio__element.current.playbackRate,
            position: audio__element.current.currentTime
            });
        }
    }

    function reset() {
        
        set__loading(false);
        setAudioSource("");
        set__playing(false);
        audio__element.current.oncanplay = null;
        playlistctx.setcurrentlyplaying(null);

    }


    function handleMediaError(e) {
        switch (e.target.error.code) {
            case e.target.error.MEDIA_ERR_ABORTED:
                // alert('You aborted the media playback.');
                
                break;
            case e.target.error.MEDIA_ERR_NETWORK:
                // alert('A network error caused the media download to fail.');
                reset();
                break;
    
            case e.target.error.MEDIA_ERR_DECODE:
                // alert('The media playback was aborted due to a corruption problem or because the media used features your browser did not support.'); 
                reset();
                
                break;
            case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                // alert('The media could not be loaded, either because the server or network failed or because the format is not supported.'); 
                // reset();
                break;
            default:
                // alert('An unknown media error occurred.');
                // reset();
                break;
    
        }
    
    }


    useEffect(() => {
        (async () => {

            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = new window.MediaMetadata({
                  title: currentName,
                  artist: currentAuthor,
                  artwork: [
                    { src: currentImage,   sizes: '96x96',   type: 'image/png' },
                    { src: currentImage, sizes: '128x128', type: 'image/png' },
                    { src: currentImage, sizes: '192x192', type: 'image/png' },
                    { src: currentImage, sizes: '256x256', type: 'image/png' },
                    { src: currentImage, sizes: '384x384', type: 'image/png' },
                    { src: currentImage, sizes: '512x512', type: 'image/png' },
                  ]
                });

              


                updatePositionState();
              
                navigator.mediaSession.setActionHandler('play', () => { 
                    if (audio__source === null || audio__element.current === null) { return; }
                    if (!playing) {
                        audio__element.current.play();
                        set__playing(true);
                    }
                 });
                navigator.mediaSession.setActionHandler('pause', () => {
                if (audio__source === null || audio__element.current === null) { return; }
                if (playing) {
                    audio__element.current.pause();
                    set__playing(false);
                }
             });
                navigator.mediaSession.setActionHandler('seekbackward', () => { 
                    audio__element.current.currentTime -= 10;
                    updatePositionState();
                 });

                navigator.mediaSession.setActionHandler('seekforward', () => {
                     audio__element.current.currentTime += 10; 
                     updatePositionState();
                });
                navigator.mediaSession.setActionHandler('previoustrack', () => { tryPlayPrev(); });
                navigator.mediaSession.setActionHandler('nexttrack', () => { tryPlayNext(); });
              }

        })()
    }, [playing])

    const initiatePlay = (track,playlist) => {
        audio__element.current.pause();
        audio__element.current.currentTime = 0;
        audio__element.current.play();
        audio__element.current.oncanplay = null;
        audio__element.current.onerror = null;
       
        playlistctx.setcurrentlyplaying(track);

        setcurrentPlaylist(playlist);
        setcurrentName(track.name);
        setcurrentAuthor(track.author);
        setcurrentTime("00:00");
        setcurrentImage(track.image);
        setcurrentDuration(readableDuration(audio__element.current.duration));
        audio__element.current.ontimeupdate = () => {
            setcurrentTime(readableDuration(audio__element.current.currentTime));
            setcurrentProgress(audio__element.current.currentTime / audio__element.current.duration * 100);
            updatePositionState();
        }
        audio__element.current.onended = () => tryPlayNext(track.track_id,playlist);
        set__loading(false);
        audio__element.current.onabort = null;
        set__playing(true);
    }

    const playToggle = () => {
        if (audio__source === null || audio__element.current === null) { return; }
        if (playing) {
            audio__element.current.pause();
            set__playing(false);
        } else {
            audio__element.current.play();
            set__playing(true);
        }
    }

    const tryPlay = async ({ source, track_id }, playlist, track) => {
        if (loading !== false) return;
        try {
            let incache = trackCache.getTrack(track_id);
            if(incache === false  && loginctx.login.offline === true) return false; 

            set__loading(track_id);
            setAudioSource("");
            set__playing(false);
            audio__element.current.oncanplay = null;
            let temp = {};
            if (playlist === "newlyreleased") {
                temp = { track };
                // alert("sending honey singh");
            }



            if(incache === false) {
            const res = await axios.post(serverurl + source,
                { userId: loginctx.login.userdata.userId, track_id, playlist, ...temp });
            let url = res.data;
   
            setAudioSource(url);
            console.log("will cache " + track_id);
            trackCache.addTrack(track_id, url);
            } else {
                console.log("localstorage " + track_id);
                setAudioSource(incache);
                initiatePlay(track, playlist);
            }

            audio__element.current.onerror = handleMediaError;
                
            audio__element.current.oncanplay = initiatePlay.bind(null, track, playlist);
           
            audio__element.current.onabort = (e) => {       
             }


   
        } catch (err) {
   
        }
    }


    const tryPlayNext = async (forceplayid, forceplaylist) => {
        
        if(playlistctx.currentlyplaying === null || currentPlaylist === null && !forceplayid) return false;
        let current_id = playlistctx.currentlyplaying.track_id;
        let current_playlist = currentPlaylist + "";
        if(forceplayid)
            current_id = forceplayid;
        if(forceplaylist)
            current_playlist = forceplaylist;
        console.log(current_id, current_playlist);
        if(current_playlist === "newlyreleased") {      
            let currentplaylisttracks = playlistctx[current_playlist];
            let tracks_ids = Object.keys(currentplaylisttracks);
            let current_track_pos = tracks_ids.indexOf(current_id)
            if((current_track_pos + 1) > tracks_ids.length - 1) return;
            let prev_track = currentplaylisttracks[tracks_ids[current_track_pos + 1]];
            tryPlay({source: prev_track.source,
                track_id: prev_track.track_id},
                "newlyreleased",
                prev_track
                );
        } else {
            let currentplaylisttracks = playlistctx[current_playlist];
            let tracks_ids = Object.keys(currentplaylisttracks).map(i => currentplaylisttracks[i].track_id);
            let current_track_pos = tracks_ids.indexOf(current_id);
            if(current_track_pos + 1 > tracks_ids.length - 1) return;
            let prev_track = currentplaylisttracks[current_track_pos + 1];
            tryPlay({source: prev_track.source,
                track_id: prev_track.track_id},
                current_playlist,
                prev_track
            );
        }
    }

    const tryPlayPrev = async () => {
        console.log(JSON.stringify(playlistctx.currentlyplaying));
        if(playlistctx.currentlyplaying === null || currentPlaylist === null) return false;
        let current_id = playlistctx.currentlyplaying.track_id;
        if(currentPlaylist === "newlyreleased") {      
            let current_id = playlistctx.currentlyplaying.track_id;
            let currentplaylisttracks = playlistctx[currentPlaylist];
            let tracks_ids = Object.keys(currentplaylisttracks);
            let current_track_pos = tracks_ids.indexOf(current_id)
            if((current_track_pos - 1) < 0) return;
            let prev_track = currentplaylisttracks[tracks_ids[current_track_pos - 1]];
            tryPlay({source: prev_track.source,
                track_id: prev_track.track_id},
                "newlyreleased",
                prev_track
                );
        } else {
            let current_id = playlistctx.currentlyplaying.track_id;
            let currentplaylisttracks = playlistctx[currentPlaylist];
            let tracks_ids = Object.keys(currentplaylisttracks).map(i => currentplaylisttracks[i].track_id);
            let current_track_pos = tracks_ids.indexOf(current_id);
            if(current_track_pos - 1 < 0) return;
            let prev_track = currentplaylisttracks[current_track_pos - 1];
            tryPlay({source: prev_track.source,
                track_id: prev_track.track_id},
                currentPlaylist,
                prev_track
            );
        }
    }


    let store = {
        metadata: {
            currentTime,
            currentName,
            currentAuthor,
            currentDuration,
            currentProgress,
            currentImage
        },
        loading,
        playing,
        tryPlay,
        tryPlayNext,
        tryPlayPrev,
        playToggle,
        audio__source,
        setAudioElement
    }


    return (
        <PlayerContext.Provider value={store}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerProvider;