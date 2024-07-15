import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../auth.context";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
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
import InputAdornment from "@mui/material/InputAdornment";
import MailIcon from "@mui/icons-material/Mail";
import LanguageIcon from "@mui/icons-material/Language";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import moment from "moment";

export default function CreateConference() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [disclaimer, setDisclaimer] = useState("");
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
  const { user, isLoggedIn } = useContext(AuthContext);
  const [rows, setRows] = useState(4);
  const MIN_ROWS = 3;
  const currentDate = new Date().toISOString().split("T")[0];

  // Handles description text box size
  const handleIncreaseRows = () => {
    setRows(rows + 1);
  };

  const handleDecreaseRows = () => {
    if (rows >= MIN_ROWS) {
      setRows(rows - 1);
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
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/getConfTypes`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    setConferenceTypes(data);
  };

  const fetchConferenceAreas = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/getConfAreas`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    setConferenceAreas(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchConferenceTypes();
      fetchConferenceAreas();
      addFieldEventListeners();
    }
  }, [isLoggedIn]);

  const handleFieldClick = () => {
    setMessage(null);
  };

  const addFieldEventListeners = () => {
    const formFields = document.querySelectorAll("input, select, textarea");

    formFields.forEach((field) => {
      field.addEventListener("click", handleFieldClick);
    });
  };

  //Handles Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const formData = Object.fromEntries(data.entries());

    const allFieldsEmpty = Object.values(formData).every((value) => !value);

    if (datesBetweenStarEndVerifications()) {
      if (allFieldsEmpty) {
        setMessage(
          <Alert severity="error">
            All the fields are empty. <br></br>Please provide values.
          </Alert>
        );
        return;
      }

      const requiredFields = [
        "title",
        "startDate",
        "endDate",
        "submissionStartDate",
        "submissionEndDate",
        "reviewStartDate",
        "reviewEndDate",
        "biddingStartDate",
        "biddingEndDate",
        "description",
        "country",
        "city",
      ];

      const fieldMappings = {
        title: "Title",
        startDate: "Conference Start Date",
        endDate: "Conference End Date",
        submissionStartDate: "Submission Start Date",
        submissionEndDate: "Submission End Date",
        reviewStartDate: "Review Start Date",
        reviewEndDate: "Review End Date",
        biddingStartDate: "Bidding Start Date",
        biddingEndDate: "Bidding End Date",
        description: "Description",
        country: "Country",
        city: "City",
      };

      const missingFields = requiredFields
        .filter((field) => !formData[field])
        .map((field) => fieldMappings[field] || field);

      if (missingFields.length > 0) {
        const missingFieldsMessage = `Please provide values for the following fields: ${missingFields.join(
          ", "
        )}`;
        setMessage(<Alert severity="error">{missingFieldsMessage}</Alert>);
        return;
      }

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
        confLink,
        contact,
      } = formData;

      await createConference(
        title.trim(),
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
        description.trim(),
        country.trim(),
        city.trim(),
        confLink.trim(),
        contact.trim()
      );
    }
  };

  function datesBetweenStarEndVerifications() {
    //---------------------Submissions------------------//
    if (submissionEndDate <= submissionStartDate) {
      setMessage(
        <Alert severity="error">
          Submission End Date must be after Submission Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Bidding------------------//
    if (biddingEndDate <= biddingStartDate) {
      setMessage(
        <Alert severity="error">
          Bidding End Date must be after Bidding Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Reviews------------------//
    if (reviewEndDate <= reviewStartDate) {
      setMessage(
        <Alert severity="error">
          Review End Date must be after Review Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Conference------------------//
    if (endDate <= startDate) {
      setMessage(
        <Alert severity="error">
          Conference End Date must be after Conference Start Date
        </Alert>
      );
      return false;
    }
    //---------------------Between Them------------------//
    if (
      submissionStartDate >= biddingStartDate ||
      submissionStartDate >= biddingEndDate ||
      submissionStartDate >= reviewStartDate ||
      submissionStartDate >= reviewEndDate ||
      submissionStartDate >= startDate ||
      submissionStartDate >= endDate ||
      submissionEndDate >= biddingStartDate ||
      submissionEndDate >= biddingEndDate ||
      submissionEndDate >= reviewStartDate ||
      submissionEndDate >= reviewEndDate ||
      submissionEndDate >= startDate ||
      submissionEndDate >= endDate
    ) {
      setMessage(
        <Alert severity="error">
          Biddings / Reviews / Conference dates must be after Submissions Dates
        </Alert>
      );
      return false;
    }

    if (
      biddingStartDate >= reviewStartDate ||
      biddingStartDate >= reviewEndDate ||
      biddingStartDate >= startDate ||
      biddingStartDate >= endDate ||
      biddingEndDate >= reviewStartDate ||
      biddingEndDate >= reviewEndDate ||
      biddingEndDate >= startDate ||
      biddingEndDate >= endDate
    ) {
      setMessage(
        <Alert severity="error">
          Reviews / Conference dates must be after Bidding Dates
        </Alert>
      );
      return false;
    }

    if (
      reviewStartDate >= startDate ||
      reviewStartDate >= endDate ||
      reviewEndDate >= startDate ||
      reviewEndDate >= endDate
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
    confLink,
    contact
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/createConference`,
        {
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
            confLink: confLink,
            contact: contact,
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
            {
              "Your conference submission will undergo a review for acceptance or rejection. Within two days, you will be notified of our decision, via email."
            }
          </Alert>
        );
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(<Alert severity="error">Something went wrong!</Alert>);
    }
  };

  function formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  const handleKeyDown = (event) => {
    event.preventDefault();
  };

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return formatDate(result);
  }

  return (
    <DashboardLayout>
      <UpperNavBar whereIAm={"Create Conference"} />
      <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
              <Box>
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
                        inputProps={{ maxLength: 200 }} 
                        sx={{ mt: 3 }}
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
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        name="country"
                        label="Country"
                        type="text"
                        id="country"
                        inputProps={{ maxLength: 40 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        required
                        fullWidth
                        autoComplete="given-name"
                        name="city"
                        id="city"
                        label="City"ZZ
                        inputProps={{ maxLength: 40 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required
                        fullWidth
                        multiline
                        rows={rows}
                        name="description"
                        label="Description"
                        type="text"
                        id="description"
                        autoComplete="off"
                        sx={{
                          "& .MuiInputBase-root": { paddingRight: "20px" },
                        }}
                        InputProps={{
                          endAdornment: (
                            <div
                              style={{
                                display: "inline-block",
                                height: "100%",
                                marginRight: "10px",
                              }}
                            >
                              <div
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                }}
                              >
                                <IconButton
                                  onClick={handleIncreaseRows}
                                  style={{ fontSize: "15px" }}
                                  title="Increase text box size"
                                >
                                  <AddIcon />
                                </IconButton>
                                <br />
                                <IconButton
                                  onClick={handleDecreaseRows}
                                  style={{ fontSize: "15px" }}
                                  title="Decrease text box size"
                                >
                                  <RemoveIcon />
                                </IconButton>
                              </div>
                            </div>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="confLink"
                        label="Conference Webpage"
                        type="url"
                        id="confLink"
                        sx={{ marginBottom: "15px" }}
                        inputProps={{ maxLength: 250 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LanguageIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        name="contact"
                        label="Support Contact"
                        type="text"
                        id="contact"
                        sx={{ marginBottom: "15px" }}
                        inputProps={{ maxLength: 250 }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <div>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="submissionStartDate"
                            label="Submissions Start Date"
                            name="submissionStartDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ min: addDays(currentDate, 3) }}
                            value={submissionStartDate}
                            onChange={(e) =>
                              setSubmissionStartDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="submissionEndDate"
                            label="Submissions End Date"
                            name="submissionEndDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(submissionStartDate, 1),
                            }}
                            value={submissionEndDate}
                            onChange={(e) =>
                              setSubmissionEndDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="biddingStartDate"
                            label="Bidding Start Date"
                            name="biddingStartDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(submissionEndDate, 1),
                            }}
                            value={biddingStartDate}
                            onChange={(e) =>
                              setBiddingStartDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="biddingEndDate"
                            label="Bidding End Date"
                            name="biddingEndDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(biddingStartDate, 1),
                            }}
                            value={biddingEndDate}
                            onChange={(e) =>
                              setBiddingEndDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="reviewStartDate"
                            label="Reviews Start Date"
                            name="reviewStartDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(biddingEndDate, 1),
                            }}
                            value={reviewStartDate}
                            onChange={(e) =>
                              setReviewStartDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="reviewEndDate"
                            label="Reviews End Date"
                            name="reviewEndDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(reviewStartDate, 1),
                            }}
                            value={reviewEndDate}
                            onChange={(e) =>
                              setReviewEndDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="startDate"
                            label="Conferance Start Date"
                            name="startDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(reviewEndDate, 1),
                            }}
                            value={startDate}
                            onChange={(e) =>
                              setStartDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            required
                            fullWidth
                            id="endDate"
                            label="Conference End Date"
                            name="endDate"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            inputProps={{
                              min: addDays(startDate, 1),
                            }}
                            value={endDate}
                            onChange={(e) =>
                              setEndDate(formatDate(e.target.value))
                            }
                            onKeyDown={handleKeyDown}
                            sx={{ ml: 2, mt: 2, width: "90%" }}
                          />
                        </Grid>
                      </Grid>
                      {disclaimer && (
                        <Box sx={{ ml: 2, mb: 2 }}>
                          <Alert severity="warning">{disclaimer}</Alert>
                        </Box>
                      )}
                    </div>
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
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}
