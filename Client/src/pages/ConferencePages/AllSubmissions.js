import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";
import CompleteTable from "OurComponents/Table/CompleteTable";
import SubmissionsDetails from "OurComponents/Info/SubmissionDetails";
import Footer from "OurComponents/footer/Footer";

export default function AllSubmissions() {
  const { confID } = useContext(ConferenceContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [rows, setRows] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});

  useEffect(() => {
    async function fetchAllSubmissions() {
      setOpenLoading(true);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/allSubmissions`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
            credentials: "include",
            body: JSON.stringify({ confID: confID }),
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          for (let line of jsonResponse) {
            line.id = uuidv4();
            setRows((allExistingRows) => [...allExistingRows, line]);
          }
        } else {
          setMessage(<Alert severity="error">{jsonResponse.message}</Alert>);
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">Failed to fetch conference details!</Alert>
        );
      }
      setOpenLoading(false);
    }

    if (isLoggedIn && confID) {
      fetchAllSubmissions();
    }
  }, [confID, isLoggedIn]);

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "authors", headerName: "Authors", width: 200 },
    { field: "adddate", headerName: "Submission Date", width: 120 },
    {
      field: "moreInfo",
      headerName: "",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 150,
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
              color="info"
              onClick={() => {
                setDataForDetails(params.row);
                setDetailsOpen(true);
              }}
              sx={{
                maxWidth: "80px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Details
            </MDButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />

        <Container maxWidth="sm">
          <MDBox mt={8} mb={2} textAlign="left">
            <MDBox mb={3} textAlign="left">
              <Card>
                <MDTypography ml={2} variant="h6">
                  All Submissions
                </MDTypography>
                <MDTypography ml={2} variant="body2">
                  Welcome to the My Submissions Page! Here, you can manage all
                  your conference submissions. You can view details of each
                  submission, including title, authors, status, and date. Easily
                  update your submissions by clicking the "Edit" button,
                  download submitted files by clicking "Download File," and
                  remove a submission by clicking "Delete Submission" and
                  confirming your action.
                </MDTypography>
              </Card>

              <Card sx={{ mt: 2, mb: 2 }}>{message}</Card>

              <MDBox mb={3} mt={2} textAlign="left">
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
          <SubmissionsDetails
            submission={dataForDetails}
            onClose={() => setDetailsOpen(false)}
          />
        )}

        <Footer />
      </DashboardLayout>
    </>
  );
}
