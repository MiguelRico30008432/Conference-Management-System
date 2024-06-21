import React, { useEffect, useState, useContext } from "react";
import MDButton from "components/MDButton";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import { fetchAPI } from "OurFunctions/fetchAPI";
import { v4 as uuidv4 } from "uuid";
import MultiReviewsDone from "OurComponents/Info/MultiReviewsDone";
import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";
import ModalInfo from "OurComponents/Modal/ModalInfo";

export default function AutomaticAssignments() {
  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [message, setMessage] = useState(null);
  const [title, setTile] = useState(null);
  const [submissionID, setSubmissionID] = useState(null);
  const [rows, setRows] = useState([]);

  const [openLoading, setOpenLoading] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && confID) getAutomaticAssignments();
  }, [confID, user]);

  async function getAutomaticAssignments() {
    const response = await fetchAPI(
      "getAutomaticAssignments",
      "POST",
      { confid: confID },
      setError,
      setOpenLoading
    );

    if (response) {
      for (let line of response.result) {
        line.id = uuidv4();
        setRows((allExistingRows) => [...allExistingRows, line]);
      }
    }
  }

  async function handleAssignmentAlgorithm() {
    setOpenLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reviewsAssignmentsAlgorithm`,
        {
          method: "POST",
          body: JSON.stringify({
            confid: confID,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      if (response) {
        setRows([]);
        getAutomaticAssignments();

        setMessage(
          <Alert severity="success">
            Reviews Assignments list has been updated.
          </Alert>
        );
      }
    } catch (error) {
      setMessage(
        <Alert severity="error">
          Something went wrong running the algorithm
        </Alert>
      );
    }

    setOpenLoading(false);
  }

  const columns = [
    { field: "submissiontitle", headerName: "Submission Title", width: 300 },
    { field: "committeemember", headerName: "Committee Member", width: 200 },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConferenceNavBar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {openReview ? (
            <ModalInfo open={true} onClose={() => setOpenReview(false)}>
              <MultiReviewsDone
                submissionID={submissionID}
                title={title}
                onClose={() => setOpenReview(false)}
              />
            </ModalInfo>
          ) : (
            <Container maxWidth="sm">
              <MDBox mt={10} mb={2} textAlign="left">
                <MDBox mb={3} textAlign="left">
                  <Card>
                    <MDTypography ml={2} variant="h6">
                      Automatic Reviews
                    </MDTypography>
                    <MDTypography ml={2} variant="body2">
                      Here you can run the algorithm that assigns submissions to
                      reviewers and see the assignments made.
                    </MDTypography>
                  </Card>
                </MDBox>
              </MDBox>
              <Card sx={{ mt: 2, mb: 2 }}>{message}</Card>
              <MDButton
                variant="gradient"
                color="warning"
                onClick={async () => handleAssignmentAlgorithm()}
                sx={{
                  maxWidth: "300px",
                  maxHeight: "30px",
                  minWidth: "5px",
                  minHeight: "30px",
                  ml: 2,
                  mb: 1,
                }}
              >
                Run Review Assignment Algorithm
              </MDButton>{" "}
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
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
