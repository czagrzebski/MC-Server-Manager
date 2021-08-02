import React from 'react';
import api from '../../utils/api';
import Notification from '../Notification/Notification';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import './SettingItem.css'

const AntSwitch = withStyles((theme) => ({
    root: {
      width: 28,
      height: 16,
      padding: 0,
      display: 'flex',
    },
    switchBase: {
      padding: 2,
      color: theme.palette.grey[500],
      '&$checked': {
        transform: 'translateX(12px)',
        color: theme.palette.common.white,
        '& + $track': {
          opacity: 1,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    thumb: {
      width: 12,
      height: 12,
      boxShadow: 'none',
    },
    track: {
      border: `1px solid ${theme.palette.grey[500]}`,
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor: theme.palette.common.white,
    },
    checked: {},
  }))(Switch);


export function SettingItem(props){
    const [status, setStatusBase] = React.useState("");
    const [checked, setChecked] = React.useState(props.currentVal === 'true')
   
    //Save setting when changed
    const saveSetting = (value) => {
        api.put('/server/settings/set', JSON.stringify({"category": props.category, "setting": props.settingId, "value": value}))
            .then(response => {
                setStatusBase({ msg: response.data, date: new Date(), severity: "success" });
            })
    }

    //Updates the state when the user changes the value
    const handleValueChange = (event) => {  
        if(event.target.value){
            props.onSettingChange(props.category, props.settingId, event.target.value)
        }else if('checked' in event.target) {
            setChecked(event.target.checked)
            props.onSettingChange(props.category, props.settingId, event.target.checked)
        }
       
    }
    
    //Renders a setting item based on type
    const renderSettingType = () => {
        switch(props.type) {
            case "boolean":
                return  (
                    <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>Off</Grid>
                        <Grid item>
                        <AntSwitch checked={checked} onChange={(event) => {
                            handleValueChange(event);
                            saveSetting(event.target.checked);
                        }} 
                        />
                        </Grid>
                        <Grid item>On</Grid>
                    </Grid>
                )
            case "string":
            case "integer":
                return <input 
                            value={props.currentVal} 
                            onChange={handleValueChange} 
                            onBlur={(event) => {
                                saveSetting(event.target.value)}
                            }>
                        </input>;
            case "list":
                return (
                    <select name="options" id="options" onChange={(event) => {
                        handleValueChange(event);
                        saveSetting(event.target.value);
                    }}>
                        {props.options.map(option => {
                            return <option value={option} classname={"setting-option"}>{option}</option>
                        })}
                    </select>
                )
            default:
                return <input 
                    value={props.currentVal} 
                    onChange={handleValueChange} 
                    onBlur={(event) => {
                        saveSetting(event.target.value)}
                    }>
            </input>;
        }
    }

    return (
        <div className={"setting-item"} >    
            <h4>{props.name}</h4>
            <p>{props.description}</p>
            {renderSettingType()}
            {status ? <Notification key={status.date} msg={status.msg} severity={status.severity}/> : null}
        </div>
        
    )
}