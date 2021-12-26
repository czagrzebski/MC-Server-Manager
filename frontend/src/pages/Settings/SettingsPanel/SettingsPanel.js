import React from "react";
import "./SettingsPanel.css";
import { SettingItem } from "../../../components/SettingItem/SettingItem";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "60px",
    padding: "20px",
    marginLeft: "15px",
    width: "100%",
  },
  settingTabMenu: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "20px",
    maxHeight: "80vh",
    overflowY: "auto",
    overflowX: "hidden",
    marginTop: "10px",
    "&::-webkit-scrollbar-track": {
      boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
      borderRadius: "10px",
      backgroundColor: theme.palette.primary.light,
    },
    "&::-webkit-scrollbar": {
      width: "12px",
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "10px",
      boxShadow: "inset 0 0 6px rgba(0,0,0,.3)",
      backgroundColor: "#8d8c8c",
    },
  },
}));

export function SettingsPanel(props) {
  const classes = useStyles();
  return (
    <div className={classes.settingTabMenu}>
      {!props.settingsList ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
            marginBottom: "40px",
          }}
        >
          <CircularProgress color="info" />
        </Box>
      ) : (
        <div className={classes.settingsGrid}>
          {Object.keys(props.settingsList).map((settingKey, i) => {
            return (
              <SettingItem
                settingId={settingKey}
                setting={props.settingsList[settingKey]}
                key={i}
                onSettingChange={props.onSettingChange}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
