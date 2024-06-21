import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import MDBox from "components/MDBox";
import Container from "@mui/material/Container";
import Footer from "OurComponents/footer/Footer";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import ConfereceDetails from "OurComponents/Info/ConfereceDetails";
import Alert from "@mui/material/Alert";
import ConferenceProgressCard from "OurComponents/Info/ConferenceProgressCard";

export default function ConferenceDetails() {
  const { confID } = useContext(ConferenceContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchConfDetails() {
      setOpenLoading(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/conferenceDescription`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
              confID: confID,
            }),
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          setDataForDetails({
            confname: jsonResponse[0].confname,
            conflocation: jsonResponse[0].conflocation,
            confwebpage: jsonResponse[0].confwebpage,
            confowner: jsonResponse[0].confowner,
            confdescription: jsonResponse[0].confdescription,
            confstartsubmission: jsonResponse[0].confstartsubmission,
            confendsubmission: jsonResponse[0].confendsubmission,
            confstartreview: jsonResponse[0].confstartreview,
            confendreview: jsonResponse[0].confendreview,
            confstartbidding: jsonResponse[0].confstartbidding,
            confendbidding: jsonResponse[0].confendbidding,
            confstartdate: jsonResponse[0].confstartdate,
            confenddate: jsonResponse[0].confenddate,
            conftypename: jsonResponse[0].conftypename,
            confareaname: jsonResponse[0].confareaname,
            confadddate: jsonResponse[0].confadddate,
            confcontact: jsonResponse[0].confcontact,
          });
        } else {
          setMessage(
            <Alert severity="error">
              Failed to fetch conference details: {jsonResponse.message}
            </Alert>
          );
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">Failed to fetch conference details!</Alert>
        );
      }
      setOpenLoading(false);
    }

    if (confID) {
      fetchConfDetails();
    }
  }, [confID]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Container maxWidth="sm">
            <MDBox mt={10} textAlign="left">
              <ConferenceProgressCard confID={confID} />
            </MDBox>

            <MDBox mt={2} mb={2} textAlign="left">
              {message}
              <MDBox mb={3} textAlign="left">
                <ConfereceDetails text={dataForDetails} />
              </MDBox>
            </MDBox>
          </Container>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
