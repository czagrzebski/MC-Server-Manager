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

function TabPanel(props) {
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

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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
  const [value, setValue] = useState(0);

  useEffect(() => {
    api.get('/server/settings')
        .then(resp => {
          setSettingsList(resp["data"])
        })
        .catch(err => console.log(err));
  }, [])
  
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  //TODO: Clean this code by implementing immer
  const handleSettingChange = (category, setting, value) => {
    setSettingsList(settingsList => ({
      ...settingsList,
      [category]: {
        ...settingsList[category],
        [setting]: {
          ...settingsList[category][setting],
          value: [value]
         }
      }
    }
    ))
       
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
          <Tab label="Core" {...a11yProps(0)} />
          <Tab label="Java" {...a11yProps(1)} />
          <Tab label="Minecraft Settings" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <SettingsPanel settingsList={settingsList.core} onSettingChange={handleSettingChange}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <SettingsPanel settingsList={settingsList.java} onSettingChange={handleSettingChange}/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SettingsPanel settingsList={settingsList.minecraftSettings} onSettingChange={handleSettingChange}/>
      </TabPanel>
    </div>
  );
}