import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Alert } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Event Eagle
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function LoginPage() {
  const [alert, setAlert] = useState<React.ReactNode | null>(null);
  const navigate = useNavigate();
  function loginSubmit(event: any) {
    event.preventDefault();

    const email = document.getElementById("email") as any;
    const password = document.getElementById("password") as any;

    const loginOK = verifyLogin(email.value, password.value);
  }

  function verifyLogin(email: string, password: string) {
    if (email === "" && password !== "") {
      setAlert(<Alert severity="error">You must insert an email!</Alert>);
    } else if (password === "" && email !== "") {
      setAlert(<Alert severity="error">You must insert a password!</Alert>);
    } else if (email === "" && password === "") {
      setAlert(<Alert severity="error">Please insert your data</Alert>);
    } else {
      setAlert(null);
      return true;
    }

    return false;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />

      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={loginSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Button style={{ textTransform: "none" }}>
                <Link variant="body2">Forgot password?</Link>
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{ textTransform: "none" }}
                onClick={() => {
                  navigate("/signUp");
                }}
              >
                <Link variant="body2">"Don't have an account? Sign Up"</Link>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {alert}
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
