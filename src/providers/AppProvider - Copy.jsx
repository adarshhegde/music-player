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
    const [isworking, setIsWorking] = useState(false);
    
    const [player__source, setplayer__source] = useState(null);
    const [player__playing, setplayer__playing] = useState(false);

    const [player__currentTime, setplayer__currentTime] = useState("");
    const [player__currentDuration, setplayer__currentDuration] = useState("");
    const [player__currentName, setplayer__currentName] = useState("");
    const [player__currentAuthor, setplayer__currentAuthor] = useState("");
    const [player__currentImage, setplayer__currentImage] = useState("");
    const [player__currentId, setplayer__currentId] = useState(null);

    const [audio__element, setAudioElement] = useState(React.createRef());


    const setState = function(obj,cb=()=>{}){
        for(let prop in obj) {
            switch(prop) {

                case "player__source" : setplayer__source(obj[prop]); break;
                case "player__playing" : setplayer__playing(obj[prop]); break;
                case "player__currentName": setplayer__currentName(obj[prop]); break;
                case "player__currentAuthor": setplayer__currentAuthor(obj[prop]); break;
                case "player__currentImage": setplayer__currentImage(obj[prop]); break;
                case "player__currentTime": setplayer__currentTime(obj[prop]); break;
                case "player__currentDuration": setplayer__currentDuration(obj[prop]); break;
                case "player__currentId": setplayer__currentId(obj[prop]); break;
                default: return;
            }
        }
        cb();
    }

    const tryPlay = async ({name, author, image, track_id}) => {
     try {  
         if(player__playing) {
            audio__element.current.pause();
         }
       audio__element.current.currentTime = 0;
       audio__element.current.play();
       setState({player__playing: true})

       setState(
        { player__currentName: name,
             player__currentAuthor: author, 
            player__currentImage: image, 
            player__currentDuration:readableDuration(audio__element.current.duration), 
            player__currentTime:"00:00",
        player__currentId: track_id }
        );
        audio__element.current.oncanplay = null;
    //    setState();
       return true;
     } catch(err) {
        throw new Error(err);
     }
    }


    const tryQueue = async (src, track) => {
        // alert(track.name);
        if(isworking){
            console.log("wait, song already queued.");
             return false;
            }

        if(player__playing) {
            setState({ player__source: null, player__playing: false, player__currentDuration:"00:00", player__currentAuthor:"", player__currentId:null, player__currentImage:"", player__currentTime:"00:00" });
            audio__element.current.pause();
            
        }
        try {
            setIsWorking(true);
            // setplayer__tryplay(false);
            let res = await axios.get(`http://${window.location.hostname}:4829${src}`);
            setState({ player__source: res.data }, );
            audio__element.current.oncanplay = tryPlay.bind(this, track);
      
            audio__element.current.ontimeupdate  = () => {
        
                if(Math.round(audio__element.current.currentTime) % 1 == 0)
                 setState({player__currentTime: readableDuration(audio__element.current.currentTime)});

                }
                
            setIsWorking(false);
            return true;
        }
        
        catch(err){
            
        }

    }

    const playToggle = () => {
        if(player__source === null || audio__element.current === null) { return; }
        if(player__playing) {
            audio__element.current.pause();
            setState({player__playing: false});
        } else {
            audio__element.current.play();
            setState({player__playing: true});
        }
    }

    const store = {
        player: {
            setAudioElement,
            player__source,
            player__playing,
            audio__element,
            current: {
                player__currentName,
                player__currentAuthor,
                player__currentImage,
                player__currentTime,
                player__currentDuration,
                player__currentId
            },
            tryQueue,
            tryPlay,
            playToggle,
            setState
        }
    }

    return (
    <MainContext.Provider name="ee" value={store}>
        {props.children}
    </MainContext.Provider>
    )
}

export default AppProvider;