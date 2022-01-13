import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import Linkify from "react-linkify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmDialog(props) {
  const { title, msg, onAgreeCallback, open, setOpen } = props;

  const handleClose = () => {
    setOpen({ open: false });
  };

  const onAccept = () => {
    handleClose();
    onAgreeCallback();
  };

  const onDecline = () => {
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onDecline}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Linkify>{msg}</Linkify>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDecline} color="primary">
            Decline
          </Button>
          <Button onClick={onAccept} color="primary">
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ConfirmDialog;
