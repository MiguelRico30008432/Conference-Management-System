import React from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Box, Card, Container } from "@mui/material";
import MDBox from "components/MDBox";

export default function SubmissionDecisionDetails({ onClose, submission }) {
  if (!submission || submission.reviews.length === 0) {
    return (
      <Container maxWidth="sm">
        <MDBox mb={3} textAlign="left">
          <Card>
            <MDTypography variant="h5" fontWeight="medium" color="grey" textAlign="center" sx={{ mb: 3, mt: 2 }}>
              No submission details available
            </MDTypography>
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
        </MDBox>
      </Container>
    );
  }

  const { title, reviews } = submission;

  return (
    <Container maxWidth="sm">
      <MDBox mb={3} textAlign="left">
        <Card>
          <MDTypography variant="h5" fontWeight="medium" color="grey" textAlign="center" sx={{ mb: 3, mt: 2 }}>
            {title}
          </MDTypography>

          <MDBox ml={2} textAlign="left">
            {reviews.map((review, index) => (
              <div key={index}>
                <MDTypography variant="h6">Reviewer:</MDTypography>
                <MDTypography variant="body2">
                  {review.userfirstname} {review.userlastname}
                </MDTypography>
                <MDTypography variant="h6" sx={{ mt: 2 }}>
                  Grade:
                </MDTypography>
                <MDTypography variant="body2">{review.reviewgrade}</MDTypography>
                <MDTypography variant="h6" sx={{ mt: 2 }}>
                  Review Text:
                </MDTypography>
                <MDTypography variant="body2">{review.reviewtext}</MDTypography>
                <Box sx={{ mt: 2, mb: 2, borderBottom: "1px solid grey" }} />
              </div>
            ))}
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
      </MDBox>
    </Container>
  );
}