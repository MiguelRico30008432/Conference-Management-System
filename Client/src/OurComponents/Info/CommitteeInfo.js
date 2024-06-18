import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { fetchAPI } from "OurFunctions/fetchAPI";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CommitteeInfo({ memberName, memberInfoData, onClose }) {
  const [error, setError] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);

  const [submissions, setSubmissions] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [biddings, setBiddings] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function getRows() {
      const response = await fetchAPI(
        "committeeDetailedInfo",
        "POST",
        { userid: memberInfoData.userid },
        setError,
        setOpenLoading
      );

      if (response) {
        setSubmissions(response.submissions);
        setConflicts(response.conflicts);
        setBiddings(response.biddings);
        setReviews(response.reviews);
      }
    }

    getRows();
  }, []);

  function constructSubmissions() {
    return submissions.map((submission, index) => (
      <p key={index}>{submission.submissiontitle}</p>
    ));
  }

  function constructConflicts() {
    return conflicts.map((conflict, index) => (
      <p key={index}>{conflict.submissiontitle}</p>
    ));
  }

  function constructBiddings() {
    return biddings.map((bidding, index) => (
      <p key={index}>{bidding.submissiontitle}</p>
    ));
  }

  function constructReviews() {
    return reviews.map((review, index) => (
      <p key={index}>{review.submissiontitle}</p>
    ));
  }

  return (
    <MDBox mb={3}>
      <Card>
        <MDTypography ml={2} mb={2} mt={2} variant="h6">
          Information about {memberName}
        </MDTypography>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={10}>
            <TextField
              name="First name"
              label="First name"
              autoFocus
              disabled
              value={memberInfoData.userfirstname}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "30%", md: "30%" },
              }}
            />
            <TextField
              name="Last name"
              label="Last name"
              autoFocus
              disabled
              value={memberInfoData.userlastname}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "30%", md: "30%" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={10}>
            <TextField
              name="Email"
              label="Email"
              autoFocus
              disabled
              value={memberInfoData.useremail}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "30%", md: "50%" },
              }}
            />
            <TextField
              name="Phone"
              label="Phone"
              autoFocus
              disabled
              value={memberInfoData.userphone}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "30%", md: "30%" },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={10}>
            <TextField
              name="Affiliation"
              label="Affiliation"
              autoFocus
              disabled
              value={memberInfoData.useraffiliation}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "10%", md: "10%" },
              }}
            />
            <TextField
              name="Role"
              label="Role"
              autoFocus
              disabled
              value={memberInfoData.userrole}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "5%", md: "7%" },
              }}
            />
            <TextField
              name="Add Date"
              label="Add Date"
              autoFocus
              disabled
              value={memberInfoData.useradddate}
              sx={{
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "15%", md: "15%" },
              }}
            />
          </Grid>
        </Grid>

        <MDBox ml={2} mb={1}>
          <Accordion sx={{ width: { xs: "90%", sm: "15%", md: "90%" }, mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <MDTypography variant="body2">Submitted papers:</MDTypography>
            </AccordionSummary>
            <AccordionDetails>
              <MDTypography variant="body2">
                {constructSubmissions()}
              </MDTypography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ width: { xs: "90%", sm: "15%", md: "90%" }, mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <MDTypography variant="body2">Conflicts</MDTypography>
            </AccordionSummary>
            <AccordionDetails>
              <MDTypography variant="body2">
                {constructConflicts()}
              </MDTypography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ width: { xs: "90%", sm: "15%", md: "90%" }, mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <MDTypography variant="body2">Biddings</MDTypography>
            </AccordionSummary>
            <AccordionDetails>
              <MDTypography variant="body2">{constructBiddings()}</MDTypography>
            </AccordionDetails>
          </Accordion>

          <Accordion sx={{ width: { xs: "90%", sm: "15%", md: "90%" }, mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <MDTypography variant="body2">Reviews</MDTypography>
            </AccordionSummary>
            <AccordionDetails>
              <MDTypography variant="body2">{constructReviews()}</MDTypography>
            </AccordionDetails>
          </Accordion>
        </MDBox>

        <MDButton
          variant="gradient"
          color="info"
          onClick={onClose}
          sx={{
            maxWidth: "20px",
            maxHeight: "30px",
            minWidth: "5px",
            minHeight: "30px",
            mt: 1,
            ml: 2,
            mb: 2,
          }}
        >
          Close
        </MDButton>
      </Card>
    </MDBox>
  );
}
