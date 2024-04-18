// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

//Layout Component
import SignInAndOutLayout from "OurLayouts/SignInAndOutLayout";
import bgImage from "assets/images/conference_signin.jpeg";
import ErrorSiginSignup from "OurComponents/errorHandling/ErrorSiginSignup";

// @mui material components
import * as React from "react";
import Card from "@mui/material/Card";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

import { AuthContext } from "../auth.context";

export default function SignInPage() {
  const [emailAlert, setEmailAlert] = useState(null);
  const [passwordAlert, setpasswordAlert] = useState(null);
  const [errorOnLogin, seterrorOnLogin] = useState(false);
  const [errorOnRequest, setErrorOnRequest] = useState(null);
  const { setIsLoggedIn, setUser, setIsAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

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
        credentials: "include",
      });

      const jsonResponse = await response.json();

      if (response.ok) {
        setIsLoggedIn(true);

        //Obter o valor de admin a partir da cookie
        const adminCookie =
          document.cookie
            .split("; ")
            .find((row) => row.startsWith("Admin"))
            ?.split("=")[1] === "true";

        const userID = document.cookie
          .split("; ")
          .find((row) => row.startsWith("UserID"))
          ?.split("=")[1];

        setUser(userID);
        setIsAdmin(adminCookie);
        navigate("/");
      } else {
        setErrorOnRequest(
          <Alert severity="error">{jsonResponse.message}</Alert>
        );
      }
    } catch (error) {
      seterrorOnLogin(true);
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

  return !errorOnLogin ? (
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
                sign In
              </MDButton>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  You need to create an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/signup"
                    variant="button"
                    color="info"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign Up
                  </MDTypography>
                </MDTypography>
              </MDBox>
              {errorOnRequest}
            </Box>
          </Box>
        </Container>
      </Card>
    </SignInAndOutLayout>
  ) : (
    <ErrorSiginSignup backgourndImage={bgImage} />
  );
}
