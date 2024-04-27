import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import Footer from "OurComponents/footer/Footer";


import * as React from "react";
import { useState, useContext } from "react";
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
import FormHelperText from "@mui/material/FormHelperText"; // Import FormHelperText


export default function Compose() {
  const { confID, userRole } = useContext(ConferenceContext);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [recipientError, setRecipientError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);

  const handleSendEmail = async (event) => {
    event.preventDefault();
    if (!recipient || !subject || !description) {
      setRecipientError(!recipient);
      setSubjectError(!subject);
      setDescriptionError(!description);
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8003/sendComposeEmail", {
        method: "POST",
        body: JSON.stringify({recipient,subject,description,confID,}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to send email.");
      }
  
      // Reset form fields and errors upon successful email send
      setRecipient("");
      setSubject("");
      setDescription("");
      setRecipientError(false);
      setSubjectError(false);
      setDescriptionError(false);
  
      // Handle success message or any further action upon successful email send
      console.log("Email sent successfully.");
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
    setRecipientError(false);
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
    setSubjectError(false);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    setDescriptionError(false);
  };

  return (
    <DashboardLayout>
      <ConfNavbar />
      <Container maxWidth="sm">
        <MDBox mt={10} textAlign="left">
          <MDBox textAlign="left">
            <Card sx={{ mt: 3, p: 3 }}>
              <MDTypography ml={2} variant="h6">
                Email Composition
                <br></br>
                <br></br>
              </MDTypography>
              <Box component="form" onSubmit={handleSendEmail} noValidate>
                <MDTypography variant="body2">Send To *</MDTypography>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  sx={{ width: "100%" }}
                  error={recipientError}
                >
                  <Select
                    id="recipient"
                    value={recipient}
                    onChange={handleRecipientChange}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={() => <ArrowDropDownIcon />}
                    sx={{ height: "3rem" }}
                    required
                  >
                    <MenuItem value="" disabled>
                      Choose a Group to Send the Email
                    </MenuItem>
                    <MenuItem value="chair">Chair</MenuItem>
                    <MenuItem value="committee">Committee</MenuItem>
                  </Select>
                  {recipientError && <FormHelperText sx={{ color: "red" }}>Please select a recipient</FormHelperText>}
                </FormControl>
                <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                  Subject *
                </MDTypography>
                <Box
                  sx={{
                    "& textarea": {
                      width: "100%",
                      padding: "18.5px 14px",
                      fontSize: "0.9rem",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      border: "1px solid #c4c4c4",
                      borderRadius: "4px",
                      "&:focus": {
                        outline: "2px solid #3f51b5",
                        borderColor: "transparent",
                      },
                      resize: "vertical",
                    },
                    color: subjectError ? "red" : "inherit", // Change text color to red if there is an error
                  }}
                >
                  <textarea
                    aria-label="Subject"
                    rows={1}
                    placeholder="Enter your subject here"
                    value={subject}
                    onChange={handleSubjectChange}
                    required
                  />
                  {subjectError && <FormHelperText sx={{ color: "red" }}>Please enter a subject</FormHelperText>}
                </Box>
                <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                  Description *
                </MDTypography>
                <Box
                  sx={{
                    "& textarea": {
                      width: "100%",
                      padding: "18.5px 14px",
                      fontSize: "0.9rem",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      border: "1px solid #c4c4c4",
                      borderRadius: "4px",
                      "&:focus": {
                        outline: "2px solid #3f51b5",
                        borderColor: "transparent",
                      },
                      resize: "vertical",
                    },
                    color: descriptionError ? "red" : "inherit", // Change text color to red if there is an error
                  }}
                >
                  <textarea
                    aria-label="Description"
                    rows={4}
                    placeholder="Enter your description here"
                    value={description}
                    onChange={handleDescriptionChange}
                    required
                  />
                  {descriptionError && <FormHelperText sx={{ color: "red" }}>Please enter a description</FormHelperText>}
                </Box>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2, color: "white !important" }}
                >
                  Send Email
                </Button>
              </Box>
            </Card>
          </MDBox>
        </MDBox>
      </Container>
      <br></br>
      <Footer />
    </DashboardLayout>
  );
}