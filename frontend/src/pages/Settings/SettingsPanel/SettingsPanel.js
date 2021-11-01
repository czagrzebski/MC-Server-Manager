import React from "react";
import "./SettingsPanel.css";
import { SettingItem } from "../../../components/SettingItem/SettingItem";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  settingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "60px",
    padding: "20px",
    marginTop: "20px",
    marginLeft: "15px",
    width: "100%",
  
  },
  settingTabMenu: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "20px",
  },
}));

//TODO: Implement redux for better state management to prevent ugly nested props.
export function SettingsPanel(props) {
  const classes = useStyles();
  return (
    <div className={classes.settingTabMenu}>
        <div className={classes.settingsGrid}>
          {!props.settingsList
            ? null
            : Object.keys(props.settingsList).map((settingKey, i) => {
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
    </div>
  );
}
