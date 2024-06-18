import React, { useEffect, useState, useContext } from "react";
import MDButton from "components/MDButton";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import MultiSelect from "OurComponents/ComboBoxes/UsersComboBox";
import Alert from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import { fetchAPI } from "OurFunctions/fetchAPI";
import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";

export default function ManualAssignments() {
  const { confID } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);

  const [openLoading, setOpenLoading] = useState(false);

  useEffect(async () => {
    if (user && confID) {
      fetchBidsForManualAssignments();
    }
  }, [confID, user]);

  async function fetchBidsForManualAssignments() {
    const response = await fetchAPI(
      "getBiddings",
      "POST",
      { confid: confID },
      setMessage,
      setOpenLoading
    );

    if (response) {
      for (let line of response) {
        line.id = uuidv4();
        line.reviewers = splitReviewers(line.reviewers);
        setRows((allExistingRows) => [...allExistingRows, line]);
      }
    }
  }

  const handleMultiSelectChange = (values) => {
    setSelectedReviewers(values);
  };

  function splitReviewers(reviewers) {
    return reviewers.split(", ").map((reviewer) => {
      const [id, name] = reviewer.split(": ");
      return { id: parseInt(id, 10), name: name };
    });
  }

  async function handleSubmit(info) {
    if (info.reviewers.length === 0) {
      setMessage(
        <Alert severity="error">
          You must select at least one member to create an assignment.
        </Alert>
      );
    } else {
      await fetchAPI(
        "createManualAssignment",
        "POST",
        { info: info, confid: confID },
        setMessage,
        setOpenLoading
      );

      fetchBidsForManualAssignments();
    }
  }

  const columns = [
    { field: "submissiontitle", headerName: "Submission Title", width: 300 },
    { field: "author", headerName: "Main Author", width: 200 },
    {
      field: "reviewers",
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
            <MultiSelect
              users={params.row.reviewers}
              onChange={handleMultiSelectChange}
            />
          </div>
        );
      },
    },
    {
      field: "submit",
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
                  const info = {
                    id: params.row.submissionid,
                    reviewers: selectedReviewers,
                  };

                  handleSubmit(info);
                }}
                sx={{
                  maxWidth: "70px",
                  maxHeight: "23px",
                  minWidth: "30px",
                  minHeight: "23px",
                }}
              >
                Submit
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
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              <MDBox mb={3} textAlign="left">
                <Card>
                  <MDTypography ml={2} variant="h6">
                    Manual Assignments
                  </MDTypography>
                  <MDTypography ml={2} variant="body2">
                    TEXT
                  </MDTypography>
                </Card>
              </MDBox>
            </MDBox>

            <Card sx={{ mt: 2, mb: 2 }}>{message}</Card>

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
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
