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
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';


export default function DefinitionsPage() {
  const { confID, userRole } = useContext(ConferenceContext);
  const { user, isLoggedIn } = useContext(AuthContext);

  const [message, setMessage] = useState(null);
  const [editModeActive, setEditModeActive] = useState(false);

  const [error, setError] = useState("");
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
  const [minReviewers, setMinReviewers] = useState("");
  const [maxReviewers, setMaxReviewers] = useState("");
  const [submissionUpdate, setSubmissionUpdate] = useState("");
 
  useEffect(() =>{
    async function getConfData(){
      try{
         const response = await fetch("http://localhost:8003/confDefinitions", {
          method: "POST",
          body: JSON.stringify({confid: confID, userid: user}),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        const jsonResponse = await response.json();
        
        if (response.status === 200){
          setName(jsonResponse[0].confname);
          setWebpage(jsonResponse[0].confwebpage);
          setCity(jsonResponse[0].confcity);
          setCountry(jsonResponse[0].confcountry);
          setContact(jsonResponse[0].confcontact);
          setSubmissionStart(jsonResponse[0].confstartsubmission)
          setSubmissionEnd(jsonResponse[0].confendsubmission)
          setBiddingStart(jsonResponse[0].confstartbidding)
          setBiddingEnd(jsonResponse[0].confendbidding)
          setReviewStart(jsonResponse[0].confstartreview)
          setReviewEnd(jsonResponse[0].confendreview)
          setConfStart(jsonResponse[0].confstartdate)
          setConfEnd(jsonResponse[0].confenddate)
          setMinReviewers(jsonResponse[0].confminreviewers)
          setMaxReviewers(jsonResponse[0].confmaxreviewers)
          setSubmissionUpdate(jsonResponse[0].confsubupdate)
        } else {
          setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }

      }catch{
        setError(
          <Alert severity="error">
            Something went wrong when obtaining the conference definitions
          </Alert>
        );
      }
    }

    if (isLoggedIn) {
      getConfData();
    }
  }, [isLoggedIn])

  async function handleSubmit(event){
    event.preventDefault();
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, '0'); // adiciona zero à esquerda se necessário
    let day = date.getDate().toString().padStart(2, '0'); // adiciona zero à esquerda se necessário
    return `${year}-${month}-${day}`;
  };

  return (
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
          <MDBox mb={3} textAlign="left">
              <MDButton
                variant="gradient"
                color="info"
                sx={{ mt: 2, mb: 2 }}
                onClick={() => {
                  setEditModeActive(true);
                  setMessage(null);
                }}>
              Edit Conference Definitions
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      value={webpage}
                      onChange={(e) => setWebpage(e.target.value)}
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
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
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
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
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
                      value={contact}
                      disabled={!editModeActive}
                      onChange={(e) => setContact(e.target.value)}
                      sx={{ ml: 2, mt: 2, width: "90%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth>
                      <InputLabel 
                        id="confsubupdate"
                        sx={{ ml: 2, mt: 3, width: "90%" }}
                        >Submissions Update</InputLabel>
                      <Select
                        required
                        fullWidth
                        labelId="confsubupdate"
                        label="Submissions Update"
                        id="confsubupdate"
                        value={submissionUpdate}
                        disabled={!editModeActive}
                        onChange={(e) => setSubmissionUpdate(e.target.value)}
                        sx={{ ml: 2, mt: 3.5, width: "90%" }}
                      >
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                      </Select>
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
                      value={formatDate(submissionsStart)}
                      disabled={!editModeActive}
                      onChange={(e) => setSubmissionStart(e.target.value)}
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
                      value={formatDate(submissionsEnd)}
                      disabled={!editModeActive}
                      onChange={(e) => setSubmissionEnd(e.target.value)}
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
                      value={formatDate(biddingStart)}
                      disabled={!editModeActive}
                      onChange={(e) => setBiddingStart(e.target.value)}
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
                      value={formatDate(biddingEnd)}
                      disabled={!editModeActive}
                      onChange={(e) => setBiddingEnd(e.target.value)}
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
                      value={formatDate(reviewStart)}
                      disabled={!editModeActive}
                      onChange={(e) => setReviewStart(e.target.value)}
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
                      value={formatDate(reviewEnd)}
                      disabled={!editModeActive}
                      onChange={(e) => setReviewEnd(e.target.value)}
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
                      value={formatDate(confStart)}
                      disabled={!editModeActive}
                      onChange={(e) => setConfStart(e.target.value)}
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
                      value={formatDate(confEnd)}
                      disabled={!editModeActive}
                      onChange={(e) => setConfEnd(e.target.value)}
                      sx={{ ml: 2, mt: 2, width: "90%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      required
                      fullWidth
                      id="confminreviewers"
                      label="Minimun Number of Reviews"
                      name="confminreviewers"
                      value={minReviewers}
                      disabled={!editModeActive}
                      onChange={(e) => setMinReviewers(e.target.value)}
                      sx={{ ml: 2, mt: 2, width: "90%" }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      required
                      fullWidth
                      id="confmaxreviewers"
                      label="Maximum Number of Reviews"
                      name="confmaxreviewers"
                      value={maxReviewers}
                      disabled={!editModeActive}
                      onChange={(e) => setMaxReviewers(e.target.value)}
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
                  onClick={() => setEditModeActive(false)}
                >
                  Save Changes
                </MDButton>
                <MDBox mt={3} mb={1} textAlign="center"></MDBox>
              </Box>
            </Card>              
          </MDBox>
        </MDBox>
      </Container>
    </DashboardLayout>
  );
}
