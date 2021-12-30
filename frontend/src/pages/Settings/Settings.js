import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import makeStyles from "@mui/styles/makeStyles";
import { Tabs, Tab, Box } from "@mui/material";

import { SettingsPanel } from "./SettingsPanel/SettingsPanel";

import api from "../../utils/api";
import produce from "immer";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.dark,
    "& .MuiBox-root": {
      padding: "0px",
    },
  },
  settingTab: {
    boxShadow: 0,
    backgroundColor: theme.palette.primary.dark,
    "& .MuiTabs-indicator": {
      backgroundColor: theme.palette.info.main,
    },
  },
  tabLabels: {
    "&.Mui-selected": {
      color: theme.palette.info.main,
      fontWeight: theme.typography.fontWeightMedium,
    },
  },
}));

export function Settings() {
  const classes = useStyles();
  const [settingsList, setSettingsList] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    api
      .get("/server/settings")
      .then((resp) => {
        setSettingsList(resp["data"]);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSettingChange = (category, setting, value) => {
    setSettingsList(
      produce((draftState) => {
        draftState[category][setting].value = value;
      })
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="simple tabs example"
        className={classes.settingTab}
      >
        <Tab label="General" {...a11yProps(0)} className={classes.tabLabels} />
        <Tab label="Users" {...a11yProps(1)} className={classes.tabLabels} />
        <Tab label="Java" {...a11yProps(2)} className={classes.tabLabels} />
        <Tab label="Minecraft Settings" {...a11yProps(3)} className={classes.tabLabels}/>
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <SettingsPanel
          settingsList={settingsList.general}
          onSettingChange={handleSettingChange}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <p>Feature not available</p>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <SettingsPanel
          settingsList={settingsList.java}
          onSettingChange={handleSettingChange}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <SettingsPanel
          settingsList={settingsList.minecraftSettings}
          onSettingChange={handleSettingChange}
        />
      </TabPanel>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
