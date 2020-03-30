import React, { useState, useContext } from 'react';
import './App.scss';

import PagesRenderer from './PagesRenderer'
import Navigation from './Navigation'
import Player from './Player'
import UserPreferences from './UserPreferences'

import HomePage from './Pages/Home/HomePage'
import Library from './Pages/Library/Library'
import Settings from './Pages/Setings/Settings'

import MainContext from "../../contexts/MainContext";
import LoginContext from "../../contexts/LoginContext";

import PlayerElement from "./PlayerElement";

import {Spring, config,animated} from 'react-spring/renderprops'
import PlaylistContext from '../../contexts/PlaylistContext';


const Menu = {

  menus: {},

  add(_id, label, component, canscroll, icon) {
    this.menus[_id] = { _id, label, component, canscroll, icon };
  }

}


Menu.add("homepage", "Home", <HomePage />, true, null);
Menu.add("library", "Library", <Library />, false, null);
Menu.add("settings", "Settings", <Settings />, false, null);

function App() {
  let [openMenu, setMenu] = useState(Object.keys(Menu.menus)[0]);
  let context = useContext(MainContext);
  let lctx = useContext(LoginContext);
  let playlistctx = useContext(PlaylistContext);

  return (
    <Spring
       

        to={
            {
                "--player-height2":playlistctx.currentlyplaying === null ?  "0px" : context.playerexpanded ? (window.innerHeight+"px") : "100px",
                "--controls-bottom":playlistctx.currentlyplaying === null ? "-50px" : "19px",
                "--label-bottom":playlistctx.currentlyplaying === null ? "-76px" : "70px",
                "--image-bottom":playlistctx.currentlyplaying === null ? ("200px") : context.playerexpanded ? "0px" : (""+window.innerHeight/2+"px"),
                "--image-opacity":playlistctx.currentlyplaying === null ? 0 : context.playerexpanded ? 1 : 0,
                "--thatmargin-top":playlistctx.currentlyplaying === null ? "20px" : context.playerexpanded ? "0px" : "20px",
                "--navigation-height":playlistctx.currentlyplaying === null ? "50px" : context.playerexpanded ? "0" : "50px",
            }
        }
    >
           {(styles) => <div className={["App",context.playerexpanded&&"playerexpanded"].join(" ")} style={styles}>
         
                <Spring
                to={{ 
                  opacity: !playlistctx.allplaylistsloaded ? 1 : 0,
                   top: !playlistctx.allplaylistsloaded ? "0px" : "-10px",
                   "pointerEvents": !playlistctx.allplaylistsloaded ? "all" : "none",
                }}>
                {props => <animated.div id="loading" style={props}> Loading playlists. </animated.div>}
              </Spring>
                <Spring
                config={config.wobbly}
                to={{ 
                  opacity: lctx.login.userPrefsVisible ? 1 : 0,
                   top: lctx.login.userPrefsVisible ? "0px" : "-20px",
                   "pointerEvents": lctx.login.userPrefsVisible ? "all" : "none",
                }}>
                {props => <UserPreferences style={props}/>}
              </Spring>
                 

                <PlayerElement />

                <PagesRenderer Menu={Menu} activeMenu={openMenu} />

                <Navigation Menu={Menu} activeMenu={openMenu} setMenu={setMenu} />

                <Player />
            </div>
}
        </Spring>
  );
}

export default App;
