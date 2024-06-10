import React, { useEffect, useState, useContext } from "react";
import MDButton from "components/MDButton";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import SubmissionsDetails from "OurComponents/Info/SubmissionDetails";
import UpdateSubmission from "OurComponents/Info/updateSubmission";

import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";

export default function AllReviews() {
  const { confID, userRole } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [openLoading, setOpenLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      setOpenLoading(true);

      if (confID && user) {
        try {
          const update = await fetch(
            `${process.env.REACT_APP_API_URL}/myReviews`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
              credentials: "include",
              body: JSON.stringify({
                confid: confID,
              }),
            }
          );

          const response = await update.json();
          if (response.status === 200) {
          }
        } catch (error) {
          setError(<Alert severity="error">Could not fetch submissions</Alert>);
        }
      }
      setOpenLoading(false);
    }

    if (user && confID) {
      fetchReviews();
    }
  }, [confID, user]);

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "authors", headerName: "Authors", width: 200 },
    { field: "addDate", headerName: "Submission Date", width: 120 },
    {
      field: "edit",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 55,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {
              <MDButton
                variant="gradient"
                color="success"
                onClick={() => {}}
                sx={{
                  maxWidth: "60px",
                  maxHeight: "23px",
                  minWidth: "30px",
                  minHeight: "23px",
                }}
              >
                Edit
              </MDButton>
            }
          </div>
        );
      },
    },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConferenceNavBar />
        <Container maxWidth="sm">
          <MDBox mt={10} mb={2} textAlign="left">
            <MDBox mb={3} textAlign="left">
              <Card>
                <MDTypography ml={2} variant="h6">
                  All Reviews
                </MDTypography>
                <MDTypography ml={2} variant="body2">
                  text goes here
                </MDTypography>
              </Card>
            </MDBox>
          </MDBox>

          <Card sx={{ mt: 2, mb: 2 }}>{error}</Card>

          <MDBox mb={3} textAlign="left">
            <Card>
              <CompleteTable
                columns={columns}
                rows={rows}
                numberOfRowsPerPage={100}
                height={200}
              />
            </Card>
          </MDBox>
        </Container>
      </DashboardLayout>
    </>
  );
}
