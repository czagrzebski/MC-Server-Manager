import React from "react";
import { CircularProgress } from '@mui/material';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
    loadingCircle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
    }
})

function Loading(){
    const classes = useStyles();

    return (
        <div className={classes.loadingCircle}>
            <CircularProgress color="info" />
        </div>
    )
}

export default Loading;

