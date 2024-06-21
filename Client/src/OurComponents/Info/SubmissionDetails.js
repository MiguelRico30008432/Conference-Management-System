import React, { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import { fetchAPI } from "OurFunctions/fetchAPI";

export default function SubmissionDetails({
  onClose,
  submission,
  userid,
  confid,
  getUpdatedAuthors = true,
}) {
  const [error, setError] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);

  const [authors, setAuthors] = useState("");

  useEffect(() => {
    async function getAuthors() {
      const response = await fetchAPI(
        "authors",
        "POST",
        { userID: userid, confID: confid },
        setError,
        setOpenLoading
      );

      if (response) {
        setAuthors(response[0].authors);
      }
    }

    if (userid && confid && getUpdatedAuthors) getAuthors();
    else setAuthors(submission.authors);
  }, [userid, confid, getUpdatedAuthors]);

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
        <MDTypography variant="body2">{authors}</MDTypography>
        <MDTypography variant="h6" sx={{ mt: 2 }}>
          Status:
        </MDTypography>
        <MDTypography variant="body2">{submission.status}</MDTypography>
        <MDTypography variant="h6" sx={{ mt: 2 }}>
          Submission Date:
        </MDTypography>
        <MDTypography variant="body2">{submission.adddate}</MDTypography>
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
