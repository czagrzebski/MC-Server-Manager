import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../../services/api";
import authService from "../../services/auth.service";


export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggedIn, setLoggedIn] = useState(false);
    const jwt = useSelector(state => state.user.accessToken);
    const usernameDisplay = useSelector(state => state.user.username);

    const handleSubmit = (event) => {
        event.preventDefault();
        authService.login(username, password);
    }

    return (
        <div >
            <form style={{display: "block", width: "100px"}}>
                <label for="username">Username</label>
                <input type="text" title="username" value={username} onChange={(event) => setUsername(event.target.value)}></input>
                <label for="password">Password</label>
                <input type="password" title="Password" value={password} onChange={(event) => setPassword(event.target.value)}></input>
                <button onClick={handleSubmit}>Login</button>
            </form>
            <button onClick={authService.fetchRefreshToken}>Refresh Token</button>
            <button onClick={() => {
                api.get("/users/all", {withCredentials: true}).then(users => {
                    console.log(users.data.users);
                })
            }}>Send API Request</button>
            {isLoggedIn ? <p>Currently Logged In</p> : <p>Not Logged In</p>}
            <p>Username: {usernameDisplay}</p>
            <p>JWT: {jwt}</p>
        </div>
    )
}