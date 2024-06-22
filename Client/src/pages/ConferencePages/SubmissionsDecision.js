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
import { v4 as uuidv4 } from "uuid";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import SubmissionDecisionDetails from "OurComponents/Info/SubmissionDecisionDetails";
import BlockPageForConfStatus from "OurComponents/errorHandling/BlockPageForConfStatus";

import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";

export default function SubmissionsDecision() {
  const { confID, confPhase } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [openLoading, setOpenLoading] = useState(false);
  const [error, setError] = useState(null);
  const [blockCrud, setBlockCrud] = useState(false);
  const [rows, setRows] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({
    title: "",
    reviews: [],
  });

  useEffect(() => {
    if (user && confID && confPhase) {
      if (confPhase !== "Pre-Conference") setBlockCrud(true);
      else fetchSubmissions();
    }
  }, [confID, user, confPhase]);

  const fetchSubmissions = async () => {
    setOpenLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/allSubmissionsDecisions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ confid: confID }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();

      // Filter submissions where submissiondecisionmade is false
      const filteredData = data.filter((item) => !item.submissiondecisionmade);
      setRows(filteredData.map((item) => ({ ...item, id: uuidv4() })));
    } catch (error) {
      setError(<Alert severity="error">{error.message}</Alert>);
    } finally {
      setOpenLoading(false);
    }
  };

  const sendDecision = async (submissionId, decisionValue) => {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/acceptOrRejectDecision`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          credentials: "include",
          body: JSON.stringify({ submissionId, acceptOrReject: decisionValue }),
        }
      );

      if (response.ok) {
        await fetchSubmissions();
        const message =
          decisionValue === 2 ? "Submission Accepted" : "Submission Rejected";
        setError(<Alert severity="success">{message}</Alert>);
      } else {
        const jsonResponse = await response.json();
        setError(<Alert severity="error">{jsonResponse.message}</Alert>);
      }
    } catch (error) {
      setError(
        <Alert severity="error">Could not update submission status</Alert>
      );
    }
    setOpenLoading(false);
  };

  const fetchDetails = async (submissionId, submissionTitle) => {
    setOpenLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/submissionDecisionDetails`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ submissionId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }

      const data = await response.json();
      setDataForDetails({ title: submissionTitle, reviews: data });
      setDetailsOpen(true);
    } catch (error) {
      setError(<Alert severity="error">{error.message}</Alert>);
    } finally {
      setOpenLoading(false);
    }
  };

  const columns = [
    { field: "submissiontitle", headerName: "Title", width: 200 },
    { field: "authors", headerName: "Authors", width: 200 },
    { field: "averagegrade", headerName: "Average Grade", width: 120 },
    {
      field: "details",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 80,
      renderCell: (params) => (
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
            color="info"
            onClick={() =>
              fetchDetails(params.row.submissionid, params.row.submissiontitle)
            }
            sx={{
              maxWidth: "60px",
              maxHeight: "23px",
              minWidth: "30px",
              minHeight: "23px",
            }}
          >
            Details
          </MDButton>
        </div>
      ),
    },
    {
      field: "accept",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 80,
      renderCell: (params) => (
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
            color="success"
            onClick={() => sendDecision(params.row.submissionid, 2)}
            sx={{
              maxWidth: "60px",
              maxHeight: "23px",
              minWidth: "30px",
              minHeight: "23px",
            }}
          >
            Accept
          </MDButton>
        </div>
      ),
    },
    {
      field: "reject",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 80,
      renderCell: (params) => (
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
            color="error"
            onClick={() => sendDecision(params.row.submissionid, 1)}
            sx={{
              maxWidth: "60px",
              maxHeight: "23px",
              minWidth: "30px",
              minHeight: "23px",
            }}
          >
            Reject
          </MDButton>
        </div>
      ),
    },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConferenceNavBar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {!blockCrud && (
            <>
              <Container maxWidth="sm">
                <MDBox mt={10} mb={2} textAlign="left">
                  <MDBox mb={3} textAlign="left">
                    <Card>
                      <MDTypography ml={2} variant="h6">
                        Submissions Decision
                      </MDTypography>
                      <MDTypography ml={2} variant="body2">
                        Here you can view and manage submissions decisions.
                      </MDTypography>
                    </Card>

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
                  </MDBox>
                </MDBox>
              </Container>
              {detailsOpen && (
                <SubmissionDecisionDetails
                  submission={dataForDetails}
                  onClose={() => setDetailsOpen(false)}
                />
              )}
            </>
          )}
          {blockCrud && (
            <>
              <BlockPageForConfStatus
                text={
                  "It seems that this conference is not in the Pre-Conference phase"
                }
              />
            </>
          )}
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
