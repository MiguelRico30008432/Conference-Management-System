import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import * as React from "react";
import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MDInput from "components/MDInput";

export default function CreateSubmission() {
  const { confID } = useContext(ConferenceContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [email, setEmail] = useState(null);
  const [affiliation, setAffiliation] = useState(null);
  const [title, setTitle] = useState(null);
  const [absctract, setAbsctract] = useState(null);

  const [file, setFile] = useState({});

  async function uploadFile(event) {
    event.preventDefault();

    setOpenLoading(true);

    const formData = new FormData();
    formData.append("confID", confID);
    formData.append("file", file);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("affiliation", affiliation);
    formData.append("title", title);
    formData.append("absctract", absctract);

    try {
      const response = await fetch("http://localhost:8003/createSubmission", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      const jsonResponse = await response.json();
      if (response.status === 200) {
        setMessage(
          <Alert severity="success">Subimission created with success</Alert>
        );
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(
        <Alert severity="error">
          Something went wrong when obtaining your informations
        </Alert>
      );
    }

    setOpenLoading(false);
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <Container maxWidth="sm">
          <MDBox mt={10} mb={2} textAlign="left">
            <MDBox mb={3} textAlign="left">
              <Card>
                <MDTypography ml={2} variant="h6">
                  Create Submission
                </MDTypography>
                <MDTypography ml={2} variant="body2">
                  For each author please fill out the form below.
                </MDTypography>
              </Card>

              <Card sx={{ mt: 2 }}>{message}</Card>

              {/*Author Information*/}
              <Card sx={{ mt: 2 }}>
                <MDTypography ml={2} mt={1} mb={2} variant="body2">
                  Author Information
                </MDTypography>

                <TextField
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={{ ml: 2, mb: 2, width: "30%" }}
                />

                <TextField
                  name="lastName"
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  autoFocus
                  onChange={(e) => setLastName(e.target.value)}
                  sx={{ ml: 2, mb: 2, width: "30%" }}
                />

                <TextField
                  name="email"
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  autoComplete="email"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{ ml: 2, mb: 2, width: "30%" }}
                />

                <TextField
                  name="affiliation"
                  required
                  fullWidth
                  id="affiliation"
                  label="Affiliation"
                  autoFocus
                  onChange={(e) => setAffiliation(e.target.value)}
                  sx={{ ml: 2, mb: 2, width: "20%" }}
                />
              </Card>

              {/*Title and abstract*/}
              <Card sx={{ mt: 2 }}>
                <MDTypography ml={2} mt={1} mb={2} variant="body2">
                  Title and Abstract
                </MDTypography>
                <TextField
                  name="title"
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ ml: 2, width: "80%" }}
                />
                <MDBox
                  sx={{
                    "& textarea": {
                      width: "80%",
                      padding: "18.5px 14px",
                      fontSize: "0.9rem",
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      border: "1px solid #c4c4c4",
                      borderRadius: "4px",
                      resize: "vertical",
                      marginTop: "8px",
                      ml: 2,
                      mb: 2,
                    },
                  }}
                >
                  <MDBox ml={2} mb={2} textAlign="left"></MDBox>
                  <textarea
                    id="subject"
                    placeholder="Enter your abstract here*"
                    onChange={(e) => setAbsctract(e.target.value)}
                  />
                </MDBox>
              </Card>

              {/*Upload File*/}
              <Card sx={{ mt: 2 }}>
                <MDTypography ml={2} mt={1} mb={2} variant="body2">
                  Upload File
                </MDTypography>

                <MDBox ml={2} mb={2} textAlign="left">
                  <MDInput
                    type="file"
                    className="form-control"
                    placeholder="file"
                    onChange={(e) => {
                      setFile(e.target.files[0]);
                    }}
                  />
                </MDBox>
              </Card>

              <MDButton
                variant="gradient"
                color="info"
                onClick={async (event) => uploadFile(event)}
                sx={{
                  maxWidth: "60px",
                  maxHeight: "30px",
                  minWidth: "5px",
                  minHeight: "30px",
                  mt: 2,
                  mb: 2,
                }}
              >
                Submit
              </MDButton>
            </MDBox>
          </MDBox>
        </Container>
      </DashboardLayout>
    </>
  );
}
