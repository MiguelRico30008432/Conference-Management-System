import React from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Box, Card, Container } from "@mui/material";
import MDBox from "components/MDBox";

export default function SubmissionDetails({ onClose, submission }) {
  return (
    <Card>
      <MDTypography
        variant="h5"
        fontWeight="medium"
        color="grey"
        textAlign="center"
      >
        {submission.title}
      </MDTypography>

      <MDBox ml={2} textAlign="left">
        <MDTypography variant="h6">Authors:</MDTypography>
        <MDTypography variant="body2">{submission.authors}</MDTypography>
        <MDTypography variant="h6" sx={{ mt: 2 }}>
          Status:
        </MDTypography>
        <MDTypography variant="body2">{submission.status}</MDTypography>
        <MDTypography variant="h6" sx={{ mt: 2 }}>
          Submission Date:
        </MDTypography>
        <MDTypography variant="body2">{submission.addDate}</MDTypography>
        <MDTypography variant="h6" sx={{ mt: 2 }}>
          Abstract:
        </MDTypography>
        <MDTypography variant="body2">{submission.abstract}</MDTypography>
      </MDBox>

      <MDButton
        variant="gradient"
        color="info"
        onClick={onClose}
        sx={{
          maxWidth: "150px",
          maxHeight: "30px",
          minWidth: "5px",
          minHeight: "30px",
          mt: 2,
          ml: 2,
          mb: 2,
        }}
      >
        Close Details
      </MDButton>
    </Card>
  );
}
