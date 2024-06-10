import * as React from "react";
import { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";

export default function ReviewsDone({ onClose }) {
  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchReview() {
      setOpenLoading(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getSubmissionInfo`,
          {
            method: "POST",
            body: JSON.stringify({}),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
        } else {
          setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }
      } catch {
        setMessage(
          <Alert severity="error">
            Something went wrong when obtaining the submission information.
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    fetchReview();
  }, []);

  return (
    <>
      {openLoading && <LoadingCircle />}
      <Container maxWidth="sm">
        <MDBox mt={10} mb={2} textAlign="left">
          <MDBox mb={3} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                My Reviews
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                text goes here
              </MDTypography>
            </Card>
          </MDBox>
        </MDBox>

        <Card sx={{ mt: 2, mb: 2 }}>{message}</Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <MDTypography ml={2} mb={2} mt={2} variant="body2">
                Title
              </MDTypography>
              <MDTypography ml={2} mb={2} mt={2} variant="body2">
                Abstract
              </MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <MDTypography ml={2} mb={2} mt={2} variant="body2">
                Review
              </MDTypography>

              <Box
                sx={{
                  "& textarea": {
                    padding: "18.5px 14px",
                    fontSize: "0.9rem",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    border: "1px solid #c4c4c4",
                    borderRadius: "4px",
                    resize: "vertical",
                    width: "90%",
                    ml: 2,
                    mr: 2,
                    mb: 2,
                  },
                }}
              >
                <textarea
                  id="description"
                  placeholder="Enter your description here"
                  rows={4}
                />
              </Box>

              <Select value={0} sx={{ ml: 2, mr: 2, mb: 2 }}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </Card>
          </Grid>
        </Grid>

        <MDButton
          variant="gradient"
          color="info"
          onClick={onClose}
          sx={{
            maxWidth: "140px",
            maxHeight: "30px",
            minWidth: "5px",
            minHeight: "30px",
            mt: 2,
            ml: 2,
            mb: 2,
          }}
        >
          Close Review
        </MDButton>
      </Container>
    </>
  );
}
