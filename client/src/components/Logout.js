import React, {useEffect} from 'react';
import {useHistory, useLocation} from "react-router-dom";
import {removeAccessToken} from "../config/session";
import api from "../config/axios";
import response from "../config/response";

const Logout = () => {
    const location = useLocation()
    const history = useHistory()
    useEffect(() => {
        api.post('/logout').then((res) => {
            if (res.status === 200) {
                // Also removes all user information in cookies
                removeAccessToken()
                history.push('/')
            } else {
                console.log(response.SERVER_ERROR)
            }
        }).catch((e) => {
            console.log(response.SERVER_ERROR)
        })
    },[location, history])
    return(<></>)
}
export default Logout;
