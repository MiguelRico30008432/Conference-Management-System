// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

//Layout Component
import SignInAndOutLayout from "OurLayouts/SignInAndOutLayout";
import bgImage from "assets/images/conference_signin.jpeg";

// @mui material components
import * as React from "react";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

export default function SignInPage() {
  const navigate = useNavigate();

  const [emailAlert, setEmailAlert] = useState(null);
  const [passwordAlert, setpasswordAlert] = useState(null);
  const [ErrorOnLogin, setErrorOnLogin] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const formData = Object.fromEntries(data.entries());
    const { email, password } = formData;

    if (inputsAreValidated(email, password)) {
      await login(email, password);
    }
  };

  const login = async (email, password) => {
      try {
        const response = await fetch("http://localhost:8003/signIn", {
          method: "POST",
          body: JSON.stringify({ email: email, password: password }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: 'include', // Make sure to include credentials for cookies if session-based auth
        });
  
        if (response.status === 200) {
          // Login successful, navigate to home page
          navigate('/'); // Adjust '/home' as needed to match your home route
        } else {
          // Login failed, set error state
          setErrorOnLogin(true);
        }
      } catch (error) {
        // Handle errors (e.g., network issues)
        setErrorOnLogin(true);
      }
  };

  const inputsAreValidated = (email, password) => {
    setEmailAlert(
      email === "" ? (
        <Alert severity="error">You must insert your Email!</Alert>
      ) : null
    );
    setpasswordAlert(
      password === "" ? (
        <Alert severity="error">You must insert your Password!</Alert>
      ) : null
    );

    return email && password;
  };

  return !ErrorOnLogin ? (
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
            Sign in
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
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="email"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    autoFocus
                  />
                  {emailAlert}
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
  ) : (
    <SignInAndOutLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="success"
          mx={3}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Oh no... Something went bad...
          </MDTypography>
        </MDBox>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <MDTypography
              variant="h10"
              fontWeight="medium"
              color="grey"
              textAlign="center"
              mt={1}
            >
              There was an error during the Sign In. Please come back later.
            </MDTypography>
            <MDButton
              variant="gradient"
              color="info"
              sx={{ mt: 2, mb: 2 }}
              onClick={() => navigate("/")}
            >
              Return to Home Page
            </MDButton>
          </Box>
        </Container>
      </Card>
    </SignInAndOutLayout>
  );
}
