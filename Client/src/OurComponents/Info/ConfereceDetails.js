import * as React from "react";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import MDTypography from "components/MDTypography";
import { Box, Card, Container, Tab, Typography } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";

export default function ConferenceDetails({
  displayCloseButton = false,
  onClose,
  text,
}) {
  const [value, setValue] = React.useState("1");
  const [showCloseButton, setShowCloseButton] = useState(true);

  useEffect(() => {
    if (displayCloseButton) setShowCloseButton(true);
    else setShowCloseButton(false);
  }, [displayCloseButton]);

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
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
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
                <Grid container spacing={3}>
                  {/* Submissions Phase */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Submissions Phase</Typography>
                    <TextField
                      name="Start"
                      label="Start Date"
                      disabled
                      value={text.confstartsubmission}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <TextField
                      name="End"
                      label="End Date"
                      disabled
                      value={text.confendsubmission}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Bidding Phase */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Bidding Phase</Typography>
                    <TextField
                      name="Start"
                      label="Start Date"
                      disabled
                      value={text.confstartbidding}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <TextField
                      name="End"
                      label="End Date"
                      disabled
                      value={text.confendbidding}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Review Phase */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Review Phase</Typography>
                    <TextField
                      name="Start"
                      label="Start Date"
                      disabled
                      value={text.confstartreview}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <TextField
                      name="End"
                      label="End Date"
                      disabled
                      value={text.confendreview}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference</Typography>
                    <TextField
                      name="Start"
                      label="Start Date"
                      disabled
                      value={text.confstartdate}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />

                    <TextField
                      name="End"
                      label="End Date"
                      disabled
                      value={text.confenddate}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value="3">
                <Grid container spacing={3}>
                  {/* Conference Creator */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference Creator:</Typography>
                    <TextField
                      name="Conference Creator"
                      disabled
                      value={text.confowner}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference WebPage */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference WebPage:</Typography>
                    <TextField
                      name="Conference WebPage"
                      disabled
                      value={text.confwebpage}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference Contact */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference Contact:</Typography>
                    <TextField
                      name="Conference Contact"
                      disabled
                      value={text.confcontact}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference Location */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference Location:</Typography>
                    <TextField
                      name="Conference Location"
                      disabled
                      value={`${text.confcity} (${text.confcountry})`}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference Area */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference Area:</Typography>
                    <TextField
                      name="Conference Area"
                      disabled
                      value={text.confareaid}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference Type */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference Type:</Typography>
                    <TextField
                      name="Conference Type"
                      disabled
                      value={text.conftype}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>

                  {/* Conference Created */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="h6">Conference Created:</Typography>
                    <TextField
                      name="Conference Created"
                      disabled
                      value={text.confadddate}
                      fullWidth
                      sx={{ mt: 1, mb: 2 }}
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </TabContext>

            {showCloseButton && (
              <MDButton
                variant="gradient"
                color="info"
                sx={{
                  maxWidth: "150px",
                  maxHeight: "30px",
                  minWidth: "5px",
                  minHeight: "30px",
                  mt: 2,

                  mb: 2,
                }}
                onClick={onClose}
              >
                Close Details
              </MDButton>
            )}
          </Box>
        </Container>
      </Card>
    </>
  );
}
