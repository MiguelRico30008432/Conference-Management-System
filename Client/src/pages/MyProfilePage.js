import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

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
  const [message, setMessage] = useState(null);
  const { user } = useContext(AuthContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  let importedEmail;

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
          setLastName(jsonResponse[0].userlastname);
          setEmail(jsonResponse[0].useremail);
          setPhone(jsonResponse[0].userphone);
          importedEmail = jsonResponse[0].useremail;
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

    if (importedEmail != email) {
      console.log(
        "adicionar aqui um popup a questionar o user se quer alterar os dados do email dado que é o que usa para fazer login"
      );
    }

    await saveUserData();
  }

  async function saveUserData() {
    try {
      const response = await fetch("http://localhost:8003/saveUserData", {
        method: "POST",
        body: JSON.stringify({
          userID: user,
          firstName: firstName,
          lastName: lastName,
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
        }}
      >
        Edit Profile
      </MDButton>

      <MDButton
        variant="gradient"
        color="info"
        sx={{ mt: 2, mb: 2, ml: 1 }}
        onClick={() => {
          setChangePassActive(true);
          setEditModeActive(false);
        }}
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
                  defaultValue={"teste"}
                  disabled={!editModeActive}
                  sx={{ ml: 2, mt: 2, width: "50%" }}
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
