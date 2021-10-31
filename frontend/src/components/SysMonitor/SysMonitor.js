import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { socket } from "../../utils/socket";

import "./SysMonitor.css";
import { useTheme } from "@mui/material";

const SysItem = (props) => {
    const theme = useTheme();

    return(
      <div>
        <p>{props.name}</p>
        <p>{props.displayValue}</p>
        <Box position="relative" display="inline-flex" style={{marginTop: "10px"}}>
          <CircularProgress
            variant="determinate"
            style={{
              color: "lightgrey",
              position: "relative",
            }}
            size={100}
            thickness={4}
            value={100}
          />
          <CircularProgress
            variant="determinate"
            value={props.value}
            size={100}
            style={{position: "absolute", 'color': (props.value < 90) ? theme.palette.primaryColor : "#d32f2f" }}
            thickness={4}
          />
        </Box>
      </div>
  );
}

export const SysMonitor = () => {
  const [cpuUsage, setCpuUsage] = useState({
    value: 0,
    displayValue: "0%",
  });

  const [memUsage, setMemUsage] = useState({
    value: 0,
    displayValue: "0 / 0MB",
  });

  useEffect(() => {
    socket.on("sysmonitor", (info) => {
      setCpuUsage({
        value: info.cpu_usage,
        displayValue: `${info.cpu_usage}%`,
      });

      setMemUsage({
        value: (info.memory.usedMemMb / info.memory.totalMemMb) * 100,
        displayValue: `${info.memory.usedMemMb} / ${info.memory.totalMemMb}MB`,
      });
    });

    //unbind event listener
    return () => {
      socket.off("sysmonitor");
    };
  }, []);

  return (
    <div className={"sysMonitor"}>
      <div className="sysStat">
        <SysItem
          name="CPU Usage"
          displayValue={cpuUsage.displayValue}
          value={cpuUsage.value}
        />
      </div>
      <div className="sysStat">
        <SysItem
          name="Memory Usage"
          displayValue={memUsage.displayValue}
          value={memUsage.value}
        />
      </div>
    </div>
  );
};
