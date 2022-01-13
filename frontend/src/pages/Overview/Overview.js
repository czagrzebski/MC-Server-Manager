import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { setServerStatus } from "app/slices/minecraftServerSlice";
import api from "services/api";

import ServerControls from "components/ServerControls";
import SysMonitor from "components/SysMonitor";

export function Overview() {
  const serverState = useSelector((state) => state.minecraftServer.status);
  const dispatch = useDispatch();

  const renderServerState = (serverState) => {
    switch (serverState) {
      case "SERVER_STARTING":
        return "Starting";
      case "SERVER_RUNNING":
        return "Running";
      default:
        return "Stopped";
    }
  };

  useEffect(() => {
    api
      .get("/server/state")
      .then((resp) => dispatch(setServerStatus(resp["data"])))
      .catch((err) => console.log(err));
  }, [dispatch]);

  return (
    <div>
      <h1>{renderServerState(serverState)}</h1>
      <SysMonitor />
      <ServerControls />
    </div>
  );
}
