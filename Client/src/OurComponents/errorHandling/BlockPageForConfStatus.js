import { useNavigate } from "react-router-dom";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import * as React from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function BlockPageForConfStatus({ title, text }) {
  const navigate = useNavigate();

  return (
    <Card sx={{ ml: 30, mr: 30, mt: 15 }}>
      <MDBox
        variant="gradient"
        bgColor="error"
        borderRadius="lg"
        coloredShadow="success"
        mx={17}
        mt={-3}
        p={1}
        mb={1}
        textAlign="center"
      >
        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
          Oh My...
        </MDTypography>
      </MDBox>
      <Box
        sx={{
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
          {text}
        </MDTypography>
        <MDButton
          variant="gradient"
          color="info"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => navigate("/MyConferences/ConferenceDescription")}
        >
          Return to Conference
        </MDButton>
      </Box>
    </Card>
  );
}
