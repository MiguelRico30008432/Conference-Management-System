import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import Footer from "OurComponents/footer/Footer";
import * as React from "react";
import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MDBox from "components/MDBox";

export default function Compose() {
  const { confID, userRole } = useContext(ConferenceContext);
  const [recipient, setRecipient] = useState("");

  const handleSendEmail = (event) => {
    event.preventDefault();
    // Implement your logic for sending an email here
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  return (
    <DashboardLayout>
      <ConfNavbar />
      <Container maxWidth="sm">
        <MDBox mt={10} textAlign="left">
          <MDBox textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                Send Email
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                text goes here
              </MDTypography>
            </Card>
          </MDBox>
          <Card sx={{ mt: 3, p: 3 }}>
            <Box component="form" onSubmit={handleSendEmail} noValidate>
              <MDTypography variant="body2">Send To</MDTypography>
              <FormControl
                fullWidth
                margin="normal"
                variant="outlined"
                sx={{ width: "100%" }}
              >
                <Select
                  id="recipient"
                  value={recipient}
                  onChange={handleRecipientChange}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  IconComponent={() => <ArrowDropDownIcon />} // Use IconComponent to display the arrow
                  sx={{ height: "3rem" }} // Adjust height here
                >
                  <MenuItem value="" disabled>
                    Choose a Group to Send the Email
                  </MenuItem>
                  <MenuItem value="chair">Chair</MenuItem>
                  <MenuItem value="committee">Committee</MenuItem>
                </Select>
              </FormControl>
              <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Subject *
              </MDTypography>
              <Box
                sx={{
                  "& textarea": {
                    width: "100%",
                    padding: "18.5px 14px",
                    fontSize: "0.9rem",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    border: "1px solid #c4c4c4",
                    borderRadius: "4px",
                    "&:focus": {
                      outline: "2px solid #3f51b5",
                      borderColor: "transparent",
                    },
                    resize: "vertical",
                  },
                }}
              >
                <textarea
                  aria-label="Subject"
                  rows={1}
                  placeholder="Enter your subject here"
                  required
                />
              </Box>
              <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Description *
              </MDTypography>
              <Box
                sx={{
                  "& textarea": {
                    width: "100%",
                    padding: "18.5px 14px",
                    fontSize: "0.9rem",
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    border: "1px solid #c4c4c4",
                    borderRadius: "4px",
                    "&:focus": {
                      outline: "2px solid #3f51b5",
                      borderColor: "transparent",
                    },
                    resize: "vertical",
                  },
                }}
              >
                <textarea
                  aria-label="Description"
                  rows={4}
                  placeholder="Enter your description here"
                  required
                />
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, color: "white !important" }}
              >
                Send Email
              </Button>
            </Box>
          </Card>
        </MDBox>
      </Container>
      <br></br>
      <Footer />
    </DashboardLayout>
  );
}
