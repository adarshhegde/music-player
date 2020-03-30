import React, { Component } from 'react';
import { FaSpotify, FaYoutube } from "react-icons/fa"
import { MdArtTrack } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import MyTracks from './MyTracks'
import Favourites from './Favourites'
import Albums from './Albums'
import AddNewTrack from './AddNewTrack'

import '../../../../components/Tracklist.scss';
import { Spring, config } from 'react-spring/renderprops';

const Menu = {

    menus: {},

    add(_id, label, component, icon) {
        this.menus[_id] = { _id, label, component, icon };
    },

    at(n) {
        return this.menus[Object.keys(this.menus)[n]];
    },

    get(n) {
        return this.menus[n];
    }

}


Menu.add("mytracks", "My Tracks", <MyTracks />, null);
Menu.add("favourites", "Favourites", <Favourites />, null);
Menu.add("albums", "Albums", <Albums />, null);


class Library extends Component {
    state = {
        librarynav: { left: 0 },
        libraryPageStyles: { left: 0 },
        activenav: Object.keys(Menu.menus)[0],
        addTrackDialogVisible: false,
    }

    libraryheader = React.createRef();
    librarypage = React.createRef();

    navigate = (i) => {
        let width = this.libraryheader.current.children[i].clientWidth / 1.7;
        let width_page = this.librarypage.current.children[i].getBoundingClientRect().width;
        let amt = (width * i) * i * -1;
        console.log(width_page)
        let amt_page = (width_page) * i * -1;

        this.setState({ librarynav: { left: amt + "px" }, libraryPageStyles: { left: amt_page + "px" }, activenav: Menu.at(i)._id })

    }

    componentDidMount() {
        // console.log(this.librarypage.current.children);
    }

    render() {
        return (<div className="track-list" id="library">
            <h2 className="track-list-header" ref={this.libraryheader} style={this.state.librarynav}>
                {Object.keys(Menu.menus).map((menu, idx) => {

                    return <span key={idx} onClick={this.navigate.bind(this, idx)} className={(this.state.activenav === menu ? "active" : "")}>{Menu.get(menu).label}</span>

                })}
            </h2>




            <Spring config={config.wobbly} from={
                { opacity: !this.state.addTrackDialogVisible ? 1 : 0, bottom: !this.state.addTrackDialogVisible ? -20 : 0 ,
                     transform: !this.state.addTrackDialogVisible ? "scale(1,1)" : "scale(0.8,0.8)" 
                }
           
            }
                to={
                    { opacity: !this.state.addTrackDialogVisible ? 0 : 1, bottom: 0, 
                        transform: !this.state.addTrackDialogVisible ? "scale(0.8,0.8)" : "scale(1,1)",
                        pointerEvents:!this.state.addTrackDialogVisible ? "none":"all"
                    }
                }>
                {(props) =>
                    <div style={props} id="add-new-track-dialog">
                        <AddNewTrack hide={() => this.setState({ addTrackDialogVisible: true })} />

                        <Spring from={
                { transform: !this.state.addTrackDialogVisible ? "scale(1,1)" : "scale(0,0)" }
            }
                to={
                    { transform: !this.state.addTrackDialogVisible ? "scale(0,0)" : "scale(1,1)" }
                }>
                {(props) =>
                    <div style={props} id="close-add-new-track" onClick={() => this.setState({ addTrackDialogVisible: false })}>
                        <IoMdClose />
                    </div>}
            </Spring>
                    </div>}
            </Spring>




            <Spring from={
                { transform: this.state.addTrackDialogVisible ? "scale(1.5,1.5)" : "scale(2,2)" }
            }
                to={
                    { transform: this.state.addTrackDialogVisible ? "scale(1.2,1.2)" : "scale(1,1)",
                    bottom: this.state.addTrackDialogVisible ? "3%" : "6%",
                    right: this.state.addTrackDialogVisible ? "10%" : "14%",
                }
                }>
                {(props) =>
                    <div style={props} id="open-add-new-track" onClick={() => this.setState({ addTrackDialogVisible: true })}>
                        <MdArtTrack />
                    </div>}
            </Spring>





            <div id="library-pages-container" ref={this.librarypage} style={this.state.libraryPageStyles}>
                {Object.keys(Menu.menus).map((menu, idx) => {

                    return <div
                        key={idx}

                        className={(this.state.activenav === menu ? "library-page active" : "library-page")}
                    >
                        {Menu.get(menu).component}
                    </div>

                })}
            </div>

        </div>);
    }
}

export default Library;