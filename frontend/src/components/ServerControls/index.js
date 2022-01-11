import React from "react";
import { red, green } from "@mui/material/colors";
import withStyles from '@mui/styles/withStyles';
import api from "services/api";
import ConfirmDialog from "../ConfirmDialog";
import { useSelector } from "react-redux";
import { useNotification } from "components/NotificationProvider";

import Button from "@mui/material/Button";

const ColorButton = withStyles((theme) => ({
  root: {
    color: "white",
    backgroundColor: green[500],
    "&:hover": {
      backgroundColor: green[600],
    },
    marginRight: "10px",
    paddingLeft: "20px",
    paddingRight: "20px",
  },
}))(Button);

function ServerControls() {
  const [dialogStatus, setDialogStatus] = React.useState({ open: false });
  const { createNotification } = useNotification();

  const minecraftServerState = useSelector(
    (state) => state.minecraftServer.status
  );

  const startServer = () => {
    api
      .get("/server/start")
      .then((response) => {
        createNotification(response.data);
      })
      .catch((err) => {
        if (err.response) {
          switch (err.response.data.message) {
            case "EULA":
              setDialogStatus({
                open: true,
                title: "Minecraft End User License Agreement",
                msg: `You must accept the Mojang EULA before running the server. By clicking 'accept' you indicate that you have read and accepted the terms of the agreement below. https://account.mojang.com/documents/minecraft_eula`,
              });
              break;

            default:
              createNotification(err.response.data, "error");
              break;
          }
        }
      });
  };

  const killServer = () => {
    api
      .get("/server/kill")
      .then((response) => {
        createNotification(response.data);
      })
      .catch((err) => {
        if (err.response) {
          createNotification(err.response.data, "error");
        }
      });
  };

  const stopServer = () => {
    api
      .get("/server/stop")
      .then((response) => {
        createNotification(response.data);
      })
      .catch((err) => {
        if (err.response) {
          createNotification(err.response.data, "error");
        }
      });
  };

  const acceptEULA = () => {
    api
      .put("/server/accepteula")
      .then(() => startServer())
      .catch((err) => {
        if (err.response) {
          createNotification(err.response.data, "error");
        }
      });
  };

  return (
    <div>
      <ColorButton
        className="control-btn"
        variant="contained"
        style={{
          display:
            minecraftServerState === "SERVER_STOPPED" ? "inline-block" : "none",
        }}
        onClick={() => startServer()}
      >
        Start
      </ColorButton>
      <ColorButton
        className="control-btn"
        variant="contained"
        style={{
          backgroundColor: red[700],
          display:
            minecraftServerState === "SERVER_RUNNING" ? "inline-block" : "none",
        }}
        onClick={() => stopServer()}
      >
        Stop
      </ColorButton>
      <ColorButton
        className="control-btn"
        variant="contained"
        style={{
          backgroundColor: red[900],
          display:
            minecraftServerState === "SERVER_STOPPED" ? "none" : "inline-block",
        }}
        onClick={() => killServer()}
      >
        Kill
      </ColorButton>
      <ConfirmDialog
        open={dialogStatus.open}
        setOpen={setDialogStatus}
        title={dialogStatus.title}
        msg={dialogStatus.msg}
        onAgreeCallback={acceptEULA}
      />
    </div>
  );
}

export default ServerControls;
