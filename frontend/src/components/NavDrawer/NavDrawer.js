import React from "react";
import makeStyles from '@mui/styles/makeStyles';
import "./NavDrawer.css";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CodeIcon from "@mui/icons-material/Code";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link, withRouter } from "react-router-dom";
import NotificationsIcon from "@mui/icons-material/Notifications";
import logo from "./logo.png";
import { IconButton } from "@mui/material";
import { Grid } from "@mui/material";

const drawerWidth = 230;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
  bottomPush: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 15,
  },
  logoImg: {
    width: "30px",
    objectFit: "cover",
    marginRight: "20px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    padding: "5px",
    marginLeft: "20px",
    height: "64px",
  },
  notifcations: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginRight: "auto",
  },
  pageTitle: {
    paddingRight: "20px",
  },
}));

function NavDrawer(props) {
  const classes = useStyles();

  console.log(props.location)

  const getTitle = () => {
    switch (props.location.pathname.slice(1)) {
      case "console":
        return "Console";
      case "settings":
        return "Settings";
      case "dashboard":
        return "Dashboard";
      default:
        return "MCSM";
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Grid item>
            <Typography className={classes.pageTitle} variant="h6" noWrap>
              {getTitle()}
            </Typography>
          </Grid>

          <Grid container justifyContent="flex-end">
            <IconButton aria-label="notifications" size="large">
              <NotificationsIcon />
            </IconButton>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.logo}>
          <img className={classes.logoImg} alt={"logo"} src={logo} />
          <h3>MCSM</h3>
        </div>
        <Divider />

        <List>
          <Link to="/dashboard" className={classes.link}>
            <ListItem button key="Dashboard" selected={props.location.pathname === "/dashboard"}>
              <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>

          <Link to="/console" className={classes.link}>
            <ListItem button key="Console" selected={props.location.pathname === "/console"}>
              <ListItemIcon>{<CodeIcon />}</ListItemIcon>
              <ListItemText primary="Console" />
            </ListItem>
          </Link>

          <Link to="/settings" className={classes.link}>
            <ListItem button key="Settings" selected={props.location.pathname === "/settings"}>
              <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Link>

          <ListItem className={classes.bottomPush}>
            <div>MCSM Pre-alpha v1.0.0</div>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default withRouter(NavDrawer);
