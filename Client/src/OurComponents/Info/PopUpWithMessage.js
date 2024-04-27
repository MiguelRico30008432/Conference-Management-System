import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function PopUpWithMessage({
  open,
  handleClose,
  handleConfirm,
  justOneButton = false,
  affirmativeButtonName = "Confirm",
  negativeButtonName = "Cancel",
  text,
  title,
}) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        {justOneButton ? (
          <Button onClick={handleConfirm} color="primary">
            {affirmativeButtonName}
          </Button>
        ) : (
          <>
            <Button onClick={handleConfirm} color="primary">
              {affirmativeButtonName}
            </Button>
            <Button onClick={handleClose} color="primary">
              {negativeButtonName}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
