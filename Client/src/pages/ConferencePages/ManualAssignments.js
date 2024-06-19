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
import BlockPageForConfStatus from "OurComponents/errorHandling/BlockPageForConfStatus";

export default function ManualAssignments() {
  const { confID, confPhase } = useContext(ConferenceContext);
  const { isLoggedIn, user } = useContext(AuthContext);

  const [rows, setRows] = useState([]);
  const [rowsForDelete, setRowsForDelete] = useState([]);
  const [message, setMessage] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedReviewersForDelete, setSelectedReviewersForDelete] = useState(
    []
  );
  const [openLoading, setOpenLoading] = useState(false);
  const [blockCrud, setBlockCrud] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchBidsForManualAssignments();
      await fetchAssignmentsForDelete();
    };

    if (isLoggedIn && confID && confPhase) {
      if (confPhase !== "Bidding") setBlockCrud(true);
      else fetchData();
    }
  }, [confID, user, confPhase]);

  async function fetchBidsForManualAssignments() {
    setRows([]);
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
        console.log(rows);
      }
    }
  }

  async function fetchAssignmentsForDelete() {
    setRowsForDelete([]);
    const response = await fetchAPI(
      "getAssignmentsForDelete",
      "POST",
      { confid: confID },
      setMessage,
      setOpenLoading
    );

    if (response) {
      for (let line of response) {
        line.id = uuidv4();
        line.reviewers = splitReviewers(line.reviewers);
        setRowsForDelete((allExistingRows) => [...allExistingRows, line]);
        console.log(rowsForDelete);
      }
    }
  }

  function handleMultiSelectChange(values) {
    setSelectedReviewers(values);
  }

  function handleMultiSelectForDeleteChange(values) {
    setSelectedReviewersForDelete(values);
  }

  const splitReviewers = (reviewers) => {
    return reviewers.split(", ").map((reviewer) => {
      const [id, name] = reviewer.split(": ");
      return { id: parseInt(id, 10), name };
    });
  };

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
      afterRefresh();
      setMessage(<Alert severity="success">Manual Assignment created.</Alert>);
    }
  }

  async function handleDelete(info) {
    if (info.reviewers.length === 0) {
      setMessage(
        <Alert severity="error">
          You must select at least one member to create an assignment.
        </Alert>
      );
    } else {
      await fetchAPI(
        "deleteManualAssignment",
        "POST",
        { info: info, confid: confID },
        setMessage,
        setOpenLoading
      );
      afterRefresh();
      setMessage(<Alert severity="success">Manual Assignment deleted.</Alert>);
    }
  }

  async function afterRefresh() {
    setSelectedReviewers([]);
    setSelectedReviewersForDelete([]);
    await fetchBidsForManualAssignments();
    await fetchAssignmentsForDelete();
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
      renderCell: (params) => (
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
      ),
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
        </div>
      ),
    },
  ];

  const columnsForDelete = [
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
      renderCell: (params) => (
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
            onChange={handleMultiSelectForDeleteChange}
          />
        </div>
      ),
    },
    {
      field: "delete",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 70,
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
            onClick={() => {
              const info = {
                id: params.row.submissionid,
                reviewers: selectedReviewersForDelete,
              };
              handleDelete(info);
            }}
            sx={{
              maxWidth: "70px",
              maxHeight: "23px",
              minWidth: "30px",
              minHeight: "23px",
            }}
          >
            Delete
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
          <Container maxWidth="sm">
            {!blockCrud && (
              <>
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
                      numberOfRowsPerPage={5}
                      height={200}
                    />
                  </Card>
                </MDBox>

                <MDBox mb={3} textAlign="left">
                  <Card>
                    <CompleteTable
                      columns={columnsForDelete}
                      rows={rowsForDelete}
                      numberOfRowsPerPage={5}
                      height={200}
                    />
                  </Card>
                </MDBox>
              </>
            )}
            {blockCrud && (
              <>
                <BlockPageForConfStatus
                  text={
                    "It seems that this conference is not in the bidding phase"
                  }
                />
              </>
            )}
          </Container>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
