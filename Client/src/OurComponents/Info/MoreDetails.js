import * as React from "react";
import { useEffect } from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import {
  Box,
  Card,
  Container,
  Tab
} from "@mui/material";
import {
  TabContext,
  TabList,
  TabPanel 
} from "@mui/lab"

export default function MoreDetails({ onClose, text }) {
  const [value, setValue] = React.useState('1');
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    function test(){
      console.log(text);
    }

    test();
  }, []);

  return (
    <>
      <Card>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <MDTypography
              variant="h10"
              fontWeight="medium"
              color="grey"
              textAlign="center"
              sx={{ mb: 3 }}
              mt={1}
            >
              {text.confname}
            </MDTypography>

            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Description" value="1" />
                  <Tab label="Important Dates" value="2" />
                  <Tab label="Details" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <MDTypography variant="body2">{text.confdescription}</MDTypography>
              </TabPanel>

              <TabPanel value="2">
                <MDTypography variant="h6">Conference</MDTypography>
                <MDTypography variant="body2">Start: {text.confstartdate}</MDTypography>
                <MDTypography variant="body2">End: {text.confenddate}<br/><br/></MDTypography>

                <MDTypography variant="h6">Submissions</MDTypography>
                <MDTypography variant="body2">Start: {text.confstartsubmission}</MDTypography>
                <MDTypography variant="body2">End: {text.confendsubmission}<br/><br/></MDTypography>

                <MDTypography variant="h6">Bidding</MDTypography>
                <MDTypography variant="body2">Start: {text.confstartbidding}</MDTypography>
                <MDTypography variant="body2">End: {text.confendbidding}<br/><br/></MDTypography>

                <MDTypography variant="h6">Reviews</MDTypography>
                <MDTypography variant="body2">Start: {text.confstartreview}</MDTypography>
                <MDTypography variant="body2">End: {text.confendreview}</MDTypography>
              </TabPanel>

              <TabPanel value="3">
              <MDTypography variant="h6">Conference Area:</MDTypography>
              <MDTypography variant="body2">{text.confareaname}<br/><br/></MDTypography>

              <MDTypography variant="h6">Conference Code:</MDTypography>
              <MDTypography variant="body2">{text.confcode}<br/><br/></MDTypography>

              <MDTypography variant="h6">Max number of submissions</MDTypography>
              <MDTypography variant="body2">{text.confmaxsubmissions}<br/><br/></MDTypography>

              <MDTypography variant="h6">Min-Max number of reviewers</MDTypography>
              <MDTypography variant="body2">{text.confminreviewers} - {text.confmaxreviewers}</MDTypography>
              </TabPanel>
            </TabContext>

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
