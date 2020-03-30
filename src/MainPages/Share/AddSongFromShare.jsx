import React, { useEffect, useState, useContext } from 'react'
import './AddSong.scss';
import axios from 'axios';

import LoginContext from "../../contexts/LoginContext";
import { Redirect } from 'react-router';
function AddSongFromShare(props) {

    let [data, setdata] = useState({});
    let [loading, setloading] = useState(true);
    let [editing, setediting] = useState(false);
    let [saving, setsaving] = useState(false);
    let [redirect, setredirect] = useState(false);
    let serverurl = "http://" + window.location.hostname + ":4829";
    let loginctx = useContext(LoginContext);

    if (window.location.host.indexOf("web.app") !== -1 || window.location.host.indexOf("firebaseapp.com") !== -1)
        serverurl = ("https://notspotify-server.herokuapp.com");

    useEffect(() => {
        (async () => {
            try {
                const parsedUrl = new URL(window.location);

                const title = parsedUrl.searchParams.get('title')
                let text = parsedUrl.searchParams.get('text')
                const url = parsedUrl.searchParams.get('url')

                let res = await axios.get(serverurl + "/yt/info" + (new URL(text).pathname));

                // alert(title + " " + text + " " + url);s
                setloading(false);
                setdata(res.data);

            } catch (err) {
                alert(err);
            }
        })();
    }, []);

    const trySave = async () => {
        try {

            setsaving(true);
            const token_ = localStorage.getItem("token");


            if (token_ === "" || token_ === null || token_ === undefined) throw Error("No token_.");

            const parsedUrl = new URL(window.location);

            const title = parsedUrl.searchParams.get('title')
            let text = parsedUrl.searchParams.get('text')
            const url = parsedUrl.searchParams.get('url')
            if(loginctx.login.status !== true) {alert("login first"); throw Error("not logged in"); }
            let res = await axios.post(serverurl + "/library/addtrack", {
                data: {
                    name: data.name,
                    author: data.author,
                    image: data.thumbnail,
                    source: "/yt" + (new URL(text).pathname),
                    track_id: (new URL(text).pathname).slice(1)
                }
            }, {
                headers: {
                    'Authorization': `Basic ${token_}`
                }
            });

            if (res.data === true) {
                alert("added");
                // setsaving(false);
                // <Redirect to='/login' />
                setredirect(true);
            } else {
                alert("error");
                setsaving(false);
            }
        }
        catch (err) {
            alert("fuck");
            setsaving(false);

        }
    }

    return <div id="receive-shared-yt">
        {redirect && <Redirect to='/' />}
        {loading ? "getting track info." : <React.Fragment>

            <p id="image"><img src={data.thumbnail} alt="img" /></p>
            <p id="title">{editing ? <input onChange={(e) => setdata({ ...data, name: e.target.value })} type="text" value={data.name} /> : data.name}</p>
            <p id="author">{editing ? <input onChange={(e) => setdata({ ...data, author: e.target.value })} type="text" value={data.author} /> : data.author}</p>

            <p>
                <button disabled={saving ? true : false} onClick={() => setediting(!editing)}>{editing ? "save changes" : "edit details"}</button>
                <button disabled={editing || saving ? true : false} onClick={trySave}>Add to My Tracks</button>
            </p>

        </React.Fragment>}

    </div>
}

export default AddSongFromShare;