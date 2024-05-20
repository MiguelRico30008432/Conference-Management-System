import * as React from "react";
import { useState, useEffect, createRef, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";

export default function UpdateSubmission({ onClose, submissionID }) {
  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState([
    { firstName: "", lastName: "", email: "", affiliation: "", authorid: "" },
  ]);

  const fileInput = createRef();

  useEffect(() => {
    async function getSubmissionData() {
      setOpenLoading(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getSubmissionInfo`,
          {
            method: "POST",
            body: JSON.stringify({
              submissionID: submissionID,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          setTitle(jsonResponse[0].submissiontitle);
          setAbstract(jsonResponse[0].submissionabstract);

          // Organize authors
          const authorsList = jsonResponse.map((item) => ({
            authorid: item.authorid,
            userid: item.userid,
            firstName: item.authorfirstname,
            lastName: item.authorlastname,
            email: item.authoremail,
            affiliation: item.authoraffiliation,
          }));

          // Find Main author
          let mainAuthor = null;
          const otherAuthors = authorsList.filter((author) => {
            if (author.userid === jsonResponse[0].submissionmainauthor) {
              mainAuthor = author;
              return false;
            }
            return true;
          });

          // Make main author first of the list
          const sortedAuthors = mainAuthor
            ? [mainAuthor, ...otherAuthors]
            : otherAuthors;

          setAuthors(sortedAuthors);
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

    getSubmissionData();
  }, [submissionID]);

  async function uploadFile(event) {
    event.preventDefault();

    setOpenLoading(true);

    if (validateInputs()) {
      const formData = new FormData();

      formData.append("confID", confID);
      formData.append("submissionid", submissionID);
      formData.append("userid", user);
      formData.append("title", title.trim());
      formData.append("abstract", abstract.trim());
      authors.forEach((author, index) => {
        formData.append(`author[${index}][firstName]`, author.firstName.trim());
        formData.append(`author[${index}][lastName]`, author.lastName.trim());
        formData.append(`author[${index}][email]`, author.email.trim());
        formData.append(
          `author[${index}][affiliation]`,
          author.affiliation.trim()
        );
        formData.append(`author[${index}][authorid]`, author.authorid);
      });

      if (fileInput.current.files[0]) {
        formData.append("file", fileInput.current.files[0]);
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/updateSubmission`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          setMessage(
            <Alert severity="success">Subimission updated with success</Alert>
          );
          onClose();
        } else {
          setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">
            Something went wrong when updating your submission.
          </Alert>
        );
      }
    } else {
      setMessage(
        <Alert severity="error">All fields marked with * are required.</Alert>
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

  function validateInputs() {
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      if (
        author.firstName === "" ||
        author.lastName === "" ||
        author.email === "" ||
        author.affiliation === ""
      ) {
        return false;
      }
    }

    if (title === "" || abstract === "") {
      return false;
    }
    return true;
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <Container maxWidth="sm">
        <MDBox mt={10} mb={2} textAlign="left">
          <MDBox mb={3} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                Update Your Submission
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                In here you have the chance of changing your submission.{" "}
                <br></br>
                The file you upload will substitute your current file.
              </MDTypography>
            </Card>

            <Card sx={{ mt: 2 }}>{message}</Card>

            {/*Author Information*/}
            {authors.map((author, index) =>
              index === 0 ? (
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
                    disabled={true}
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <TextField
                    name={`lastName${index}`}
                    required
                    fullWidth
                    label="Last Name"
                    autoFocus
                    value={author.lastName}
                    disabled={true}
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <TextField
                    name={`email${index}`}
                    required
                    fullWidth
                    label="Email"
                    autoComplete="email"
                    autoFocus
                    value={author.email}
                    disabled={true}
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />

                  <TextField
                    name={`affiliation${index}`}
                    required
                    fullWidth
                    label="Affiliation"
                    autoFocus
                    value={author.affiliation}
                    disabled={true}
                    sx={{ ml: 2, mb: 2, width: "30%" }}
                  />
                </Card>
              ) : (
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
                    value={author.email}
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
                    value={author.affiliation}
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
              )
            )}

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
                value={title}
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
                  value={abstract}
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
                <input
                  type="file"
                  className="form-control"
                  placeholder="file"
                  ref={fileInput}
                />
              </MDBox>
            </Card>

            <MDButton
              variant="gradient"
              color="success"
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
                mb: 2,
                ml: 2,
              }}
            >
              Close Update
            </MDButton>
          </MDBox>
        </MDBox>
      </Container>
    </>
  );
}
