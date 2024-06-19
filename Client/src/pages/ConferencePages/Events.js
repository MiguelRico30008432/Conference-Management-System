import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CompleteTable from "OurComponents/Table/CompleteTable";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import { v4 as uuidv4 } from "uuid";
import Alert from "@mui/material/Alert";
import Footer from "OurComponents/footer/Footer";

export default function Events() {
  const { confID, userRole } = useContext(ConferenceContext);

  const [openLoading, setOpenLoading] = useState(false);
  const [error, setError] = useState(null);

  const [rows, setRow] = useState([]);

  useEffect(() => {
    async function getRows() {
      setOpenLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/allEvents`,
          {
            method: "POST",
            body: JSON.stringify({ confid: confID }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          for (let line of jsonResponse) {
            line.id = uuidv4();
            setRow((allExistingRows) => [...allExistingRows, line]);
          }
        } else {
          setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }
      } catch (error) {
        setError(
          <Alert severity="error">
            Something went wrong when obtaining the lines
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    if (confID > 0) {
      getRows();
    }
  }, [confID]);

  const columns = [
    { field: "eventuser", headerName: "Done By", width: 150 },
    { field: "eventdate", headerName: "Date", width: 120 },
    { field: "eventhour", headerName: "Hour", width: 100 },
    { field: "eventname", headerName: "Event", width: 600 },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              <MDBox mb={3} textAlign="left">
                <Card>
                  <MDTypography ml={2} variant="h6">
                    Events
                  </MDTypography>
                  <MDTypography ml={2} mr={2} mb={2} variant="body2">
                    Here you can stay updated with all the events happening
                    during the conference. This page provides a comprehensive
                    overview of the schedule, ensuring you don't miss any
                    important thing. Check back regularly to stay informed about
                    the latest updates and changes. Enjoy the conference!
                  </MDTypography>
                </Card>
              </MDBox>

              <MDBox mb={3} textAlign="left">
                <Card>{error}</Card>
              </MDBox>

              <MDBox mb={3}>
                <Card>
                  <CompleteTable
                    columns={columns}
                    rows={rows}
                    numberOfRowsPerPage={10}
                    height={350}
                  />
                </Card>
              </MDBox>
            </MDBox>
          </Container>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
