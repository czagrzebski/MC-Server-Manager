import React, { useEffect } from "react";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { socket, SocketContext } from "services/socket";
import { Dashboard, Login } from "pages";
import { useDispatch } from "react-redux";

import ProtectedRoutes from "components/ProtectedRoutes";
import authService from "services/auth.service";

import { setLoading } from "app/slices/userSlice";

import "./App.css";

import { CssBaseline } from "@mui/material";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    //Attempt to get a new refresh token before loading dashboard
    authService
      .fetchRefreshToken()
      .then((response) => dispatch(setLoading(false)))
      .catch((err) => dispatch(setLoading(false)));

    return () => socket.close();

    //Disable missing dependency warning
    // eslint-disable-next-line
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <CssBaseline />
      <HashRouter>
          <Routes>
            <Route exact path="*" element={<ProtectedRoutes />}>
              <Route exact path="*" element={<Navigate to="/dashboard" />} />
              <Route path="dashboard/*" element={<Dashboard />} />
            </Route>
            <Route path="login/*" element={<Login />} />
          </Routes>
      </HashRouter>
    </SocketContext.Provider>
  );
}

export default App;
