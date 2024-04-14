import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

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
export default function MyProfilePage() {
  const [editModeActive, setEditModeActive] = useState(false);
  const [changePassActive, setChangePassActive] = useState(false);

  function handleSubmit() {}

  return (
    <DashboardLayout>
      <UpperNavBar />
      <MDTypography variant="h6">
        Feel free to change your data by clicking on edit profile or change your
        password
      </MDTypography>

      {!editModeActive && (
        <MDButton
          variant="gradient"
          color="info"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => setEditModeActive(true)}
        >
          Edit Profile
        </MDButton>
      )}

      {editModeActive && (
        <MDButton
          variant="gradient"
          color="info"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => setEditModeActive(false)}
        >
          Save Changes
        </MDButton>
      )}

      <MDButton
        variant="gradient"
        color="info"
        sx={{ mt: 2, mb: 2, ml: 1 }}
        onClick={() => setChangePassActive(true)}
      >
        Change Password
      </MDButton>

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
                  defaultValue={"teste"}
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
                  defaultValue={"teste"}
                  disabled={!editModeActive}
                  sx={{ mt: 2, width: "90%" }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  defaultValue={"teste"}
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
                  defaultValue={"teste"}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: "20%" }}
                />
              </Grid>
            </Grid>
            <MDBox mt={3} mb={1} textAlign="center"></MDBox>
          </Box>
        </Card>
      ) : (
        <Card>
          <MDBox mt={1} mb={1} textAlign="center"></MDBox>
          <Box component="form" noValidate onSubmit={handleSubmit}>
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
                  defaultValue={"teste"}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: 300 }}
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
                  defaultValue={"teste"}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: 300 }}
                />
              </Grid>
            </Grid>
            <MDBox mt={3} mb={1} textAlign="center"></MDBox>
          </Box>
        </Card>
      )}

      <MDBox mt={3} mb={1} textAlign="center"></MDBox>
      <Footer />
    </DashboardLayout>
  );
}
