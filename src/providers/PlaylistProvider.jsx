import React, { useState, useEffect, useContext } from "react";
import PlaylistContext from "../contexts/PlaylistContext";
import LoginContext from "../contexts/LoginContext";
import axios from 'axios';
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
const loadOnce = async () => {
    return new Promise(async (resolve, reject) => {
        try {



            let result = {};
            const token = localStorage.getItem("token");
            let serverurl = "http://" + window.location.hostname + ":4829";
            if (window.location.host.indexOf("web.app") !== -1 || window.location.host.indexOf("firebaseapp.com") !== -1)
                serverurl = ("https://notspotify-server.herokuapp.com");
    
            if(token === "" || token === null || token === undefined) {  throw Error("No token."); }
    
    
            // newlyreleased
    
                const newlyreleased_req = await axios.get(`${serverurl}/global/newreleases`);
                console.log("newlyreleased", newlyreleased_req);
    
    
                const mytracks_req = await axios.post(`${serverurl}/library/mytracks`,
                {},
                {
                    headers: {
                        'Authorization': `Basic ${token}`
                    }
                });

                console.log("mytracks", mytracks_req);
    
                const frequentlyplayed_req = await axios.post(`${serverurl}/library/frequentlyplayed`,
                {},
                {
                    headers: {
                        'Authorization': `Basic ${token}`
                    }
                });
                console.log("frequentlyplayed", frequentlyplayed_req);
                
                if(newlyreleased_req.status === 200 && mytracks_req.status === 200 && frequentlyplayed_req.status === 200)
                {
                    const allplaylists = {
                        newlyreleased: newlyreleased_req.data,
                        mytracks: mytracks_req.data,
                        frequentlyplayed: frequentlyplayed_req.data,
                        mytracks_pages: 1,
                    };
                    localStorage.setItem("offline_playlists",JSON.stringify(allplaylists));
                    resolve(allplaylists);
                } else {
                    reject("Something went wrong!");
                }
                
    
    
        }
        catch(err) {
            throw err;
        }
    })
}

function useAsyncState(initialValue) {
    const [value, setValue] = useState(initialValue);
    const setter = x =>
      new Promise(resolve => {
        setValue(x);
        resolve(x);
      });
    return [value, setter];
  }

const TracklistProvider = props => {
    const [allplaylistsloaded, setallplaylistsloaded] = useState(false);
    const [playlists, setplaylists] = useState({});
    const [currentlyplaying, setcurrentlyplaying] = useAsyncState(null);

    const loginctx = useContext(LoginContext);

    useEffect(() => {
        (async () => {
            try {
            
                if(!loginctx.login.offline) {
            
            const { mytracks, frequentlyplayed, newlyreleased, mytracks_pages } = await loadOnce();
            setplaylists({
                mytracks, 
                frequentlyplayed,
                 newlyreleased,
                mytracks_pages,
            });
            setallplaylistsloaded(true);
        } else {
            let tempofflineplaylist = JSON.parse(localStorage.getItem("offline_playlists"));
          
            if(tempofflineplaylist === null || tempofflineplaylist === undefined) {
                return;
            } else {
                setplaylists(tempofflineplaylist);
                setallplaylistsloaded(true);
            }
        }
        } catch(err) {
            throw Error("something went wrong!");
        }
        })()
    }, [])
    let store = {
        trackCache,
        currentlyplaying,
        setcurrentlyplaying,
        ...playlists,
        allplaylistsloaded
    };


    return (
        <PlaylistContext.Provider value={store}>
            {props.children}
        </PlaylistContext.Provider>
    )
}

export default TracklistProvider;