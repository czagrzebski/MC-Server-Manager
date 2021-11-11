import React from "react";
import api from "../../utils/api";
import Notification from "../Notification/Notification";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import NativeSelect from "@mui/material/NativeSelect";
import "./SettingItem.css";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  actionButton: {
    backgroundColor: theme.palette.info.dark,
  },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

export function SettingItem(props) {
  const classes = useStyles();
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
  //TODO: MUI V5 Changed how AntSwitch Events are Handled. Need to fix
  const handleValueChange = (event) => {
    if (event.target.hasOwnProperty("checked")) {
      setChecked(event.target.checked);
      props.onSettingChange(category, settingId, event.target.checked);
    } else {
      props.onSettingChange(category, settingId, event.target.value);
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
            className={classes.actionButton}
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
