import React, { useState, useContext, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import Footer from "OurComponents/footer/Footer";
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
import Alert from "@mui/material/Alert";
import LoadingCircle from "OurComponents/loading/LoadingCircle";

export default function Compose() {
  const { confID } = useContext(ConferenceContext);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [subjectError, setSubjectError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [sendResponse, setSendResponse] = useState({
    success: false,
    message: "",
  });
  const [committeeMembersExist, setCommitteeMembersExist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getData() {
      await fetch(
        `${process.env.REACT_APP_API_URL}/checkCommitteeMembers?confID=${confID}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setCommitteeMembersExist(data.committeeMembersExist);
        })
        .catch((error) => {
          console.error("Error checking committee members:", error);
        });
    }

    if (confID) {
      getData();
    }
  }, [confID]);

  const handleSendEmail = async (event) => {
    event.preventDefault();
    setRecipientError("");
    setSubjectError("");
    setDescriptionError("");
    setLoading(true);  // Start loading indicator

    if (!recipient || !subject || !description) {
      if (!recipient) setRecipientError("You must select a recipient!");
      if (!subject) setSubjectError("You must enter a subject!");
      if (!description) setDescriptionError("You must enter a description!");
      setLoading(false); // Stop loading indicator if there is an error
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/sendComposeEmail`,
        {
          method: "POST",
          body: JSON.stringify({
            recipient,
            subject,
            description: description, // no need to stringify again here
            confID: confID,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email.");
      }

      setSendResponse({ success: true, message: "Email sent successfully." });
      setRecipient("");
      setSubject("");
      setDescription("");
    } catch (error) {
      setSendResponse({
        success: false,
        message: error.message || "An error occurred while sending the email.",
      });
    }
    setLoading(false);  // Stop loading indicator
  };

  return (
    <DashboardLayout>
      <ConfNavbar />
      {loading && <LoadingCircle />}  {/* Display loading circle */}
      <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Container maxWidth="sm">
          <MDBox mt={10} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                Send Email
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                Here you can send an email to either the chair, committee
                members or both. The subject and description are to your liking
                so the text is according to the theme in the subject you
                mention.
              </MDTypography>
            </Card>
            <Card sx={{ mt: 3, p: 3 }}>
              {sendResponse.message && (
                <Alert severity={sendResponse.success ? "success" : "error"}>
                  {sendResponse.message}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSendEmail} noValidate>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={Boolean(recipientError)}
                >
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
                    <MenuItem value="" disabled>
                      Choose a Group to Send the Email
                    </MenuItem>
                    <MenuItem value="chair">Chair</MenuItem>
                    {committeeMembersExist && (
                      <MenuItem value="committee">Committee</MenuItem>
                    )}
                    {committeeMembersExist && (
                      <MenuItem value="all">Chair and Committee</MenuItem>
                    )}
                  </Select>
                  {recipientError && (
                    <Alert severity="error">{recipientError}</Alert>
                  )}
                </FormControl>
                <FormControl fullWidth error={Boolean(subjectError)}>
                  <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                    Subject *
                  </MDTypography>
                  <Box
                    sx={{
                      "& textarea": {
                        width: "100%",
                        padding: "18.5px 14px",
                        fontSize: "0.9rem",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        resize: "none",
                        marginTop: "8px",
                      },
                    }}
                  >
                    <textarea
                      id="subject"
                      placeholder="Enter your subject here"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      rows={1}
                    />
                  </Box>
                  {subjectError && (
                    <Alert severity="error">{subjectError}</Alert>
                  )}
                </FormControl>
                <FormControl fullWidth error={Boolean(descriptionError)}>
                  <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                    Description *
                  </MDTypography>
                  <Box
                    sx={{
                      "& textarea": {
                        width: "100%",
                        padding: "18.5px 14px",
                        fontSize: "0.9rem",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        resize: "vertical",
                        marginTop: "8px",
                      },
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
                  {descriptionError && (
                    <Alert severity="error">{descriptionError}</Alert>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, color: "white !important" }}
                >
                  Send Email
                </Button>
              </Box>
            </Card>
          </MDBox>
          <br />
        </Container>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}