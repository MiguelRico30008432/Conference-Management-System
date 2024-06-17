import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Footer from "OurComponents/footer/Footer";
import { FormControlLabel, Checkbox } from "@mui/material";

export default function DefinitionsPage() {
  const { confID } = useContext(ConferenceContext);
  const { isLoggedIn } = useContext(AuthContext);

  const currentDate = new Date().toISOString().split("T")[0]; // Valor base para a data minima que o calendário vai mostrar

  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [editModeActive, setEditModeActive] = useState(false);

  //original value
  const [name, setName] = useState("");
  const [webpage, setWebpage] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [contact, setContact] = useState("");
  const [submissionsStart, setSubmissionStart] = useState("");
  const [submissionsEnd, setSubmissionEnd] = useState("");
  const [biddingStart, setBiddingStart] = useState("");
  const [biddingEnd, setBiddingEnd] = useState("");
  const [reviewStart, setReviewStart] = useState("");
  const [reviewEnd, setReviewEnd] = useState("");
  const [confStart, setConfStart] = useState("");
  const [confEnd, setConfEnd] = useState("");
  const [submissionUpdate, setSubmissionUpdate] = useState("");

  //new values
  const [newName, setNewName] = useState("");
  const [newWebpage, setNewWebpage] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newSubmissionsStart, setNewSubmissionStart] = useState("");
  const [newSubmissionsEnd, setNewSubmissionEnd] = useState("");
  const [newBiddingStart, setNewBiddingStart] = useState("");
  const [newBiddingEnd, setNewBiddingEnd] = useState("");
  const [newReviewStart, setNewReviewStart] = useState("");
  const [newReviewEnd, setNewReviewEnd] = useState("");
  const [newConfStart, setNewConfStart] = useState("");
  const [newConfEnd, setNewConfEnd] = useState("");
  const [newSubmissionUpdate, setNewSubmissionUpdate] = useState("");

  useEffect(() => {
    async function getConfData() {
      setOpenLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/confDefinitions`,
          {
            method: "POST",
            body: JSON.stringify({ confid: confID }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          setName(jsonResponse[0].confname);
          setNewName(jsonResponse[0].confname);

          setWebpage(jsonResponse[0].confwebpage);
          setNewWebpage(jsonResponse[0].confwebpage);

          setCity(jsonResponse[0].confcity);
          setNewCity(jsonResponse[0].confcity);

          setCountry(jsonResponse[0].confcountry);
          setNewCountry(jsonResponse[0].confcountry);

          setContact(jsonResponse[0].confcontact);
          setNewContact(jsonResponse[0].confcontact);

          setSubmissionStart(formatDate(jsonResponse[0].confstartsubmission));
          setNewSubmissionStart(
            formatDate(jsonResponse[0].confstartsubmission)
          );

          setSubmissionEnd(formatDate(jsonResponse[0].confendsubmission));
          setNewSubmissionEnd(formatDate(jsonResponse[0].confendsubmission));

          setBiddingStart(formatDate(jsonResponse[0].confstartbidding));
          setNewBiddingStart(formatDate(jsonResponse[0].confstartbidding));

          setBiddingEnd(formatDate(jsonResponse[0].confendbidding));
          setNewBiddingEnd(formatDate(jsonResponse[0].confendbidding));

          setReviewStart(formatDate(jsonResponse[0].confstartreview));
          setNewReviewStart(formatDate(jsonResponse[0].confstartreview));

          setReviewEnd(formatDate(jsonResponse[0].confendreview));
          setNewReviewEnd(formatDate(jsonResponse[0].confendreview));

          setConfStart(formatDate(jsonResponse[0].confstartdate));
          setNewConfStart(formatDate(jsonResponse[0].confstartdate));

          setConfEnd(formatDate(jsonResponse[0].confenddate));
          setNewConfEnd(formatDate(jsonResponse[0].confenddate));

          setSubmissionUpdate(jsonResponse[0].confsubupdate);
          setNewSubmissionUpdate(jsonResponse[0].confsubupdate);
        } else {
          setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }
      } catch {
        setMessage(
          <Alert severity="error">
            Something went wrong when obtaining the conference definitions
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    if (isLoggedIn && confID) {
      getConfData();
    }
  }, [isLoggedIn, confID]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const formattedDate = date.toISOString().split("T")[0];
      return formattedDate;
    } catch (error) {
      return dateString;
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();
    if (makeRequest() && valideInputs() && datesBetweenStarEndVerifications()) {
      setEditModeActive(false);
      await saveUserData();
    }
  }

  function makeRequest() {
    if (
      name !== newName ||
      webpage !== newWebpage ||
      city !== newCity ||
      country !== newCountry ||
      contact !== newContact ||
      submissionsStart !== newSubmissionsStart ||
      submissionsEnd !== newSubmissionsEnd ||
      biddingStart !== newBiddingStart ||
      biddingEnd !== newBiddingEnd ||
      reviewStart !== newReviewStart ||
      reviewEnd !== newReviewEnd ||
      confStart !== newConfStart ||
      confEnd !== newConfEnd ||
      submissionUpdate !== newSubmissionUpdate
    ) {
      return true;
    } else {
      setMessage(<Alert severity="error">No changes were registered!</Alert>);
      return false;
    }
  }

  function valideInputs() {
    if (
      newName === "" ||
      newCity === "" ||
      newCountry === "" ||
      newContact === "" ||
      newSubmissionsStart === "" ||
      newSubmissionsEnd === "" ||
      newBiddingStart === "" ||
      newBiddingEnd === "" ||
      newReviewStart === "" ||
      newReviewEnd === "" ||
      newConfStart === "" ||
      newConfEnd === "" ||
      newReviewEnd === "" ||
      newSubmissionUpdate === ""
    ) {
      setMessage(
        <Alert severity="error">All fields marked with * are required.</Alert>
      );
      return false;
    } else {
      return true;
    }
  }

  async function saveUserData() {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/saveConfDefinitions`,
        {
          method: "POST",
          body: JSON.stringify({
            confid: confID,
            confname: newName,
            confwebpage: newWebpage,
            confcity: newCity,
            confcountry: newCountry,
            confcontact: newContact,
            confstartsubmission: newSubmissionsStart,
            confendsubmission: newSubmissionsEnd,
            confstartbidding: newBiddingStart,
            confendbidding: newBiddingEnd,
            confstartreview: newReviewStart,
            confendreview: newReviewEnd,
            confstartdate: newConfStart,
            confenddate: newConfEnd,
            confsubupdate: newSubmissionUpdate,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      const jsonResponse = await response.json();

      if (response.status === 200) {
        setMessage(
          <Alert severity="success">
            {"Your conference definitions were saved."}
          </Alert>
        );

        setName(newName);
        setWebpage(newWebpage);
        setCity(newCity);
        setCountry(newCountry);
        setContact(newContact);
        setSubmissionStart(newSubmissionsStart);
        setSubmissionEnd(newSubmissionsEnd);
        setBiddingStart(newBiddingStart);
        setBiddingEnd(newBiddingEnd);
        setReviewStart(newReviewStart);
        setReviewEnd(newReviewEnd);
        setConfStart(newConfStart);
        setConfEnd(newConfEnd);
        setSubmissionUpdate(newSubmissionUpdate);
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

  function datesBetweenStarEndVerifications() {
    //---------------------Submissions------------------//
    if (newSubmissionsEnd <= newSubmissionsStart) {
      setMessage(
        <Alert severity="error">
          Submission End Date must be after Submission Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Bidding------------------//
    if (newBiddingEnd <= newBiddingStart) {
      setMessage(
        <Alert severity="error">
          Bidding End Date must be after Bidding Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Reviews------------------//
    if (newReviewEnd <= newReviewStart) {
      setMessage(
        <Alert severity="error">
          Review End Date must be after Review Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Conference------------------//
    if (newConfEnd <= newConfStart) {
      setMessage(
        <Alert severity="error">
          Conference End Date must be after Conference Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Between Them------------------//
    if (
      newSubmissionsStart >= newBiddingStart ||
      newSubmissionsStart >= newBiddingEnd ||
      newSubmissionsStart >= newReviewStart ||
      newSubmissionsStart >= newReviewEnd ||
      newSubmissionsStart >= newConfStart ||
      newSubmissionsStart >= newConfEnd ||
      newSubmissionsEnd >= newBiddingStart ||
      newSubmissionsEnd >= newBiddingEnd ||
      newSubmissionsEnd >= newReviewStart ||
      newSubmissionsEnd >= newReviewEnd ||
      newSubmissionsEnd >= newConfStart ||
      newSubmissionsEnd >= newConfEnd
    ) {
      setMessage(
        <Alert severity="error">
          Biddings / Reviews / Conference dates must be after Submissions Dates
        </Alert>
      );
      return false;
    }

    if (
      newBiddingStart >= newReviewStart ||
      newBiddingStart >= newReviewEnd ||
      newBiddingStart >= newConfStart ||
      newBiddingStart >= newConfEnd ||
      newBiddingEnd >= newReviewStart ||
      newBiddingEnd >= newReviewEnd ||
      newBiddingEnd >= newConfStart ||
      newBiddingEnd >= newConfEnd
    ) {
      setMessage(
        <Alert severity="error">
          Reviews / Conference dates must be after Bidding Dates
        </Alert>
      );
      return false;
    }

    if (
      newReviewStart >= newConfStart ||
      newReviewStart >= newConfEnd ||
      newReviewEnd >= newConfStart ||
      newReviewEnd >= newConfEnd
    ) {
      setMessage(
        <Alert severity="error">
          Conference dates must be after Review Dates
        </Alert>
      );
      return false;
    }
    return true;
  }

  function isDatePast(dateToCompare) {
    return dateToCompare < currentDate;
  }

  function addOneDay(dateToAdd) {
    const date = new Date(dateToAdd);
    date.setDate(date.getDate() + 1);
    const updatedDate = formatDate(date);
    return updatedDate;
  }

  async function handleUpdateConflicts() {
    setOpenLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/determineConflicts`,
        {
          method: "POST",
          body: JSON.stringify({
            confid: confID,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      if (response.status === 200) {
        setMessage(
          <Alert severity="success">Conflicts list has been updated.</Alert>
        );
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

  async function handleAssignmentAlgorithm() {
    setOpenLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reviewsAssignmentsAlgorithm`,
        {
          method: "POST",
          body: JSON.stringify({
            confid: confID,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      if (response.status === 200) {
        setMessage(
          <Alert severity="success">
            Reviews Assignments list has been updated.
          </Alert>
        );
      }
    } catch (error) {
      setMessage(
        <Alert severity="error">
          Something went wrong running the algorithm
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
                  Definitions
                </MDTypography>
                <MDTypography ml={2} variant="body2">
                  To edit details from your conference simply click on 'edit'
                </MDTypography>
              </Card>
            </MDBox>

            {message}

            <MDBox mb={3} textAlign="left">
              <MDButton
                variant="gradient"
                color="info"
                sx={{ mt: 2, mb: 2 }}
                onClick={() => {
                  setEditModeActive(true);
                  setMessage(null);
                }}
              >
                Edit Conference Definitions
              </MDButton>

              <MDButton
                variant="gradient"
                color="success"
                onClick={async () => handleUpdateConflicts()}
                sx={{
                  maxWidth: "300px",
                  maxHeight: "100px",
                  minWidth: "5px",
                  minHeight: "30px",
                  mt: 2,
                  mb: 2,
                  ml: 2,
                }}
              >
                Check for Conflicts
              </MDButton>

              <MDButton
                variant="gradient"
                color="success"
                onClick={async () => handleAssignmentAlgorithm()}
                sx={{
                  maxWidth: "300px",
                  maxHeight: "100px",
                  minWidth: "5px",
                  minHeight: "30px",
                  mt: 2,
                  mb: 2,
                  ml: 2,
                }}
              >
                Run Review Assignment Algorithm
              </MDButton>

              <Card sx={{ maxWidth: 1400 }}>
                <MDBox mt={1} mb={1} textAlign="center"></MDBox>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        name="confname"
                        required
                        fullWidth
                        id="confname"
                        label="Conference Name"
                        autoFocus
                        InputLabelProps={{ shrink: true }}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        disabled={!editModeActive}
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        id="confwebpage"
                        label="Conference Web Page"
                        name="confwebpage"
                        InputLabelProps={{ shrink: true }}
                        value={newWebpage}
                        onChange={(e) => setNewWebpage(e.target.value)}
                        disabled={!editModeActive}
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confcity"
                        label="City"
                        name="confcity"
                        InputLabelProps={{ shrink: true }}
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        disabled={!editModeActive}
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confcountry"
                        label="Country"
                        name="confcountry"
                        InputLabelProps={{ shrink: true }}
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        disabled={!editModeActive}
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confcontact"
                        label="Support Contact"
                        name="confcontact"
                        InputLabelProps={{ shrink: true }}
                        value={newContact}
                        disabled={!editModeActive}
                        onChange={(e) => setNewContact(e.target.value)}
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <FormControl fullWidth>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={newSubmissionUpdate}
                              onChange={(e) =>
                                setNewSubmissionUpdate(e.target.checked)
                              }
                              disabled={!editModeActive}
                              sx={{ ml: -1 }}
                            />
                          }
                          label="Submissions Update"
                          sx={{
                            ml: 2,
                            mt: 2,
                            width: "90%",
                            alignItems: "center",
                            "& .MuiFormControlLabel-label": {
                              fontWeight: "normal",
                            },
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confstartsubmission"
                        label="Submissions Start Date"
                        name="confstartsubmission"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: currentDate }}
                        value={newSubmissionsStart}
                        disabled={
                          !editModeActive || isDatePast(submissionsStart)
                        }
                        onChange={(e) =>
                          setNewSubmissionStart(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confendsubmission"
                        label="Submissions End Date"
                        name="confendsubmission"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newSubmissionsStart) }}
                        value={newSubmissionsEnd}
                        disabled={!editModeActive || isDatePast(submissionsEnd)}
                        onChange={(e) =>
                          setNewSubmissionEnd(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confstartbidding"
                        label="Bidding Start Date"
                        name="confstartbidding"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newSubmissionsEnd) }}
                        value={newBiddingStart}
                        disabled={!editModeActive || isDatePast(biddingStart)}
                        onChange={(e) =>
                          setNewBiddingStart(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confendbidding"
                        label="Bidding End Date"
                        name="confendbidding"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newBiddingStart) }}
                        value={newBiddingEnd}
                        disabled={!editModeActive || isDatePast(biddingEnd)}
                        onChange={(e) =>
                          setNewBiddingEnd(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confstartreview"
                        label="Reviews Start Date"
                        name="confstartreview"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newBiddingEnd) }}
                        value={newReviewStart}
                        disabled={!editModeActive || isDatePast(reviewStart)}
                        onChange={(e) =>
                          setNewReviewStart(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confendreview"
                        label="Reviews End Date"
                        name="confendreview"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newReviewStart) }}
                        value={newReviewEnd}
                        disabled={!editModeActive || isDatePast(reviewEnd)}
                        onChange={(e) =>
                          setNewReviewEnd(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confstartdate"
                        label="Conferance Start Date"
                        name="confstartdate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newReviewEnd) }}
                        value={newConfStart}
                        disabled={!editModeActive || isDatePast(confStart)}
                        onChange={(e) =>
                          setNewConfStart(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        required
                        fullWidth
                        id="confenddate"
                        label="Conference End Date"
                        name="confenddate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: addOneDay(newConfStart) }}
                        value={newConfEnd}
                        disabled={!editModeActive || isDatePast(confEnd)}
                        onChange={(e) =>
                          setNewConfEnd(formatDate(e.target.value))
                        }
                        sx={{ ml: 2, mt: 2, width: "90%" }}
                      />
                    </Grid>
                  </Grid>
                  <MDButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    sx={{
                      ml: 2,
                      mt: 2,
                      mb: 2,
                      display: editModeActive ? "block" : "none",
                    }}
                  >
                    Save Changes
                  </MDButton>
                  <MDBox mt={3} mb={1} textAlign="center"></MDBox>
                </Box>
              </Card>
            </MDBox>
          </MDBox>
        </Container>
        <Footer />
      </DashboardLayout>
    </>
  );
}
