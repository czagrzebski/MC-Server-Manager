import React, { useEffect } from "react";
import { makeStyles } from "@mui/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";
import { AddCircleIcon, EditIcon } from "@mui/icons-material/AddCircle";
import api from "../../services/api";

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: "20px",
    marginTop: "10px",
    backgroundColor: theme.palette.primary.main,
  },
  titleBar: {
    paddingLeft: "15px",
    paddingTop: "5px",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  tableContainer: {
    borderRadius: "20px",
  },
  table: {
    backgroundColor: theme.palette.primary.main,
  },
}));

export function UserTable() {
  const [usersList, setUsersList] = React.useState(null);
  const classes = useStyles();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    api.get("/users/all").then((response) => {
      setUsersList(response.data.users);
    });
  };

  return (
    <div className={classes.container}>
      <div className={classes.titleBar}>
        <h3>Manage Users</h3>
        <Tooltip title="Create User">
          <IconButton
            style={{ marginLeft: "auto", marginRight: "25px" }}
            size="large"
          >
            <AddCircleIcon />
          </IconButton>
        </Tooltip>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          className={classes.table}
        >
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersList?.map((user) => (
              <TableRow
                key={user.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>
                  <Tooltip title="Edit User">
                    <IconButton size="large">
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
