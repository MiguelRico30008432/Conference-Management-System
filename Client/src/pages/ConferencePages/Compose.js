import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import Footer from "OurComponents/footer/Footer";

import React, { useState, useContext } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MDBox from "components/MDBox";
import Alert from '@mui/material/Alert';

export default function Compose() {
  const { confID, userRole } = useContext(ConferenceContext);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [sendResponse, setSendResponse] = useState({ success: false, message: "" });

  const handleSendEmail = async (event) => {
    event.preventDefault();
    setRecipientError('');
    setSubjectError('');
    setDescriptionError('');
  
    if (!recipient || !subject || !description) {
      if (!recipient) setRecipientError('You must select a recipient!');
      if (!subject) setSubjectError('You must enter a subject!');
      if (!description) setDescriptionError('You must enter a description!');
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8003/sendComposeEmail", {
        method: "POST",
        body: JSON.stringify({ recipient, subject, description, confID }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });
  
      const data = await response.json();
      console.log("Response from backend:", data); // Log the response
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to send email.");
      }
  
      setSendResponse({ success: true, message: "Email sent successfully." });
      setRecipient("");
      setSubject("");
      setDescription("");
    } catch (error) {
      setSendResponse({ success: false, message: error.message || "An error occurred while sending the email." });
    }
  };

  return (
    <DashboardLayout>
      <ConfNavbar />
      <Container maxWidth="sm">
        <MDBox mt={10} textAlign="left">
          <Card>
            <MDTypography ml={2} variant="h6">
              Send Email
            </MDTypography>
            <MDTypography ml={2} variant="body2">
              Text goes here
            </MDTypography>
          </Card>
          <Card sx={{ mt: 3, p: 3 }}>
            {sendResponse.message && (
              <Alert severity={sendResponse.success ? "success" : "error"}>
                {sendResponse.message}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSendEmail} noValidate>
              <FormControl fullWidth margin="normal" variant="outlined" error={Boolean(recipientError)}>
                <MDTypography variant="body2">Send To *</MDTypography>
                <Select
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  IconComponent={ArrowDropDownIcon}
                  sx={{ height: "3rem" }}
                >
                  <MenuItem value="" disabled>Choose a Group to Send the Email</MenuItem>
                  <MenuItem value="chair">Chair</MenuItem>
                  <MenuItem value="committee">Committee</MenuItem>
                  <MenuItem value="all">Chair and Committee</MenuItem>
                </Select>
                {recipientError && <Alert severity="error">{recipientError}</Alert>}
              </FormControl>
              <FormControl fullWidth error={Boolean(subjectError)}>
                <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>Subject *</MDTypography>
                <Box
                  sx={{
                    "& textarea": {
                      width: "100%",
                      padding: "18.5px 14px",
                      fontSize: "0.9rem",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      border: "1px solid #c4c4c4",
                      borderRadius: "4px",
                      resize: "vertical",
                      marginTop: "8px",
                    }
                  }}
                >
                  <textarea
                    id="subject"
                    placeholder="Enter your subject here"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Box>
                {subjectError && <Alert severity="error">{subjectError}</Alert>}
              </FormControl>
              <FormControl fullWidth error={Boolean(descriptionError)}>
                <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>Description *</MDTypography>
                <Box
                  sx={{
                    "& textarea": {
                      width: "100%",
                      padding: "18.5px 14px",
                      fontSize: "0.9rem",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      border: "1px solid #c4c4c4",
                      borderRadius: "4px",
                      resize: "vertical",
                      marginTop: "8px",
                    }
                  }}
                >
                  <textarea
                    id="description"
                    placeholder="Enter your description here"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </Box>
                {descriptionError && <Alert severity="error">{descriptionError}</Alert>}
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: 'white !important' }} // Add color: 'white !important' here
              >
                Send Email
              </Button>
            </Box>
          </Card>
        </MDBox>
        <br></br>
      </Container>
      <Footer />
    </DashboardLayout>
  );
}