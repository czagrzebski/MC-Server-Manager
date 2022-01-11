import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: "20px",
  },
  table: {
    backgroundColor: theme.palette.primary.main,
  },
  actionButtonsContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
}));

export default function UserTable({ usersList, deleteUser }) {
  const classes = useStyles();

  return (
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
              key={user?.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {user?.id}
              </TableCell>
              <TableCell>{user?.username}</TableCell>
              <TableCell>
                <div className={classes.actionButtonsContainer}>
                  <Tooltip title="Edit User">
                    <IconButton size="large">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton
                      size="large"
                      onClick={() => deleteUser(user.username)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
