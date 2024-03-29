// react-router-dom components
import { Link } from "react-router-dom";
import { useState } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

//Layout Component
import SignInAndOutLayout from "OurLayouts/SignInAndOutLayout";
import bgImage from "assets/images/conference_signup.jpg";

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
  const [emailAlert,setEmailAlert] = useState(null);
  const [passwordAlert,setpasswordAlert] = useState(null);

  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const formData = Object.fromEntries(data.entries());
    const {email, password } = formData;
    
    if(inputsAreValidated(email, password)){
      await makeRequest(email, password);
    }
  };

  async function makeRequest(email, password){
    const answer = await fetch("http://localhost:8003/signIn", {
      method: "POST",
      body: JSON.stringify({email: email, password: password}),
      headers: {
              "Content-type": "application/json; charset=UTF-8",
      },
  });
  }

  const inputsAreValidated = (email, password) => {
    setEmailAlert(email === "" ? <Alert severity="error">You must insert your Email!</Alert> : null);
    setpasswordAlert(password === "" ? <Alert severity="error">You must insert your Password!</Alert> : null);
  
    return email && password;
  }

  return (
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
  );
}