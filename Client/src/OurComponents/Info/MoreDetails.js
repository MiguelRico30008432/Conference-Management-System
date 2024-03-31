import * as React from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

export default function MoreDetails({ onClose, text }) {
  return (
    <>
      <Card>
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
              {`ID ${text.id}`}
              {`Last Name: ${text.lastName}`}
            </MDTypography>
            <MDButton
              variant="gradient"
              color="info"
              sx={{ mt: 2, mb: 2 }}
              onClick={onClose}
            >
              Close Details
            </MDButton>
          </Box>
        </Container>
      </Card>
    </>
  );
}
