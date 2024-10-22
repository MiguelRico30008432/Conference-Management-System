import * as React from "react";
import { useState, useEffect, createRef, useContext } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import TextField from "@mui/material/TextField";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";

export default function UpdateSubmission({ onClose, submissionID }) {
  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [originalTitle, setOriginalTitle] = useState("");

  const [abstract, setAbstract] = useState("");
  const [originalAbstract, setOriginalAbstract] = useState("");
  const [authors, setAuthors] = useState([
    { firstName: "", lastName: "", email: "", affiliation: "", authorid: "" },
  ]);
  const [originalAuthors, setOriginalAuthors] = useState([]);

  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [openPopUpMessage, setOpenPopUpMessage] = useState(false);
  const [openPopUpUnsavedChanges, setOpenPopUpUnsavedChanges] = useState(false);

  const [disableSubmit, setDisableSubmit] = useState(true);
  const [uploadButtonClicked, setUploadButtonClicked] = useState(false);

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
          setOriginalTitle(jsonResponse[0].submissiontitle);
          setOriginalAbstract(jsonResponse[0].submissionabstract);

          const authorsList = jsonResponse.map((item) => ({
            authorid: item.authorid,
            userid: item.userid,
            firstName: item.authorfirstname,
            lastName: item.authorlastname,
            email: item.authoremail,
            affiliation: item.authoraffiliation,
          }));

          const deepCopyAuthors = JSON.parse(JSON.stringify(authorsList));

          let mainAuthor = null;
          const otherAuthors = deepCopyAuthors.filter((author) => {
            if (author.userid === jsonResponse[0].submissionmainauthor) {
              mainAuthor = author;
              return false;
            }
            return true;
          });

          const sortedAuthors = mainAuthor
            ? [mainAuthor, ...otherAuthors]
            : otherAuthors;

          setAuthors(sortedAuthors);
          setOriginalAuthors(JSON.parse(JSON.stringify(sortedAuthors)));
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

  useEffect(() => {
    if (message !== null) setOpenPopUpMessage(true);
    else setOpenPopUpMessage(false);
  }, [message]);

  function hasChanges() {
    if (
      title !== originalTitle ||
      abstract !== originalAbstract ||
      JSON.stringify(authors) !== JSON.stringify(originalAuthors)
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    setDisableSubmit(!hasChanges());
  }, [
    title,
    abstract,
    uploadButtonClicked,
    authors,
    originalTitle,
    originalAbstract,
    originalAuthors,
  ]);

  function resetToDefaultValues() {
    setUploadButtonClicked(false);
  }

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
        setMessage("Submission updated successfully");

        // Update original values to reflect the updated state
        setOriginalTitle(title.trim());
        setOriginalAbstract(abstract.trim());
        setOriginalAuthors(JSON.parse(JSON.stringify(authors)));

        resetToDefaultValues();
        onClose();
      } else {
        setMessage(`${jsonResponse.msg}`);
      }
    } catch (error) {
      setMessage("Something went wrong when updating your submission.");
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

  function inputsAreOk() {
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

  function authorsDuplicated() {
    for (let author of authors) {
      const duplicatedAuthors = authors.filter((x) => x.email === author.email);
      if (duplicatedAuthors.length > 1) {
        setMessage(" There are duplicated authors!");
        return true;
      }
    }

    return false;
  }

  function verifyCloseComponent() {
    if (hasChanges()) setOpenPopUpUnsavedChanges(true);
    else onClose();
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

      <PopUpWithMessage
        open={openPopUpUnsavedChanges}
        negativeButtonName={"Cancel"}
        handleClose={() => setOpenPopUpUnsavedChanges(false)}
        affirmativeButtonName={"Yes, I'm Sure"}
        handleConfirm={onClose}
        title={"Changes not saved!"}
        text={
          "Wait! You are about to lose your unsaved submission, are you sure do you want to go back?"
        }
      />

      {openLoading && <LoadingCircle />}

      <MDButton
        variant="gradient"
        color="info"
        onClick={() => verifyCloseComponent()}
        sx={{
          maxWidth: "140px",
          maxHeight: "30px",
          minWidth: "5px",
          minHeight: "30px",
          mb: 2,
        }}
      >
        Close Update
      </MDButton>

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
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <TextField
              name={`lastName${index}`}
              required
              fullWidth
              label="Last Name"
              value={author.lastName}
              disabled={true}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <TextField
              name={`email${index}`}
              required
              fullWidth
              label="Email"
              autoComplete="email"
              value={author.email}
              disabled={true}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <TextField
              name={`affiliation${index}`}
              required
              fullWidth
              label="Affiliation"
              value={author.affiliation}
              disabled={true}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
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
              value={author.firstName}
              onChange={(e) =>
                handleInputChange(index, "firstName", e.target.value)
              }
              inputProps={{ maxLength: 50 }}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <TextField
              name={`lastName${index}`}
              required
              fullWidth
              label="Last Name"
              value={author.lastName}
              onChange={(e) =>
                handleInputChange(index, "lastName", e.target.value)
              }
              inputProps={{ maxLength: 50 }}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <TextField
              name={`email${index}`}
              required
              fullWidth
              label="Email"
              autoComplete="email"
              value={author.email}
              onChange={(e) =>
                handleInputChange(index, "email", e.target.value)
              }
              inputProps={{ maxLength: 100 }}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <TextField
              name={`affiliation${index}`}
              required
              fullWidth
              label="Affiliation"
              value={author.affiliation}
              onChange={(e) =>
                handleInputChange(index, "affiliation", e.target.value)
              }
              inputProps={{ maxLength: 20 }}
              sx={{ ml: 2, mb: 2, width: { xs: "90%", sm: "30%", md: "30%" } }}
            />

            <MDButton
              variant="outlined"
              color="error"
              onClick={() => removeAuthor(index)}
              sx={{
                mt: 2,
                ml: 2,
                mb: 2,
                width: { xs: "90%", sm: "30%", md: "30%" },
              }}
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
  );
}
