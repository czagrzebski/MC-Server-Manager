import React from "react";
import api from "../../utils/api";
import Notification from "../Notification/Notification";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import NativeSelect from "@material-ui/core/NativeSelect";
import "./SettingItem.css";

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
  },
  switchBase: {
    padding: 2,
    color: theme.palette.grey[500],
    "&$checked": {
      transform: "translateX(12px)",
      color: theme.palette.common.white,
      "& + $track": {
        opacity: 1,
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: "none",
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

export function SettingItem(props) {
  const { settingId } = props;
  const { name, description, type, category, value, options, action } =
    props.setting;
  const [status, setStatusBase] = React.useState("");
  const [checked, setChecked] = React.useState(value === "true");

  //Save setting when changed
  const saveSetting = (value) => {
    api
      .put(
        "/server/settings/set",
        JSON.stringify({ category: category, setting: settingId, value: value })
      )
      .then((response) => {
        setStatusBase({
          msg: response.data,
          date: new Date(),
          severity: "success",
        });
      });
  };

  //Updates the state when the user changes the value
  const handleValueChange = (event) => {
    if (event.target.value) {
      props.onSettingChange(category, settingId, event.target.value);
      //check if ant switch was toggled
    } else if ("checked" in event.target) {
      setChecked(event.target.checked);
      props.onSettingChange(category, settingId, event.target.checked);
    }
  };

  const dispatchAction = (targetURL, params) => {
    api
      .get(targetURL, params)
      .then((response) => {
        setStatusBase({
          msg: response.data,
          date: new Date(),
          severity: "success",
        });
      })
      .catch((err) => {
        if (err.response) {
          setStatusBase({
            msg: err.response.data,
            date: new Date(),
            severity: "error",
          });
        }
      });
  };

  //Renders a setting item based on type
  const renderSettingType = () => {
    switch (type) {
      case "boolean":
        return (
          <Grid component="label" container alignItems="center" spacing={1}>
            <Grid item>Off</Grid>
            <Grid item>
              <AntSwitch
                checked={checked}
                onChange={(event) => {
                  handleValueChange(event);
                  saveSetting(event.target.checked);
                }}
              />
            </Grid>
            <Grid item>On</Grid>
          </Grid>
        );
      case "list":
        return (
          <NativeSelect
            name="options"
            id="options"
            value={value}
            onChange={(event) => {
              handleValueChange(event);
              saveSetting(event.target.value);
            }}
          >
            {options.map((option) => {
              return (
                <option
                  value={option}
                  key={option}
                  className={"setting-option"}
                >
                  {option}
                </option>
              );
            })}
          </NativeSelect>
        );
      default:
        return (
          <OutlinedInput
            value={value}
            onChange={handleValueChange}
            className={"outlined-input"}
            onBlur={(event) => {
              saveSetting(event.target.value);
            }}
          />
        );
    }
  };

  return (
    <div className={"setting-item"}>
      <h4>{name}</h4>
      <p>{description}</p>
      {renderSettingType()}
      <div className={"button-action"}>
        {action ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatchAction(action.target, action.params)}
          >
            {action.name}
          </Button>
        ) : null}
      </div>
      {status ? (
        <Notification
          key={status.date}
          msg={status.msg}
          severity={status.severity}
        />
      ) : null}
    </div>
  );
}
