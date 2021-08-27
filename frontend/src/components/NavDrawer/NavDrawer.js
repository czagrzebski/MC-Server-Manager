import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import "./NavDrawer.css";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import CodeIcon from "@material-ui/icons/Code";
import SettingsIcon from "@material-ui/icons/Settings";
import { Link } from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  bottomPush: {
    position: "fixed",
    bottom: 0,
    textAlign: "center",
    paddingBottom: 15,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },

  link: {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));

export default function NavDrawer() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Minecraft Server Manager
          </Typography>
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
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <Link to="/" className={classes.link}>
            <ListItem button key="Dashboard">
              <ListItemIcon>{<DashboardIcon />}</ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </Link>

          <Link to="/console" className={classes.link}>
            <ListItem button key="Console">
              <ListItemIcon>{<CodeIcon />}</ListItemIcon>
              <ListItemText primary="Console" />
            </ListItem>
          </Link>

          <Link to="/settings" className={classes.link}>
            <ListItem button key="Settings">
              <ListItemIcon>{<SettingsIcon />}</ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Link>

          <ListItem className={classes.bottomPush}>MCM Alpha V1.00</ListItem>
        </List>
      </Drawer>
    </div>
  );
}
