import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// Material ui
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button
} from "@material-ui/core/";

function ConfirmDialog(props) {
  const [open, setOpen] = useState(props.dialogOpen);

  useEffect(() => {
    setOpen(props.dialogOpen);
  }, [props.dialogOpen]);

  const handleCancel = () => {
    props.handleCloseDialog();
    setOpen(false);
  };

  const handleConfirmFunc = () => {
    const { confirmParam } = props;
    props.implementConfirmState(confirmParam || null);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={props.transition}
      keepMounted
      onClose={() => handleCancel()}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title">
        {props.dialogTitle}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {props.dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleCancel()} color="primary">
          Nee
        </Button>
        <Button onClick={() => handleConfirmFunc()} color="primary">
          Ja
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ConfirmDialog.propTypes = {
  transition: PropTypes.object.isRequired,
  dialogOpen: PropTypes.bool.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  dialogContent: PropTypes.string.isRequired,
  implementConfirmState: PropTypes.func.isRequired,
  handleCloseDialog: PropTypes.func.isRequired
};

export default ConfirmDialog;
