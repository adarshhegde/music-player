import React, { useState, useContext, useRef } from 'react';
import "./Login.scss";

import LoginContext from '../../contexts/LoginContext'
import { Spring, config } from 'react-spring/renderprops'

function Login(params) {
    let context = useContext(LoginContext);
    let [RegUser, setRegUser] = useState(false);
    let [loading, setLoading] = useState(false);
    let [ticker, setTicker] = useState(false);

    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [errors, setErrors] = useState(false);


 
    let [regusername, setregUsername] = useState("");
    let [regpassword1, setregPassword1] = useState("");
    let [regpassword2, setregPassword2] = useState("");


    const handleRegisterSubmit = async event => {
        try {
            event.preventDefault()
            setErrors(false);
            if(regpassword1 !== regpassword2) {
                return setErrors("Passwords do not match.");
            } else {
        
                setLoading(true);
                let status = await context.login.tryRegister(regusername, regpassword2);
                // alert(status);
                if(status === true) {
                    setErrors(false);
                    setTicker("successfully registered!");
                    setTimeout( () => context.login.setLoginStatus(true), 1200);
                } else {
                  
                        setLoading(false);
                        setErrors(status.error);
                  
                }
        }

        } catch (err) { setErrors("Error signing up"); setLoading(false) }
    }



    const handleSubmit = async event => {
        try {
            event.preventDefault()
            // alert()
            setErrors(false);
            setLoading(true);
            if (username.length == 0 || password.length == 0) return event.target.checkValidity();

            let status = await context.login.tryLogin(username, password);
            // alert(status);
            if (status == false) {
                setLoading(false);
                setErrors("Error logging in.");
            }

        } catch (err) {
            document.write(err.stack);
        }
    }

    return <div id="login" class={errors ? "errors" : ""}>

        <div id="login-container">
            {
                <Spring
                    to={ {opacity: ticker ? 1 : 0, padding:ticker? "40px 0px" : "0px 0px"} }
                >
                    {(styles) => {
                return <span class="ticker" style={styles}>{ticker}</span>}
                }</Spring>
            }
            {RegUser ? <React.Fragment>

                <form onSubmit={handleRegisterSubmit}>

                    <Spring
                        config={config.default}
                        to={{
                            transform: loading ? "scale(0.95)" : "scale(1)",
                        }}>
                        {props => <p style={{ position: "relative", ...props }}><span>Register</span></p>}

                    </Spring>


                    <p><input type="text" disabled={loading && "true"} id="register_username" placeholder="Username" required value={regusername}
                        onKeyDown={e=> { if(e.key ===" "){e.stopPropagation(); e.preventDefault(); } } }
                       onChange={e => { setregUsername(e.target.value.trim())}}
                    /></p>

                    <p><input type="password" disabled={loading && "true"} id="register_password1" placeholder="Password" required value={regpassword1}
                        onChange={e => setregPassword1(e.target.value)}
                    /></p>
              
                    <p><input type="password" disabled={loading && "true"} id="register_password2" placeholder="Repeat Password" required value={regpassword2}
                        onChange={e => setregPassword2(e.target.value)}
                    /></p>
 <p id="buttons-group">
     <button disabled={loading && "true"}  id="register-button" >Register</button>
 </p>  

 <p style={{fontSize:"15px",color:"rgba(220, 220, 220, 0.43)"}}>Already have an acount?<br/><a href="#" style={{fontSize:"13px",color:"rgba(206, 206, 206, 0.43)"}} onClick={() => setRegUser(false)}>Click here to login.</a></p>       


         {errors && <Spring
                            config={config.default}
                            from={
                                {
                                    opacity: 0,
                                    bottom: -30
                                }
                            }
                            to={{
                                opacity: errors ? 1 : 0,
                                bottom: -38,
                            }}>
                            {props => <p id="error-label" style={props}>{errors}</p>}
                        </Spring>}


                </form>

            </React.Fragment>
             
            :

                <React.Fragment>
                    <form  onSubmit={handleSubmit}>

                        <Spring
                            config={config.default}
                            to={{
                                transform: loading ? "scale(0.95)" : "scale(1)",
                            }}>
                            {props => <p style={{ position: "relative", ...props }}><span>Spotify?</span></p>}

                        </Spring>

                        <p><input type="text" disabled={loading && "true"} id="username" placeholder="Username" required value={username}
                            onChange={e => setUsername(e.target.value.trim())}
                        /></p>
                        <p><input type="password" disabled={loading && "true"} id="password" placeholder="Password" required value={password}
                            onChange={e => setPassword(e.target.value)}
                        /></p>

                        <p id="buttons-group"><button disabled={loading && "true"} onTouchEnd={ (e) => { e.preventDefault(); setRegUser(true);  } } onMouseUp={e => { e.preventDefault(); setRegUser(true); }} id="register-button" >Register</button>

                            <button id="submit-button" disabled={loading && "true"} type="submit">Login</button></p>

                        {loading && <Spring
                            config={config.default}
                            from={
                                {
                                    opacity: 0,
                                    bottom: -30,
                                    // transform:"scale(0.8)"
                                }
                            }
                            to={{
                                opacity: loading ? 1 : 0,
                                bottom: -20,
                                //   transform:"scale(1)"
                            }}>
                            {props => <span id="spinner" style={props}>Loading</span>}
                        </Spring>}

                        {errors && <Spring
                            config={config.default}
                            from={
                                {
                                    opacity: 0,
                                    bottom: -30
                                }
                            }
                            to={{
                                opacity: errors ? 1 : 0,
                                bottom: -38,
                            }}>
                            {props => <p id="error-label" style={props}>{errors}</p>}
                        </Spring>}

                            <p id="myname"><a href="https://instagram.com/__adarsh.hegde__">Built by @Adarsh Hegde</a></p>
                    </form>

                </React.Fragment>}

        </div>

    </div>
}

export default Login;