import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MDButton from "components/MDButton";

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
        {!justOneButton && (
          <MDButton
            onClick={handleConfirm}
            color="warning"
            sx={{
              maxWidth: "130px",
              maxHeight: "30px",
              minWidth: "5px",
              minHeight: "5px",
            }}
          >
            {affirmativeButtonName}
          </MDButton>
        )}

        <MDButton
          onClick={handleClose}
          color="info"
          sx={{
            maxWidth: "80px",
            maxHeight: "30px",
            minWidth: "5px",
            minHeight: "5px",
          }}
        >
          {negativeButtonName}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}
