import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth.context";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// @mui material components
import * as React from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";

export default function MyProfilePage() {
  const [editModeActive, setEditModeActive] = useState(false);
  const [changePassActive, setChangePassActive] = useState(false);
  const [openEmailChangeDialog, setOpenEmailChangeDialog] = useState(false);
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [originalAffiliation, setOriginalAffiliation] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");

  const [password, setPasword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    async function getUserData() {
      try {
        const response = await fetch("http://localhost:8003/userData", {
          method: "POST",
          body: JSON.stringify({ userID: user }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        const jsonResponse = await response.json();

        if (response.status === 200) {
          setFirstName(jsonResponse[0].userfirstname);
          setOriginalFirstName(jsonResponse[0].userfirstname);
          setLastName(jsonResponse[0].userlastname);
          setOriginalLastName(jsonResponse[0].userlastname);
          setAffiliation(jsonResponse[0].useraffiliation);
          setOriginalAffiliation(jsonResponse[0].useraffiliation);
          setEmail(jsonResponse[0].useremail);
          setOriginalEmail(jsonResponse[0].useremail);
          setPhone(jsonResponse[0].userphone);
          setOriginalPhone(jsonResponse[0].userphone);
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
    }

    getUserData();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    if (makeRequest) {
      if (valideInputs) {
        if (originalEmail != email) {
          setOpenEmailChangeDialog(true);
        } else {
          await saveUserData();
        }
      } else {
        setMessage(
          <Alert severity="error">All fields marked with * are required.</Alert>
        );
      }
    }
  }

  async function handleSubmitForPassword(event) {
    event.preventDefault();

    if (password.length === 0 || repeatPassword.length === 0) {
      setMessage(
        <Alert severity="error">Please fill in the password field.</Alert>
      );
    } else if (password !== repeatPassword) {
      setMessage(
        <Alert severity="error">
          The first password does not match with the second one.
        </Alert>
      );
    } else {
      await saveUserPassword();
    }
  }

  function makeRequest() {
    if (
      originalFirstName != firstName ||
      originalLastName != lastName ||
      originalAffiliation != affiliation ||
      originalEmail != email ||
      originalPhone != phone
    ) {
      return true;
    } else {
      return false;
    }
  }

  function valideInputs() {
    if (firstName === "" || lastName === "" || email === "" || phone === "")
      return false;
    else return true;
  }

  async function saveUserData() {
    try {
      const response = await fetch("http://localhost:8003/saveUserData", {
        method: "POST",
        body: JSON.stringify({
          userID: user,
          firstName: firstName,
          lastName: lastName,
          affiliation: affiliation,
          email: email,
          phone: phone,
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

        setOriginalFirstName(firstName);
        setOriginalLastName(lastName);
        setOriginalAffiliation(affiliation);
        setOriginalPhone(phone);
        setOriginalEmail(email);
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
  }

  async function saveUserPassword() {
    try {
      const response = await fetch("http://localhost:8003/saveUserPassword", {
        method: "POST",
        body: JSON.stringify({ userID: user, userPassword: password }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      const jsonResponse = await response.json();

      if (response.status === 200) {
        setMessage(<Alert severity="success">Password changed</Alert>);
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
  }

  return (
    <DashboardLayout>
      <UpperNavBar />
      <MDTypography variant="h6">
        Feel free to change your data by clicking on edit profile or change your
        password
      </MDTypography>

      {message}

      <MDButton
        variant="gradient"
        color="info"
        sx={{ mt: 2, mb: 2 }}
        onClick={() => {
          setEditModeActive(true);
          setChangePassActive(false);
          setMessage(null);
        }}
      >
        Edit Profile
      </MDButton>

      <MDButton
        variant="gradient"
        color="info"
        sx={{ mt: 2, mb: 2, ml: 1 }}
        onClick={() => {
          setEditModeActive(false);
          setChangePassActive(true);
        }}
      >
        Change Password
      </MDButton>

      <PopUpWithMessage
        open={openEmailChangeDialog}
        handleClose={() => setOpenEmailChangeDialog(false)}
        handleConfirm={async () => {
          saveUserData();
          setOpenEmailChangeDialog(false);
        }}
        text={
          "Are you sure you want to change your email address? Changing your email address will affect your login."
        }
      />

      {!changePassActive ? (
        <Card sx={{ maxWidth: 1400 }}>
          <MDBox mt={1} mb={1} textAlign="center"></MDBox>
          <Box component="form" noValidate onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={5}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: "90%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: "90%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  fullWidth
                  id="affiliation"
                  label="affiliation"
                  name="affiliation"
                  value={affiliation}
                  onChange={(e) => setAffiliation(e.target.value)}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: "90%" }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: "90%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  autoComplete="phone"
                  value={phone}
                  disabled={!editModeActive}
                  onChange={(e) => setPhone(e.target.value)}
                  sx={{ ml: 2, mt: 2, width: "35%" }}
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
      ) : (
        <Card sx={{ maxWidth: 1400 }}>
          <MDBox mt={1} mb={1} textAlign="center"></MDBox>
          <Box component="form" noValidate onSubmit={handleSubmitForPassword}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPasword(e.target.value)}
                  sx={{ ml: 2, mt: 2, width: "50%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Repeat Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  sx={{ ml: 2, mt: 2, width: "50%" }}
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
              }}
              onClick={() => setEditModeActive(false)}
            >
              Save Changes
            </MDButton>
            <MDBox mt={3} mb={1} textAlign="center"></MDBox>
          </Box>
        </Card>
      )}

      <MDBox mt={3} mb={1} textAlign="center"></MDBox>
      <Footer />
    </DashboardLayout>
  );
}
