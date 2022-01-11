import React, { useState } from "react";
import authService from "services/auth.service";
import {useNavigate} from "react-router-dom";
import { makeStyles } from "@mui/styles";

import { Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox, Box, Alert, Typography, Container} from "@mui/material";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    display: "block",
    width: "200px"
  },
  loginButton : {
    backgroundColor: theme.palette.info.main,
    '&:hover': {
        backgroundColor: theme.palette.info.light
    }
  },
}));

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const classes = useStyles();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
      event.preventDefault();
      //validate a successful login prior to redirect
      authService.login(username, password).then(response => {
           navigate("/");
      }).catch(err => {
        setError(err.response.data);
      })
  };

  return (
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <Box
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in to MCSM
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          error={error}
          margin="normal"
          required
          fullWidth
          color="info"
          id="username"
          label="Username"
          value={username}
          name="username"
          onChange={(e) => {
              setUsername(e.target.value);
          }}
          autoComplete="username"
          variant="outlined"
          autoFocus
        />
        <TextField
          error={error}
          margin="normal"
          required
          color="info"
          fullWidth
          name="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          label="Password"
          value={password}
          type="password"
          id="password"
          variant="outlined"
          autoComplete="current-password"
        />
        <FormControlLabel
          control={<Checkbox value="remember" color="info" />}
          label="Remember me"
        />
        <Button
          type="submit"
          className={classes.loginButton}
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </Button>
        {error ? <Alert severity="error">{error}</Alert> : null}
      </Box>
    </Box>
  </Container>
  );
}

export default LoginForm;