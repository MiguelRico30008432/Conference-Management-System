import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";

export default function LoadingCircle(handler) {
  return (
    <Dialog open={handler}>
      <DialogContent>
        <Box sx={{ display: "flex" }}>
          <CircularProgress color="inherit" />
        </Box>
      </DialogContent>
    </Dialog>
  );
}
