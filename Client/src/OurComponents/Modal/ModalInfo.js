import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

export default function ModalInfo({
  open = true,
  onClose,
  height = "90%",
  width = "90%",
  children,
}) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: width,
            height: height,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflowY: "auto",
            bgcolor: "#EBEBEB",
            borderRadius: 2,
          }}
        >
          {children}
        </Box>
      </Modal>
    </>
  );
}
