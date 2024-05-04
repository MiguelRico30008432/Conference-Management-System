import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth.context";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDTypography from "components/MDTypography";
import * as React from "react";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import LoadingCircle from "OurComponents/loading/LoadingCircle";

export default function CreateConference() {
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [disclaimer, setDisclaimer] = React.useState("");
  const [message, setMessage] = useState(null);
  const [confType, setConfType] = useState("");
  const [confArea, setConfArea] = useState("");
  const [submissionStartDate, setSubmissionStartDate] = useState("");
  const [reviewStartDate, setReviewStartDate] = useState("");
  const [biddingStartDate, setBiddingStartDate] = useState("");
  const [submissionEndDate, setSubmissionEndDate] = useState("");
  const [reviewEndDate, setReviewEndDate] = useState("");
  const [biddingEndDate, setBiddingEndDate] = useState("");
  const [conferenceTypes, setConferenceTypes] = useState([]);
  const [conferenceAreas, setConferenceAreas] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);

  const { user, isLoggedIn } = useContext(AuthContext);

  //Handles the disclaimers in the Date picker

  const handleStartDateChange = (event) => {
    const newStartDate = new Date(event.target.value);
    const todayDate = new Date();
    // Adding 10 days to todayDate (a rever)
    todayDate.setDate(todayDate.getDate() + 10);
    if (newStartDate <= todayDate) {
      setDisclaimer("Conference Start Date in minimum 10days.");
    } else {
      setDisclaimer("");
    }
  };

  const handleEndDateChange = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);
    if (newEndDate <= startDate) {
      setDisclaimer(
        "Conference end date cannot be earlier than Conference start date."
      );
    } else {
      setDisclaimer("");
    }
  };

  //Handles the Dropdown menus
  const handleTypeChange = (event) => {
    setConfType(event.target.value);
  };

  const handleAreaChange = (event) => {
    setConfArea(event.target.value);
  };

  const fetchConferenceTypes = async () => {
    const response = await fetch("http://localhost:8003/getConfTypes", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    });
    const data = await response.json();
    setConferenceTypes(data);
  };

  const fetchConferenceAreas = async () => {
    const response = await fetch("http://localhost:8003/getConfAreas", {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    });
    const data = await response.json();
    setConferenceAreas(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchConferenceTypes();
      fetchConferenceAreas();
    }
  }, [isLoggedIn]);

  //Handles Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = Object.fromEntries(data.entries());
    const {
      title,
      startDate,
      endDate,
      submissionStartDate,
      submissionEndDate,
      reviewStartDate,
      reviewEndDate,
      biddingStartDate,
      biddingEndDate,
      description,
      country,
      city,
      numberMinReviewrs,
      numberMaxReviewrs,
      numberMaxSubmissions,
      confLink,
    } = formData;

    await createConference(
      title,
      user,
      confType,
      confArea,
      startDate,
      endDate,
      submissionStartDate,
      submissionEndDate,
      reviewStartDate,
      reviewEndDate,
      biddingStartDate,
      biddingEndDate,
      description,
      country,
      city,
      numberMinReviewrs,
      numberMaxReviewrs,
      numberMaxSubmissions,
      confLink
    );
  };

  const createConference = async (
    title,
    user,
    confType,
    confArea,
    startDate,
    endDate,
    submissionStartDate,
    submissionEndDate,
    reviewStartDate,
    reviewEndDate,
    biddingStartDate,
    biddingEndDate,
    description,
    country,
    city,
    numberMinReviewrs,
    numberMaxReviewrs,
    numberMaxSubmissions,
    confLink
  ) => {
    setOpenLoading(true);
    try {
      const response = await fetch("http://localhost:8003/createConference", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          user: user,
          confType: confType,
          confArea: confArea,
          startDate: startDate,
          endDate: endDate,
          submissionStartDate: submissionStartDate,
          submissionEndDate: submissionEndDate,
          reviewStartDate: reviewStartDate,
          reviewEndDate: reviewEndDate,
          biddingStartDate: biddingStartDate,
          biddingEndDate: biddingEndDate,
          description: description,
          country: country,
          city: city,
          numberMinReviewrs: numberMinReviewrs,
          numberMaxReviewrs: numberMaxReviewrs,
          numberMaxSubmissions: numberMaxSubmissions,
          confLink: confLink,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      const jsonResponse = await response.json();
      if (response.status === 200) {
        setMessage(
          <Alert severity="success">{"Yor data was saved with success"}</Alert>
        );
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(<Alert severity="error">Something went wrong!</Alert>);
    }
    setOpenLoading(false);
  };

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <UpperNavBar />

        <MDBox
          mb={3}
          mt={2}
          textAlign="left"
          sx={{
            maxWidth: 700,
            margin: "auto",
            marginBottom: 2,
          }}
        >
          <Card>
            <MDTypography ml={2} variant="h6">
              Create Conference
            </MDTypography>
            <MDTypography ml={2} variant="body2">
              Fill the form to create a conference
            </MDTypography>
          </Card>
        </MDBox>

        <MDBox mb={3}>
          <Card
            sx={{
              maxWidth: 700,
              margin: "auto",
              marginBottom: "50px",
            }}
          >
            <Container component="main" maxWidth="sm">
              <CssBaseline />
              <Box sx={{ mt: 1 }}>
                <Box component="form" noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        autoComplete="given-name"
                        name="title"
                        required
                        fullWidth
                        id="title"
                        label="Title"
                        autoFocus
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Select
                        id="confType"
                        onChange={handleTypeChange}
                        value={confType}
                        fullWidth
                        required
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Conference Type
                        </MenuItem>
                        {conferenceTypes.map((conferenceType) => (
                          <MenuItem
                            key={conferenceType.conftypename}
                            value={conferenceType.conftypename}
                          >
                            {conferenceType.conftypename}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Select
                        id="confArea"
                        onChange={handleAreaChange}
                        value={confArea}
                        fullWidth
                        required
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select Conference Area
                        </MenuItem>
                        {conferenceAreas.map((conferenceArea) => (
                          <MenuItem
                            key={conferenceArea.confareaname}
                            value={conferenceArea.confareaname}
                          >
                            {conferenceArea.confareaname}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          name="country"
                          label="Country"
                          type="text"
                          id="country"
                          sx={{ marginLeft: "15px", marginTop: "15px" }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          required
                          fullWidth
                          autoComplete="given-name"
                          name="city"
                          id="city"
                          label="City"
                          autoFocus
                          sx={{ marginTop: "15px", marginRight: "20px" }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={3}
                        name="description"
                        label="Description"
                        type="text"
                        id="description"
                        autoComplete="off"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name="confLink"
                        label="Conference Webpage"
                        type="url"
                        id="confLink"
                        sx={{ marginBottom: "15px" }}
                      />
                    </Grid>
                    <div>
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="startDate"
                            label="Conference Start Date"
                            type="date"
                            id="startDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ margin: "5px 0px 0px 15px" }}
                            onChange={(event) => {
                              setStartDate(event.target.value);
                              handleStartDateChange(event);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="endDate"
                            label="Conference End Date"
                            type="date"
                            id="endDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ margin: "5px 0px 0px 0px" }}
                            onChange={(event) => {
                              setEndDate(event.target.value);
                              handleEndDateChange(event);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="submissionStartDate"
                            label="Submission Start Date"
                            type="date"
                            id="submissionStartDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ margin: "0px 0px 0px 15px" }}
                            onChange={(event) => {
                              setSubmissionStartDate(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="submissionEndDate"
                            label="Submission End Date"
                            type="date"
                            id="submissionEndDate"
                            InputLabelProps={{ shrink: true }}
                            onChange={(event) => {
                              setSubmissionEndDate(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="reviewStartDate"
                            label="Review Start Date"
                            type="date"
                            id="reviewStartDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginLeft: "15px" }}
                            onChange={(event) => {
                              setReviewStartDate(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="reviewEndDate"
                            label="Review End Date"
                            type="date"
                            id="reviewEndDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginRight: "20px" }}
                            onChange={(event) => {
                              setReviewEndDate(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="biddingStartDate"
                            label="Bidding Start Date"
                            type="date"
                            id="biddingStartDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginLeft: "15px" }}
                            onChange={(event) => {
                              setBiddingStartDate(event.target.value);
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            required
                            fullWidth
                            name="biddingEndDate"
                            label="Bidding End Date"
                            type="date"
                            id="biddingEndDate"
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginRight: "20px", marginBottom: "15px" }}
                            onChange={(event) => {
                              setBiddingEndDate(event.target.value);
                            }}
                          />
                        </Grid>
                      </Grid>
                      {disclaimer && (
                        <Box sx={{ ml: 2, mb: 2 }}>
                          <Alert severity="warning">{disclaimer}</Alert>
                        </Box>
                      )}
                    </div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          name="numberMinReviewrs"
                          label="Nº min Reviewers"
                          type="number"
                          id="numberMinReviewrs"
                          inputProps={{ min: 0 }}
                          sx={{ marginLeft: "15px" }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          name="numberMaxReviewrs"
                          label="Nº max Reviewers"
                          type="number"
                          id="numberMaxReviewrs"
                          inputProps={{ min: 0 }}
                          sx={{ marginRight: "12px", marginLeft: "8px" }}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          name="numberMaxSubmissions"
                          label="Nº max Submissions"
                          type="number"
                          id="numberMaxSubmissions"
                          inputProps={{ min: 0 }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <MDButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    Create Conference
                  </MDButton>
                  {message}
                  <MDBox mt={3} mb={1} textAlign="center"></MDBox>
                </Box>
              </Box>
            </Container>
          </Card>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
