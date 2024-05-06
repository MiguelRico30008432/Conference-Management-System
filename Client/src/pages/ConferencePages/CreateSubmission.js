import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";

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
import MDInput from "components/MDInput";

export default function CreateSubmission() {
  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [authors, setAuthors] = useState([
    { firstName: "", lastName: "", email: "", affiliation: "" },
  ]);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [file, setFile] = useState({});

  async function uploadFile(event) {
    event.preventDefault();

    setOpenLoading(true);

    const formData = new FormData();
    formData.append("confID", confID);
    formData.append("userid", user);
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("file", file);
    authors.forEach((author, index) => {
      formData.append(`author[${index}][firstName]`, author.firstName);
      formData.append(`author[${index}][lastName]`, author.lastName);
      formData.append(`author[${index}][email]`, author.email);
      formData.append(`author[${index}][affiliation]`, author.affiliation);
    });

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

  const addAuthor = () => {
    setAuthors([
      ...authors,
      { firstName: "", lastName: "", email: "", affiliation: "" },
    ]);
  };

  const handleInputChange = (index, field, value) => {
    const newAuthors = [...authors];
    newAuthors[index][field] = value;
    setAuthors(newAuthors);
  };

  const removeAuthor = (index) => {
    const newAuthors = [...authors];
    newAuthors.splice(index, 1);
    setAuthors(newAuthors);
  };

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
              {authors.map((author, index) => (
                <Card key={index} sx={{ mt: 2 }}>
                  <MDTypography ml={2} mt={1} mb={2} variant="body2">
                    Author {index + 1} Information
                  </MDTypography>

                  <TextField
                    name={`firstName${index}`}
                    required
                    fullWidth
                    label="First Name"
                    autoFocus
                    value={author.firstName}
                    onChange={(e) =>
                      handleInputChange(index, "firstName", e.target.value)
                    }
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <TextField
                    name={`lastName${index}`}
                    required
                    fullWidth
                    label="Last Name"
                    autoFocus
                    value={author.lastName}
                    onChange={(e) =>
                      handleInputChange(index, "lastName", e.target.value)
                    }
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <TextField
                    name={`email${index}`}
                    required
                    fullWidth
                    label="Email"
                    autoComplete="email"
                    autoFocus
                    onChange={(e) =>
                      handleInputChange(index, "email", e.target.value)
                    }
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <TextField
                    name={`affiliation${index}`}
                    required
                    fullWidth
                    label="Affiliation"
                    autoFocus
                    onChange={(e) =>
                      handleInputChange(index, "affiliation", e.target.value)
                    }
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <MDButton
                    variant="outlined"
                    color="error"
                    onClick={() => removeAuthor(index)}
                    sx={{ mt: 2, ml: 2, mb: 2, width: "30%" }}
                  >
                    Remove Author
                  </MDButton>
                </Card>
              ))}

              <MDButton
                variant="gradient"
                color="info"
                onClick={addAuthor}
                sx={{
                  maxWidth: "130px",
                  maxHeight: "35px",
                  minWidth: "1px",
                  minHeight: "30px",
                  mt: 2,
                  mb: 2,
                }}
              >
                Add Author
              </MDButton>

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
                    onChange={(e) => setAbstract(e.target.value)}
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
