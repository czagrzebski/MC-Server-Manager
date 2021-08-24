import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { SettingsPanel } from './SettingsPanel/SettingsPanel';
import api from '../../utils/api';
import produce from 'immer';

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
      {value === index && (
        <Box p={3}>
         {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export function Settings() {
  const classes = useStyles();
  const [settingsList, setSettingsList] = useState("")
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    api.get('/server/settings')
        .then(resp => {
          setSettingsList(resp["data"])
        })
        .catch(err => console.log(err));
  }, [])
  
  const handleSettingChange = (category, setting, value) => {
    setSettingsList(
      produce(draftState => {
        draftState[category][setting].value = value
      }))    
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={tabIndex} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Core" {...a11yProps(0)} />
          <Tab label="Java" {...a11yProps(1)} />
          <Tab label="Minecraft Settings" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={tabIndex} index={0}>
        <SettingsPanel settingsList={settingsList.core} onSettingChange={handleSettingChange}/>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <SettingsPanel settingsList={settingsList.java} onSettingChange={handleSettingChange}/>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <SettingsPanel settingsList={settingsList.minecraftSettings} onSettingChange={handleSettingChange}/>
      </TabPanel>
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
