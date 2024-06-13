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
import { fetchAPI } from "OurFunctions/fetchAPI";
import { v4 as uuidv4 } from "uuid";
import { handleDownload } from "OurFunctions/DownloadFile";
import ReviewsDone from "OurComponents/Info/ReviewsDone";

import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";

export default function AllReviews() {
  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [title, setTile] = useState(null);
  const [assignmentID, setAssignmentID] = useState(null);
  const [rows, setRows] = useState([]);

  const [openLoading, setOpenLoading] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      const response = await fetchAPI(
        "myReviews",
        "POST",
        { userid: user, confid: confID },
        setError,
        setOpenLoading
      );

      if (response) {
        for (let line of response) {
          line.id = uuidv4();
          setRows((allExistingRows) => [...allExistingRows, line]);
        }
      }
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
      field: "review",
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
                  setAssignmentID(params.row.assignmentid);
                  setTile(params.row.submissiontitle);
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
      <DashboardLayout>
        <ConferenceNavBar />
        {openReview ? (
          <ReviewsDone
            singleUser={false}
            assignmentID={assignmentID}
            title={title}
            onClose={() => setOpenReview(false)}
          />
        ) : (
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
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
}
