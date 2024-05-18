import React from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Box, Card, Container } from "@mui/material";

export default function SubmissionDetails({ onClose, submission }) {
  return (
    <Card>
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <MDTypography
            variant="h5"
            fontWeight="medium"
            color="grey"
            textAlign="center"
            sx={{ mb: 3 }}
          >
            {submission.title}
          </MDTypography>

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

          <MDButton
            variant="gradient"
            color="info"
            sx={{ mt: 2, mb: 2 }}
            onClick={onClose}
          >
            Close Details
          </MDButton>
        </Box>
      </Container>
    </Card>
  );
}
