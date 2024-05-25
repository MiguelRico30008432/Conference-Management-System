// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import SignInAndOutLayout from "OurLayouts/SignInAndOutLayout";
import bgImage from "assets/images/conference_signup.jpg";
import ErrorSiginSignup from "OurComponents/errorHandling/ErrorSiginSignup";
import * as React from "react";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import LoadingCircle from "OurComponents/loading/LoadingCircle";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [firstNameAlert, setFirstNameAlert] = useState(null);
  const [lastNameAlert, setLastNameAlert] = useState(null);
  const [emailAlert, setEmailAlert] = useState(null);
  const [phoneAlert, setPhoneAlert] = useState(null);
  const [passwordAlert, setPasswordAlert] = useState(null);
  const [affiliationAlert, setAffiliationAlert] = useState(null);
  const [errorOnLogin, setErrorOnLogin] = useState(false);
  const [errorOnRequest, setErrorOnRequest] = useState(null);
  const [message, setMessage] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const formData = Object.fromEntries(data.entries());
    const { firstName, lastName, email, phone, password, affiliation, code } =
      formData;

    if (
      inputsAreValidated(
        firstName,
        lastName,
        email,
        phone,
        password,
        affiliation
      )
    ) {
      await Signup(firstName, lastName, email, phone, password, affiliation, code);
    }
  };

  async function Signup(
    firstName,
    lastName,
    email,
    phone,
    password,
    affiliation,
    code
  ) {
    setOpenLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/signUp`, {
        method: "POST",
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          password: password,
          affiliation: affiliation,
          inviteCode: code
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      if (response.status === 201) {
        setMessage(
          <Alert severity="success">
            Your account has been created successfully. Redirecting to home page...
          </Alert>
        );
        setTimeout(() => {
          navigate("/");
        }, 4000);
      } else {
        const jsonResponse = await response.json();
        setErrorOnRequest(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setErrorOnLogin(true);
    }
    setOpenLoading(false);
  }

  const inputsAreValidated = (
    firstName,
    lastName,
    email,
    phone,
    password,
    affiliation
  ) => {
    setFirstNameAlert(
      firstName === "" ? (
        <Alert severity="error">You must insert your first Name!</Alert>
      ) : null
    );
    setLastNameAlert(
      lastName === "" ? (
        <Alert severity="error">You must insert your last Name!</Alert>
      ) : null
    );
    setEmailAlert(
      email === "" ? (
        <Alert severity="error">You must insert your email!</Alert>
      ) : null
    );
    setPhoneAlert(
      phone === "" ? (
        <Alert severity="error">You must insert your phone!</Alert>
      ) : null
    );
    setPasswordAlert(
      password === "" ? (
        <Alert severity="error">You must insert your password!</Alert>
      ) : null
    );
    setAffiliationAlert(
      password === "" ? (
        <Alert severity="error">You must insert your Affiliation!</Alert>
      ) : null
    );

    return firstName && lastName && email && phone && password && affiliation;
  };

  return !errorOnLogin ? (
    <>
      {openLoading && <LoadingCircle />}
      <SignInAndOutLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Join us today
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter the following data in order to complete your registration!
            </MDTypography>
          </MDBox>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                    {firstNameAlert}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="family-name"
                    />
                    {lastNameAlert}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                    {emailAlert}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                    />
                    {phoneAlert}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                    {passwordAlert}
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="affiliation"
                      label="Affiliation"
                      id="affiliation"
                    />
                    {affiliationAlert}
                  </Grid>
                  <Grid item xs={8} >
                    <TextField
                      fullWidth
                      id="code"
                      label="Intivation Code"
                      name="code"
                    />
                  </Grid>
                </Grid>
                <MDButton
                  type="submit"
                  variant="gradient"
                  color="info"
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  sign Up
                </MDButton>
                {message}
                {errorOnRequest}
                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="button" color="text">
                    Already have an account?{" "}
                    <MDTypography
                      component={Link}
                      to="/signin"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Sign In
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </Box>
            </Box>
          </Container>
        </Card>
      </SignInAndOutLayout>
    </>
  ) : (
    <ErrorSiginSignup backgourndImage={bgImage} />
  );
}
