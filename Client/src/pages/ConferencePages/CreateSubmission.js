import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import * as React from "react";
import { useState, useContext, useEffect, createRef } from "react";
import Footer from "OurComponents/footer/Footer";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import BlockPageForConfStatus from "OurComponents/errorHandling/BlockPageForConfStatus";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";

export default function CreateSubmission() {
  const { confID, confPhase } = useContext(ConferenceContext);
  const { user, isLoggedIn } = useContext(AuthContext);

  const [authors, setAuthors] = useState([
    { firstName: "", lastName: "", email: "", affiliation: "" },
  ]);
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");

  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openPopUpMessage, setOpenPopUpMessage] = useState(false);
  const [blockCrud, setBlockCrud] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [uploadButtonClicked, setUploadButtonClicked] = useState(false);

  const fileInput = createRef();

  useEffect(() => {
    async function getAuthorData() {
      setOpenLoading(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getAuthorData`,
          {
            method: "POST",
            body: JSON.stringify({ userID: user }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          setAuthors([
            {
              firstName: jsonResponse[0].userfirstname,
              lastName: jsonResponse[0].userlastname,
              email: jsonResponse[0].useremail,
              affiliation: jsonResponse[0].useraffiliation,
            },
          ]);
        } else {
          setMessage(`${jsonResponse.msg}`);
        }
      } catch {
        setMessage("Something went wrong when obtaining your information.");
      }
      setOpenLoading(false);
    }

    if (isLoggedIn && confID && confPhase) {
      if (confPhase !== "Submission") setBlockCrud(true);
      else getAuthorData();
    }
  }, [isLoggedIn, confID, confPhase, user]);

  useEffect(() => {
    if (message !== null) setOpenPopUpMessage(true);
    else setOpenPopUpMessage(false);
  }, [message]);

  useEffect(() => {
    if (title !== "" && abstract !== "" && uploadButtonClicked)
      setDisableSubmit(false);
    else setDisableSubmit(true);
  }, [title, abstract, uploadButtonClicked]);

  async function uploadFile(event) {
    event.preventDefault();

    if (!inputsAreOk()) {
      setMessage("All fields marked with * are required.");
      return;
    }

    if (authorsDuplicated()) {
      setMessage("There are duplicated authors!");
      return;
    }

    setOpenLoading(true);

    const formData = new FormData();
    formData.append("confID", confID);
    formData.append("userid", user);
    formData.append("title", title.trim());
    formData.append("abstract", abstract.trim());
    formData.append("file", fileInput.current.files[0]);
    authors.forEach((author, index) => {
      formData.append(`author[${index}][firstName]`, author.firstName);
      formData.append(`author[${index}][lastName]`, author.lastName);
      formData.append(`author[${index}][email]`, author.email);
      formData.append(`author[${index}][affiliation]`, author.affiliation);
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/createSubmission`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const jsonResponse = await response.json();
      if (response.status === 200) {
        setMessage("Submission created with success");
        resetToDefaultValues();
      } else {
        setMessage(`${jsonResponse.msg}`);
      }
    } catch (error) {
      setMessage("Something went wrong when obtaining your informations");
    }

    setOpenLoading(false);
  }

  function resetToDefaultValues() {
    setTitle("");
    setAbstract("");
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

  function authorsDuplicated() {
    for (let author of authors) {
      const duplicatedAuthors = authors.filter((x) => x.email === author.email);
      if (duplicatedAuthors.length > 1) {
        setMessage("There are duplicated authors!");
        return true;
      }
    }

    return false;
  }

  function inputsAreOk() {
    for (let author of authors) {
      if (
        author.firstName === "" ||
        author.lastName === "" ||
        author.email === "" ||
        author.affiliation === ""
      ) {
        return false;
      }
    }

    if (title === "" || abstract === "" || fileInput.current.files[0] === "") {
      return false;
    }

    return true;
  }

  return (
    <>
      <PopUpWithMessage
        open={openPopUpMessage}
        handleClose={() => setOpenPopUpMessage(false)}
        justOneButton={true}
        negativeButtonName={"Ok"}
        title={"Information"}
        text={message}
      />

      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              <MDBox mb={3} textAlign="left">
                {!blockCrud && (
                  <>
                    <Card>
                      <MDTypography ml={2} variant="h6">
                        Create Submission
                      </MDTypography>
                      <MDTypography ml={2} variant="body2">
                        For each author, please fill out the form below. In the
                        end, click "Submit" to create your submission. If you
                        need to change something afterward, do not worry, you
                        can update it on the "My Submissions" page. <br></br>
                        Atention: We only accept PDF files.
                      </MDTypography>
                    </Card>

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
                            value={author.email}
                            disabled={true}
                            sx={{ ml: 2, mb: 2, width: "30%" }}
                          />

                          <TextField
                            name={`affiliation${index}`}
                            required
                            fullWidth
                            label="Affiliation"
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
                              handleInputChange(
                                index,
                                "firstName",
                                e.target.value
                              )
                            }
                            inputProps={{ maxLength: 50 }}
                            sx={{ ml: 2, mb: 2, width: "30%" }}
                          />

                          <TextField
                            name={`lastName${index}`}
                            required
                            fullWidth
                            label="Last Name"
                            value={author.lastName}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "lastName",
                                e.target.value
                              )
                            }
                            inputProps={{ maxLength: 50 }}
                            sx={{ ml: 2, mb: 2, width: "30%" }}
                          />

                          <TextField
                            name={`email${index}`}
                            required
                            fullWidth
                            label="Email"
                            autoComplete="email"
                            onChange={(e) =>
                              handleInputChange(index, "email", e.target.value)
                            }
                            inputProps={{ maxLength: 100 }}
                            sx={{ ml: 2, mb: 2, width: "30%" }}
                          />

                          <TextField
                            name={`affiliation${index}`}
                            required
                            fullWidth
                            label="Affiliation"
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "affiliation",
                                e.target.value
                              )
                            }
                            inputProps={{ maxLength: 20 }}
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
                        inputProps={{ maxLength: 255 }}
                      />
                      <MDBox
                        sx={{
                          "& textarea": {
                            width: "80%",
                            padding: "18.5px 14px",
                            fontSize: "0.9rem",
                            fontFamily:
                              '"Roboto", "Helvetica", "Arial", sans-serif',
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
                          accept=".pdf"
                          ref={fileInput}
                          onClick={() => setUploadButtonClicked(true)}
                        />
                      </MDBox>
                    </Card>

                    <MDButton
                      variant="gradient"
                      color="success"
                      onClick={async (event) => uploadFile(event)}
                      disabled={disableSubmit}
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
                  </>
                )}

                {blockCrud && (
                  <>
                    <BlockPageForConfStatus
                      text={
                        "It seems that this conference is not in the submission phase"
                      }
                    />
                  </>
                )}
              </MDBox>
            </MDBox>
          </Container>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
