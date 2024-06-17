import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";

export default function BlockPageForConfStatus({
  affirmativeButtonName = "Go back",
  text,
  title = "Oh My...",
}) {
  const navigate = useNavigate();

  return (
    <Dialog open={true}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <MDButton
          color="warning"
          sx={{
            maxWidth: "110px",
            maxHeight: "30px",
            minWidth: "1px",
            minHeight: "30px",
          }}
          onClick={() => navigate("/MyConferences/ConferenceDescription")}
        >
          {affirmativeButtonName}
        </MDButton>
      </DialogActions>
    </Dialog>
  );
}
