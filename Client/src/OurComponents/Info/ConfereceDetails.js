import * as React from "react";
import { useEffect } from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import { Box, Card, Container, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

export default function ConferenceDetails({ onClose, text }) {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    function test() {}

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
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Description" value="1" />
                  <Tab label="Important Dates" value="2" />
                  <Tab label="Details" value="3" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <MDTypography variant="body2">
                  {text.confdescription}
                </MDTypography>
              </TabPanel>

              <TabPanel value="2">
                <MDTypography variant="h6">Submissions Phase</MDTypography>
                <MDTypography variant="body2">
                  Start: {text.confstartsubmission}
                </MDTypography>
                <MDTypography variant="body2">
                  End: {text.confendsubmission}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Bidding Phase</MDTypography>
                <MDTypography variant="body2">
                  Start: {text.confstartbidding}
                </MDTypography>
                <MDTypography variant="body2">
                  End: {text.confendbidding}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Review Phase</MDTypography>
                <MDTypography variant="body2">
                  Start: {text.confstartreview}
                </MDTypography>
                <MDTypography variant="body2">
                  End: {text.confendreview}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference</MDTypography>
                <MDTypography variant="body2">
                  Start: {text.confstartdate}
                </MDTypography>
                <MDTypography variant="body2">
                  End: {text.confenddate}
                </MDTypography>
              </TabPanel>

              <TabPanel value="3">
                <MDTypography variant="h6">Conference Creator:</MDTypography>
                <MDTypography variant="body2">
                  {text.confowner}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference WebPage:</MDTypography>
                <MDTypography variant="body2">
                  {text.confwebpage}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference Contact:</MDTypography>
                <MDTypography variant="body2">
                  {text.confcontact}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference Location:</MDTypography>
                <MDTypography variant="body2">
                  {text.confcity + " (" + text.confcountry + ")"}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference Area:</MDTypography>
                <MDTypography variant="body2">
                  {text.confareaid}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference Type:</MDTypography>
                <MDTypography variant="body2">
                  {text.conftype}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">
                  Min-Max number of reviewers
                </MDTypography>
                <MDTypography variant="body2">
                  {text.confminreviewers} - {text.confmaxreviewers}
                  <br />
                  <br />
                </MDTypography>

                <MDTypography variant="h6">Conference Created:</MDTypography>
                <MDTypography variant="body2">{text.confadddate}</MDTypography>
              </TabPanel>
            </TabContext>
          </Box>
        </Container>
      </Card>
    </>
  );
}
