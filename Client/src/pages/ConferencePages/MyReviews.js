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
import { v4 as uuidv4 } from "uuid";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import ReviewsDone from "OurComponents/Info/ReviewsDone";

import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";
import { handleDownload } from "OurFunctions/DownloadFile";

export default function MyReviews() {
  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [openLoading, setOpenLoading] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [error, setError] = useState(null);

  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      setOpenLoading(true);

      if (confID && user) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/myReviews`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
              credentials: "include",
              body: JSON.stringify({
                userid: user,
                confid: confID,
              }),
            }
          );

          const jsonResponse = await response.json();
          if (response.status === 200) {
            for (let line of jsonResponse) {
              line.id = uuidv4();
              setRows((allExistingRows) => [...allExistingRows, line]);
            }
          }
        } catch (error) {
          setError(<Alert severity="error">Could not fetch Reviews</Alert>);
        }
      }
      setOpenLoading(false);
    }

    if (user && confID) {
      fetchReviews();
    }
  }, [confID, user]);

  const columns = [
    { field: "submissiontitle", headerName: "Submission Title", width: 300 },
    { field: "submissionadddate", headerName: "Submission Date", width: 150 },
    { field: "username", headerName: "Main Author", width: 200 },
    {
      field: "download",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 130,
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
            <MDButton
              variant="gradient"
              color="warning"
              onClick={() => {
                const submission = {
                  id: params.row.submissionid,
                  title: params.row.submissiontitle,
                };

                handleDownload(submission, setError, setOpenLoading);
              }}
              sx={{
                maxWidth: "120px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Download File
            </MDButton>
          </div>
        );
      },
    },
    {
      field: "open",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 70,
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
                color="info"
                onClick={() => {
                  setOpenReview(true);
                }}
                sx={{
                  maxWidth: "70px",
                  maxHeight: "23px",
                  minWidth: "30px",
                  minHeight: "23px",
                }}
              >
                Review
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
      {openReview ? (
        <ReviewsDone submissionID={142} onClose={() => setOpenReview(false)} />
      ) : (
        <DashboardLayout>
          <ConferenceNavBar />
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              <MDBox mb={3} textAlign="left">
                <Card>
                  <MDTypography ml={2} variant="h6">
                    My Reviews
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
      )}
    </>
  );
}
