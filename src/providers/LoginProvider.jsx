import React, { useState, useEffect } from "react";
import LoginContext from "../contexts/LoginContext";
import axios from 'axios';
import jwtDecode from 'jwt-decode';
let serverurl = "http://" + window.location.hostname + ":4829";

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhZGFyc2hAMTIzIiwiaWF0IjoxNTg0OTkwNDMyLCJleHAiOjE1ODUwNzY4MzJ9.-2I9_JVRFLLy6GAT5KTinkdpIm9NPYRUoNMwqr6mz70
const token_ = localStorage.getItem("token");

const LoginProvider = props => {
    const [status, setLoginStatus] = useState(null);
    const [offline, setOffline] = useState(null);
    const [userdata, setuserdata] = useState(null);
    const [userPrefsVisible, setUserPrefsVisible] = useState(false);

    useEffect(() => {
        (async () => {
            try {


                if (window.location.host.indexOf("web.app") !== -1 || window.location.host.indexOf("firebaseapp.com") !== -1)
                    serverurl = ("https://notspotify-server.herokuapp.com");


                if (token_ === "" || token_ === null || token_ === undefined) {
                    setLoginStatus(false);
                    setOffline(false);
                    return;
                };


                let res = await axios.post(serverurl + "/login/check", {}, {
                    headers: {
                        'Authorization': `Basic ${token_}`
                    }
                });

                console.log(res.status == 200);
                if (res.status === 200) {
                
                    const { userId } = jwtDecode(token_);
                    setuserdata({ userId });
                    setLoginStatus(true);
                    setOffline(false);
                    return false;
                }
            } catch (error) {
                if (!error.response) {
                    setOffline(true);
                    const { userId } = jwtDecode(token_);
                    setuserdata({ userId });
                    setLoginStatus(true);

                  } else {
                    // http status code
                    const code = error.response.status
                    // response data
                    const response = error.response.data

                    console.log(code, response);
                    setLoginStatus(false);
                  }
                // setLoginStatus(false);
            }
        })()
    }, [])

    const tryLogin = async (username, password) => {
        console.log(serverurl);
        try {
            let { data } = await axios.post(serverurl + "/login/try", {
                username,
                password
            });

            if ("error" in data) {
                return false;
            } else {
                console.log("hii", data)
                const { userId } = jwtDecode(data.token);
                localStorage.setItem("token", data.token);
                setuserdata({ userId });
                setLoginStatus(true);
                setOffline(false);
                return true;
            }
        } catch (err) {
            // alert(err.stack);
        }
    }
 
    const tryRegister = async (username, password) => {
        console.log(serverurl);
        try {
            let { data } = await axios.post(serverurl + "/login/register", {
                username,
                password
            });

            if ("error" in data) {
                return {error: data.error};
            } else {
                const { userId } = jwtDecode(data.token);
                localStorage.setItem("token", data.token);
                setuserdata({ userId });
                
                return true;
            }
        } catch (err) {
            return {error: "Error signing up."};
            alert(err.stack);
        }
    }

    const reset = () => {
        setuserdata(null);
        setLoginStatus(false);
        setUserPrefsVisible(false);
        localStorage.setItem("token", null);

    }


    let store = {
        serverurl,
        login: {
            status,
            offline,
            userdata,
            userPrefsVisible,

            setLoginStatus,
            setUserPrefsVisible,
            reset,
            tryLogin,
            tryRegister
        }
    };

    return (
        <LoginContext.Provider value={store}>
            {props.children}
        </LoginContext.Provider>
    )
}

export default LoginProvider;