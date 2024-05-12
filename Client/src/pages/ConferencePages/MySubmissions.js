import React, { useEffect, useState, useContext } from "react";
import MDButton from "components/MDButton";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import SubmissionsDetails from "OurComponents/Info/SubmissionDetails";

import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

export default function MySubmissionsPage() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const { confID } = useContext(ConferenceContext);

  useEffect(() => {
    async function fetchSubmissions() {
      if (confID && user) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/mySubmissions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({
              userID: user,
              confID: confID
            })
          });

          const jsonResponse = await response.json();

          if (response.ok) {
            const transformedData = jsonResponse.map(submission => ({
              id: submission.id,
              title: submission.title,
              authors: submission.authors,
              status: submission.status ? 'Accepted' : 'Pending',
              addDate: formatDate(submission.adddate),
              abstract: submission.abstract
            }));
            setRows(transformedData);
          } else {
            setError("Failed to fetch submissions: " + jsonResponse.message);
          }
        } catch (error) {
          setError("Network error: Could not fetch submissions");
        }
      }
    }

    fetchSubmissions();
  }, [confID, user]);

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "authors", headerName: "Authors", width: 200 },
    {
      field: "moreInfo",
      headerName: "",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 150,
      renderCell: (params) => (
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setDataForDetails(params.row);
            setDetailsOpen(true);
          }}
          sx={{
            maxWidth: "80px",
            maxHeight: "30px",
            minWidth: "30px",
            minHeight: "30px",
          }}
        >
          Details
        </MDButton>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <ConferenceNavBar />
      <Container maxWidth="sm">
        <MDBox mt={10} mb={2} textAlign="left">
          <Card>
            <MDTypography ml={2} variant="h6">
              My Submissions
            </MDTypography>
            <MDTypography ml={2} variant="body2">
              Here you can view and manage your submissions.
            </MDTypography>
          </Card>
          <MDBox mb={3} textAlign="left">
            {error && <Alert severity="error">{error}</Alert>}
            <Card>
              <CompleteTable
                columns={columns}
                rows={rows}
                numberOfRowsPerPage={100}
                height={200}
              />
            </Card>
          </MDBox>
        </MDBox>
      </Container>
      {!detailsOpen ? null : (
        <SubmissionsDetails
          submission={dataForDetails}
          onClose={() => setDetailsOpen(false)}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}