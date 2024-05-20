import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth.context";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import * as React from "react";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import LoadingCircle from "OurComponents/loading/LoadingCircle";

export default function MyProfilePage() {
  const { user, isLoggedIn } = useContext(AuthContext);

  const [editModeActive, setEditModeActive] = useState(false);
  const [passwordModeActive, setPasswordModeActive] = useState(false);
  const [openEmailChangeDialog, setOpenEmailChangeDialog] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [inviteMessage, setInviteMessage] = useState(null);

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

  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    async function getUserData() {
      setOpenLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/userData`,
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
      setOpenLoading(false);
    }

    if (isLoggedIn) {
      getUserData();
    }
  }, [isLoggedIn]);

  async function changeUserData() {
    if (makeRequest()) {
      if (valideInputs()) {
        if (originalEmail !== email) {
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

  async function changePassword() {
    if (password.length === 0 || repeatPassword.length === 0) {
      setPasswordMessage(
        <Alert severity="error">Please fill in the password field.</Alert>
      );
    } else if (password !== repeatPassword) {
      setPasswordMessage(
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
      originalFirstName !== firstName ||
      originalLastName !== lastName ||
      originalAffiliation !== affiliation ||
      originalEmail !== email ||
      originalPhone !== phone
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
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/saveUserData`,
        {
          method: "POST",
          body: JSON.stringify({
            userID: user,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            affiliation: affiliation.trim(),
            email: email.trim(),
            phone: phone.trim(),
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
          <Alert severity="success">{"Your data was saved with success"}</Alert>
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
    setOpenLoading(false);
  }

  async function saveUserPassword() {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/saveUserPassword`,
        {
          method: "POST",
          body: JSON.stringify({ userID: user, userPassword: password }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      const jsonResponse = await response.json();

      if (response.status === 200) {
        setPasswordMessage(<Alert severity="success">Password changed</Alert>);
      } else {
        setPasswordMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setPasswordMessage(
        <Alert severity="error">
          Something went wrong when obtaining your informations
        </Alert>
      );
    }
    setOpenLoading(false);
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <PopUpWithMessage
        open={openEmailChangeDialog}
        handleClose={() => setOpenEmailChangeDialog(false)}
        handleConfirm={async () => {
          saveUserData();
          setOpenEmailChangeDialog(false);
        }}
        title={"Confirm Email Change"}
        text={
          "Are you sure you want to change your email address? Changing your email address will affect your login."
        }
      />

      <DashboardLayout>
        <UpperNavBar />
        <MDBox mb={3} textAlign="left">
          <Card>
            <MDTypography ml={2} variant="h6">
              My Profile
            </MDTypography>
            <MDTypography ml={2} variant="body2">
              Feel free to change your data by clicking on edit profile or
              change your password
            </MDTypography>
          </Card>
        </MDBox>

        <MDBox mb={3} textAlign="left">
          <Card>{message}</Card>
        </MDBox>

        <MDBox mb={3}>
          <Card>
            <MDTypography ml={2} mb={2} mt={2} variant="body2">
              Change your informations
            </MDTypography>

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
                  sx={{ ml: 2, mt: 2, width: 150 }}
                />
              </Grid>
            </Grid>

            <MDBox style={{ display: "flex", gap: 1 }}>
              {!editModeActive && (
                <MDButton
                  variant="gradient"
                  color="info"
                  sx={{
                    maxWidth: "200px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    mt: 2,
                    ml: 2,
                    mb: 2,
                  }}
                  onClick={() => {
                    setEditModeActive(true);
                    setMessage(null);
                  }}
                >
                  Edit Profile
                </MDButton>
              )}

              {editModeActive && (
                <MDButton
                  variant="gradient"
                  color="success"
                  sx={{
                    maxWidth: "200px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    mt: 2,
                    ml: 2,
                    mb: 2,
                  }}
                  onClick={() => {
                    setEditModeActive(false);
                    changeUserData();
                  }}
                >
                  Save Changes
                </MDButton>
              )}
            </MDBox>
          </Card>
        </MDBox>

        <MDBox mb={3} textAlign="left">
          <Card>{passwordMessage}</Card>{" "}
        </MDBox>

        <MDBox mb={3}>
          <Card>
            <MDTypography ml={2} mb={2} mt={2} variant="body2">
              Change Your Password
            </MDTypography>

            <TextField
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              disabled={!passwordModeActive}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPasword(e.target.value)}
              sx={{ ml: 2, width: 300 }}
            />

            <TextField
              required
              fullWidth
              name="password"
              label="Repeat Password"
              type="password"
              id="password"
              disabled={!passwordModeActive}
              autoComplete="new-password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              sx={{ mt: 2, ml: 2, width: 300 }}
            />

            <MDBox style={{ display: "flex", gap: 1 }}>
              {!passwordModeActive && (
                <MDButton
                  variant="gradient"
                  color="info"
                  sx={{
                    maxWidth: "170px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    mt: 2,
                    ml: 2,
                    mb: 2,
                  }}
                  onClick={() => {
                    setPasswordMessage(null);
                    setPasswordModeActive(true);
                  }}
                >
                  Change Password
                </MDButton>
              )}

              {passwordModeActive && (
                <MDButton
                  variant="gradient"
                  color="success"
                  sx={{
                    maxWidth: "150px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    ml: 2,
                    mt: 2,
                    mb: 2,
                  }}
                  onClick={() => {
                    setPasswordModeActive(false);
                    changePassword();
                  }}
                >
                  Save Changes
                </MDButton>
              )}
            </MDBox>
          </Card>
        </MDBox>

        <MDBox mb={3} textAlign="left">
          <Card>{inviteMessage}</Card>
        </MDBox>

        <MDBox mb={3}>
          <Card>
            <MDTypography ml={2} mb={2} mt={2} variant="body2">
              "Do you have a conference invitation?"
            </MDTypography>

            <TextField
              autoComplete="given-name"
              name="code"
              fullWidth
              id="code"
              label="Intivation Code"
              autoFocus
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              sx={{ ml: 2, width: 150 }}
            />

            <MDButton
              variant="gradient"
              color="info"
              sx={{
                maxWidth: "170px",
                maxHeight: "30px",
                minWidth: "5px",
                minHeight: "30px",
                mt: 2,
                ml: 2,
                mb: 2,
              }}
              onClick={() => {
                setMessage(null);
              }}
            >
              Join Conference
            </MDButton>
          </Card>
        </MDBox>

        <Footer />
      </DashboardLayout>
    </>
  );
}
