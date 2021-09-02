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
import { Link, withRouter } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
import NotificationsIcon from "@material-ui/icons/Notifications";
import logo from "./logo.png";
import { Grid } from "@material-ui/core";

const drawerWidth = 220;

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
  // necessary for content to be below app bar
  toolbar: {
    padding: "10px",
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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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

          <Grid container justify="flex-end">
            <Badge badgeContent={2} color="primary">
              <NotificationsIcon />
            </Badge>
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

          <ListItem className={classes.bottomPush}>
            <div>Release Alpha v1.0.0</div>
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}

export default withRouter(NavDrawer);
