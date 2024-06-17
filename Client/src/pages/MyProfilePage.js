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
import { fetchAPI } from "OurFunctions/fetchAPI";
import Alert from "@mui/material/Alert";
import LoadingCircle from "OurComponents/loading/LoadingCircle";

export default function MyProfilePage() {
  const { user, isLoggedIn } = useContext(AuthContext);

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
  const [disableSaveUser, setDisableSaveUser] = useState(true);

  const [password, setPasword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [disableSavePassword, setDisableSavePassword] = useState(true);

  const [code, setInviteCode] = useState("");

  useEffect(() => {
    async function getUserData() {
      const response = await fetchAPI(
        "userData",
        "POST",
        { userID: user },
        setMessage,
        setOpenLoading
      );

      if (response) {
        setFirstName(response[0].userfirstname);
        setOriginalFirstName(response[0].userfirstname);
        setLastName(response[0].userlastname);
        setOriginalLastName(response[0].userlastname);
        setAffiliation(response[0].useraffiliation);
        setOriginalAffiliation(response[0].useraffiliation);
        setEmail(response[0].useremail);
        setOriginalEmail(response[0].useremail);
        setPhone(response[0].userphone);
        setOriginalPhone(response[0].userphone);
      }
    }

    if (isLoggedIn) {
      getUserData();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (changesDetected()) setDisableSaveUser(false);
    else setDisableSaveUser(true);
  }, [firstName, lastName, affiliation, email, phone]);

  useEffect(() => {
    if (password === "" || repeatPassword === "") setDisableSavePassword(true);
    else setDisableSavePassword(false);
  }, [password, repeatPassword]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (passwordMessage) {
      const timer = setTimeout(() => {
        setPasswordMessage(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [passwordMessage]);

  async function changeUserData() {
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

  async function changePassword() {
    if (password !== repeatPassword) {
      setPasswordMessage(
        <Alert severity="error">
          The first password does not match with the second one.
        </Alert>
      );
    } else {
      await saveUserPassword();
    }
  }

  function changesDetected() {
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
    const response = await fetchAPI(
      "saveUserData",
      "POST",
      {
        userID: user,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        affiliation: affiliation.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },
      setMessage,
      setOpenLoading
    );

    if (response) {
      setMessage(
        <Alert severity="success">{"Your data was saved with success"}</Alert>
      );

      setOriginalFirstName(firstName);
      setOriginalLastName(lastName);
      setOriginalAffiliation(affiliation);
      setOriginalPhone(phone);
      setOriginalEmail(email);
    }
  }

  async function saveUserPassword() {
    const response = await fetchAPI(
      "saveUserPassword",
      "POST",
      { userID: user, userPassword: password },
      setPasswordMessage,
      setOpenLoading
    );

    if (response) {
      setPasswordMessage(<Alert severity="success">Password changed</Alert>);
    }
  }

  async function handleInvitationCode() {
    const inviteCode = code.trim();
    if (inviteCode === "") {
      setInviteMessage(
        <Alert severity="error">Please enter an invitation code.</Alert>
      );
      return;
    }

    const response = await fetchAPI(
      "saveInvitationCode",
      "POST",
      {
        userID: user,
        inviteCode: inviteCode,
      },
      setInviteMessage,
      setOpenLoading
    );

    if (response) {
      setInviteMessage(
        <Alert severity="success">
          Invitation code accepted. You have joined the conference.
        </Alert>
      );
      setInviteCode(""); // Clear the input field after successful submission
    }
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
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
              {/*User change*/}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
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
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    sx={{ ml: 2, mt: 2, width: 150 }}
                  />
                </Grid>
              </Grid>

              <MDBox style={{ display: "flex", gap: 1 }}>
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
                    changeUserData();
                  }}
                  disabled={disableSaveUser}
                >
                  Save Changes
                </MDButton>
              </MDBox>
            </Card>
          </MDBox>

          <MDBox mb={3} textAlign="left">
            <Card>
              {passwordMessage}
              {inviteMessage}
            </Card>
          </MDBox>

          <MDBox mb={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  {/*Password change*/}
                  <MDTypography ml={2} mb={2} mt={2} variant="body2">
                    Change Your Password
                  </MDTypography>

                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPasword(e.target.value);
                    }}
                    sx={{ ml: 2, width: "90%" }}
                  />

                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Repeat Password"
                    type="password"
                    value={repeatPassword}
                    onChange={(e) => {
                      setRepeatPassword(e.target.value);
                    }}
                    sx={{ mt: 2, ml: 2, width: "90%" }}
                  />

                  <MDBox style={{ display: "flex", gap: 1 }}>
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
                      disabled={disableSavePassword}
                      onClick={() => {
                        setPasswordMessage(null);
                        changePassword();
                      }}
                    >
                      Save Password
                    </MDButton>
                  </MDBox>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                {/*Invitation Code*/}
                <Card>
                  <MDTypography ml={2} mb={2} mt={2} variant="body2">
                    Do you have a conference invitation?
                  </MDTypography>

                  <TextField
                    autoComplete="given-name"
                    name="code"
                    fullWidth
                    id="code"
                    label="Invitation Code"
                    value={code}
                    onChange={(e) => {
                      setInviteCode(e.target.value);
                      setInviteMessage(null);
                    }}
                    sx={{ ml: 2, width: "90%" }}
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
                      handleInvitationCode();
                    }}
                  >
                    Join Conference
                  </MDButton>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
