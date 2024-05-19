import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth.context";
import { ConferenceContext } from "../conference.context";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import { v4 as uuidv4 } from "uuid";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";

export default function CallForPapers() {
  const { user } = useContext(AuthContext);
  const { setConfID, setUserRole } = useContext(ConferenceContext);

  const [openLoading, setOpenLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rows, setRow] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function getRows() {
      setOpenLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/callForPapers`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

        const jsonResponse = await response.json();

        if (response.status === 200) {
          for (let line of jsonResponse) {
            line.id = uuidv4();
            setRow((allExistingRows) => [...allExistingRows, line]);
          }
        } else {
          setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }
      } catch (error) {
        setError(
          <Alert severity="error">
            Something went wrong when obtaining the lines
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    getRows();
  }, []);

  const columns = [
    {
      field: "Remove",
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
            <MDButton
              variant="gradient"
              color="info"
              onClick={() => {
                setConfID(params.row.confid);
                setUserRole("Author");
                navigate("/MyConferences/ConferenceDescription");
              }}
              sx={{
                maxWidth: "60px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Submit
            </MDButton>
          </div>
        );
      },
    },
    { field: "confname", headerName: "Name", width: 250 },
    { field: "confcountry", headerName: "Country", width: 180 },
    { field: "confsubmissionend", headerName: "Submission End", width: 150 },
    { field: "confstartdate", headerName: "Start date", width: 150 },
    { field: "conftopics", headerName: "Topics", width: 300 },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <UpperNavBar />

        <MDBox mt={2} mb={2} textAlign="left">
          <MDBox mb={3} textAlign="left">
            <Card>
              <MDTypography ml={2} mt={1} variant="h6">
                Call For Papers
              </MDTypography>
              <MDTypography ml={2} mr={2} mb={2} variant="body2">
                This page is dedicated to inviting scholars, researchers, and
                professionals to submit their work for our upcoming conference.
                By clicking the "Submit" button, you can access the conference
                portal where you can find more detailed information about the
                event, submit your papers, and view your previous submissions.
                We look forward to your contributions and participation!
              </MDTypography>
            </Card>
          </MDBox>

          <MDBox mb={3} textAlign="left">
            <Card>{error}</Card>
          </MDBox>

          <MDBox mb={3}>
            <Card>
              <CompleteTable
                columns={columns}
                rows={rows}
                numerOfRowsPerPage={100}
                height={200}
              />
            </Card>
          </MDBox>
        </MDBox>

        <Footer />
      </DashboardLayout>
    </>
  );
}
