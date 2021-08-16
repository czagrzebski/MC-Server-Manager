import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Linkify from 'react-linkify';
 

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ConfirmDialog(props) {
  const {title, msg, onAgreeCallback, open, setOpen} = props;

  const handleClose = () => {
    setOpen({open: false})
  }

  const onAccept = () => {
    handleClose();
    onAgreeCallback();
  }

  const onDecline = () => {
    handleClose();
  }

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
        <DialogTitle id="alert-dialog-slide-title">
            {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Linkify>
              {msg}
            </Linkify>
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