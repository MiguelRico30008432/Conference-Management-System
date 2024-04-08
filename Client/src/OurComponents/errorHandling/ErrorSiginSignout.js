// react-router-dom components
import { useNavigate } from "react-router-dom";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

//Layout Component
import SignInAndOutLayout from "OurLayouts/SignInAndOutLayout";

// @mui material components
import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function ErrorSiginSignout({ backgourndImage, text }) {
  const navigate = useNavigate();
  return (
    <SignInAndOutLayout image={backgourndImage}>
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
              {text
                ? text
                : "There was an error during the Sign In. Please come back later."}
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
