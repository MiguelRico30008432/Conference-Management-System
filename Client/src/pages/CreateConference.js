// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

//Layout Component
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

// @mui material components
import * as React from "react";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import Alert from "@mui/material/Alert";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Diversity3Icon from '@mui/icons-material/Diversity3';



export default function CreateConference() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [disclaimer, setDisclaimer] = React.useState('');
  const [message, setMessage] = useState(null);
  const [confType, setConfType] = useState('');
  const [confArea, setConfArea] = useState('');
  const [submissionStartDate, setSubmissionStartDate] = useState('');
  const [reviewStartDate, setReviewStartDate] = useState('');
  const [biddingStartDate, setBiddingStartDate] = useState('');
  const [submissionEndDate, setSubmissionEndDate] = useState('');
  const [reviewEndDate, setReviewEndDate] = useState('');
  const [biddingEndDate, setBiddingEndDate] = useState('');
  const [conferenceTypes, setConferenceTypes] = useState([]);
  const [conferenceAreas, setConferenceAreas] = useState([]);

//Handles the disclaimers in the Date picker

  const handleStartDateChange = (event) => {
    const newStartDate = new Date(event.target.value);
    const todayDate = new Date();
    if (newStartDate <= todayDate){
      setDisclaimer(
      "Conference Start Date must be superior to today."
      );
    } else {
      setDisclaimer("");
    };
  };

  const handleDateChange = (event) => {
    const newEndDate = event.target.value;
    setEndDate(newEndDate);

    if (newEndDate < startDate) {
      setDisclaimer("End date cannot be earlier than start date.");
    } else if (
      submissionStartDate < startDate ||
      reviewStartDate < startDate ||
      biddingStartDate < startDate
    ) {
      setDisclaimer(
        "Submission, Review, or Bidding start date cannot be earlier than conference start date."
      );
    } else if (
      submissionEndDate >= endDate ||
      reviewEndDate >= endDate || 
      biddingEndDate >= endDate 
    ){
      setDisclaimer(
        "Submission, Review, or Bidding end date cannot be later than conference end date."
      );
      if (biddingEndDate < endDate){
        setDisclaimer("");
      }
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
    fetchConferenceTypes();
    fetchConferenceAreas();
  }, []);

//Handles Submit form  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = Object.fromEntries(data.entries());
    const { startDate, endDate, submissionStartDate, submissionEndDate, reviewStartDate, reviewEndDate, 
      biddingStartDate, biddingEndDate } = formData;

    const { title, confType, confArea, description, country, city, numberMinReviewrs, numberMaxReviewrs, numberMaxSubmissions, confLink } = formData;

    await createConference( title, confType, confArea, startDate, endDate, submissionStartDate, submissionEndDate, reviewStartDate, 
      reviewEndDate, biddingStartDate, biddingEndDate, description, country, city, numberMinReviewrs, numberMaxReviewrs, numberMaxSubmissions, confLink);
  };

  const createConference = async (title, confType, confArea, startDate, endDate, submissionStartDate, submissionEndDate, reviewStartDate, reviewEndDate, 
    biddingStartDate, biddingEndDate, description, country, city, numberMinReviewrs, numberMaxReviewrs, numberMaxSubmissions, confLink) => {
    try {
      const response = await fetch("http://localhost:8003/createConference", {
        method: "POST",
        body: JSON.stringify({ 
          title: title, confType: confType, confArea: confArea, startDate: startDate, endDate: endDate, submissionStartDate: submissionStartDate, 
          submissionEndDate: submissionEndDate, reviewStartDate: reviewStartDate, reviewEndDate: reviewEndDate, 
          biddingStartDate: biddingStartDate, biddingEndDate: biddingEndDate, description: description, country: country, 
          city: city, numberMinReviewrs: numberMinReviewrs, numberMaxReviewrs: numberMaxReviewrs, numberMaxSubmissions: numberMaxSubmissions, confLink: confLink}),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      const jsonResponse = await response.json();
      if (response.status === 200) {
        setMessage(<Alert severity="success">{"Yor data was saved with success"}</Alert>);
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }

      
    } catch (error) {
      setMessage(<Alert severity="error">Something went wrong!</Alert>);
    }
  };
  


  return (
    // <DashboardLayout>
    <DashboardLayout>
      <UpperNavBar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Card sx={{ maxWidth: 700, maxHeight: 1000}}>
            <Container component="main" maxWidth="sm">
            <CssBaseline />
              <Box sx={{ mt: 1 }}>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Tooltip title="Fill the form to create a conference" arrow>
              <IconButton>Form to create Conference<Diversity3Icon sx={{ ml: 1 }} />
                </IconButton>
            </Tooltip>
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
                  <MenuItem value="" disabled>Select Conference Type</MenuItem>
                  {conferenceTypes.map((conferenceType) => (
                    <MenuItem key={conferenceType.conftypename} value={conferenceType.conftypename}>
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
                  <MenuItem value="" disabled>Select Conference Area</MenuItem>
                  {conferenceAreas.map((conferenceArea) => (
                    <MenuItem key={conferenceArea.confareaname} value={conferenceArea.confareaname}>
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
                    sx={{ marginLeft: '15px', marginTop: '15px' }}
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
                    sx={{ marginTop:'15px', marginRight:'20px' }}
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
                    sx={{ marginBottom:'15px' }}
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
                      sx={{ margin: '5px 0px 0px 15px' }}
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
                      sx={{ margin: '5px 0px 0px 0px' }}
                      onChange={(event) => {
                        handleDateChange(event);
                        setEndDate(event.target.value);
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
                      sx={{ margin: '0px 0px 0px 15px' }}
                      onChange={(event) => {
                        setStartDate(event.target.value);
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
                        handleDateChange(event);
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
                      sx={{ marginLeft: '15px' }}
                      onChange={(event) => {
                        setStartDate(event.target.value);
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
                      sx={{ marginRight:'20px' }}
                      onChange={(event) => {
                        handleDateChange(event);
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
                      sx={{ marginLeft: '15px' }}
                      onChange={(event) => {
                        setStartDate(event.target.value);
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
                      sx={{ marginRight:'20px', marginBottom: '15px'}}
                      onChange={(event) => {
                        handleDateChange(event);
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
                      sx={{ marginLeft: '15px'}}
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
                      sx={{ marginRight:'12px', marginLeft:'8px' }}
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
                  >Create Conference</MDButton>
                    {message}
                <MDBox mt={3} mb={1} textAlign="center"></MDBox>
              </Box>
            </Box>
          </Container>
        </Card>
      </div>
      <Footer />
    </DashboardLayout>
  );
}
