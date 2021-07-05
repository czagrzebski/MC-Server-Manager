import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import './ServerProperty.css'

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

function ServerProperty({property, value, onPropertyChange, propertyInfo, saveSettings}){
    const [checked, setChecked] = React.useState(value === "true");
    const [propertyValue, setPropertyValue] = React.useState(value);

    const handleServerPropertyChange = (event) => {
        onPropertyChange(property, propertyValue)
    }

    const handleValueChange = (event) => {
      setPropertyValue(event.target.value.toLowerCase())
    }

    const handleToggleSwitchChange = (event) => {
        setChecked(event.target.checked);
        onPropertyChange(property, event.target.checked.toString());
        saveSettings();
    }
    
    const renderInputType = () => {
        switch (propertyInfo.type) {
            case "string": {
                return <input onBlur={handleServerPropertyChange} onChange={handleValueChange}  value={propertyValue}></input>
            }
            case "boolean": {
                return <div>
                     <Grid component="label" container alignItems="center" spacing={1}>
                        <Grid item>Off</Grid>
                    <Grid item>
                        <AntSwitch onChange={handleToggleSwitchChange} checked={checked}/>
                    </Grid>
                    <Grid item>On</Grid>
                    </Grid>
                </div>
            }
            case "custom": {
              return (
                <div>
                  <select className={"drop-down"} value={value} onChange={handleServerPropertyChange} onBlur={saveSettings}>
                    {propertyInfo.options.map((option, key) => {
                      return <option key={key} value={option}>{option}</option>
                    })}
                  </select>
                </div>
              )
            }
            default: {
              return <input onBlur={handleServerPropertyChange} onChange={handleValueChange}  value={propertyValue}></input>
            }
        }
    }

    return (
        <div className="server-property">
            <h3>{property}</h3>
            <p>{propertyInfo["description"]}</p>
            <div className={"setting-input"}>
                {renderInputType()}
            </div>
        </div>
    )
}

export default ServerProperty;