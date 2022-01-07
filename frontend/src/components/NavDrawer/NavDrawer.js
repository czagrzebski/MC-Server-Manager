import React, { useState } from "react";
import { Link } from "react-router-dom";
import withRouter from "../withRouter";

import {Grid, MenuItem, Menu, ListItemText, ListItemIcon, ListItem, Divider, Typography, List, Toolbar, AppBar, CssBaseline, Drawer, IconButton} from "@mui/material";
import {Dashboard, Code, Settings, AccountCircle} from "@mui/icons-material";
import makeStyles from "@mui/styles/makeStyles";
import "./NavDrawer.css";

import logo from "./logo.png";

import authService from "../../services/auth.service";


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
    background: theme.palette.primary.main,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
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
  listItem: {
    "&$selected": {
      backgroundColor: "red",
      color: "white",
      "& .MuiListItemIcon-root": {
        color: "white",
      },
    },
  },
}));

function NavDrawer(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const getTitle = () => {
    switch ("") {
      case "console":
        return "Console";
      case "settings":
        return "Settings";
      case "overview":
        return "Overview";
      default:
        return "MCSM";
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
        elevation={0}
        enableColorOnDark
      >
        <Toolbar>
          <Grid item>
            <Typography className={classes.pageTitle} variant="h6" noWrap>
              {getTitle()}
            </Typography>
          </Grid>

          <Grid container justifyContent="flex-end">
            <IconButton
              aria-label="account"
              size="large"
              aria-controls={open ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleMenuClick}
            >
              <AccountCircle />
            </IconButton>
          </Grid>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => {
              handleClose()
              authService.logout();
            }}>Logout</MenuItem>
          </Menu>
        </Toolbar>
        <Divider />
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
          <Link to="/dashboard/overview" className={classes.link}>
            <ListItem button key="Dashboard">
              <ListItemIcon>{<Dashboard />}</ListItemIcon>
              <ListItemText primary="Overview" />
            </ListItem>
          </Link>

          <Link to="/dashboard/console" className={classes.link}>
            <ListItem button key="Console">
              <ListItemIcon>{<Code />}</ListItemIcon>
              <ListItemText primary="Console" />
            </ListItem>
          </Link>

          <Link to="/dashboard/settings" className={classes.link}>
            <ListItem button key="Settings">
              <ListItemIcon>{<Settings />}</ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItem>
          </Link>
        </List>
      </Drawer>
    </div>
  );
}

export default withRouter(NavDrawer);
