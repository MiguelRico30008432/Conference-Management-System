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
import CompleteTable from "OurComponents/Table/CompleteTable";
import AllSubmissionsDetails from "OurComponents/Info/AllSubmissionsDetails";
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
        const response = await fetch(`${process.env.REACT_APP_API_URL}/allSubmissions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            confID: confID
          })
        });

        const jsonResponse = await response.json();

        if (response.status === 200) {
          const transformedData = jsonResponse.map(submission => ({
            id: submission.submissionid,
            title: submission.submissiontitle,
            authors: submission.authors,
            addDate: formatDate(submission.submissionadddate),
            abstract: submission.submissionabstract
          }));

          setRows(transformedData);

        } else {
          setMessage(
            <Alert severity="error">
              Failed to fetch submissions:: {jsonResponse.message}
            </Alert>
          );
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">
            Failed to fetch conference details!
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    if(isLoggedIn && confID){
      fetchAllSubmissions()
    }
  }, [confID, isLoggedIn]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

const columns = [
  { field: "title", headerName: "Title", width: 200 },
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
    <>
    {openLoading && <LoadingCircle />}
    <DashboardLayout>
      <ConfNavbar />
      {!detailsOpen ? (
        <Container maxWidth="sm">
          <MDBox mt={8} mb={2} textAlign="left">
            <MDBox mb={3} textAlign="left">
              <Card>
                <MDTypography ml={2} variant="h6">
                  AllSubmissions
                </MDTypography>
                <MDTypography ml={2} variant="body2">
                  text goes here
                </MDTypography>
              </Card>
              <MDBox mb={3} mt={2} textAlign="left">
                {message && <Alert severity="error">{message}</Alert>}
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
      ) : (
        <Container maxWidth="sm">
          <AllSubmissionsDetails 
            submission={dataForDetails}
            onClose={() => setDetailsOpen(false)}
          />
        </Container>
      )}
      <Footer />
    </DashboardLayout>
    </>
  );
}
