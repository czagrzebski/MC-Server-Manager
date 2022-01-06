import React from "react";
import { useSelector } from "react-redux";
import Loading from "../../components/Loading/Loading";
import { Outlet, Navigate } from "react-router-dom";

export function ProtectedRoutes() {
    const auth = useSelector(state => state.user.accessToken);
    const loading = useSelector(state => state.user.isLoading);

    //App is trying to fetch an access token before blocking access
    if(loading){
        return <Loading />
    }

    return (auth ? <Outlet /> : <Navigate to="/login" />);
}

