import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import { useNavigate } from "react-router-dom";
import CompleteTable from "OurComponents/Table/CompleteTable";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth.context";
import { ConferenceContext } from "../conference.context";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import { fetchAPI } from "OurFunctions/fetchAPI";
import { v4 as uuidv4 } from "uuid";

export default function MyConferences() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const { setConfID, setUserRole, setConfPhase } =
    useContext(ConferenceContext);

  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function getMyConferences() {
      const response = await fetchAPI(
        "myConferences",
        "POST",
        { userid: user },
        setError,
        setOpenLoading
      );

      if (response) {
        for (let line of response) {
          line.id = uuidv4();
          setRow((allExistingRows) => [...allExistingRows, line]);
        }
      }
    }

    if (isLoggedIn) {
      getMyConferences();
    }
  }, [isLoggedIn]);

  const columns = [
    {
      field: "Enter",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 90,

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
              onClick={async () => {
                setConfID(params.row.confid);
                setUserRole(params.row.userrole);
                setConfPhase(params.row.confphase);
                await saveConfIDOnUser(params.row.confid);
                navigate("/MyConferences/ConferenceDescription");
              }}
              sx={{
                maxWidth: "50px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Enter
            </MDButton>
          </div>
        );
      },
    },
    { field: "confname", headerName: "Conference Name", width: 450 },
    { field: "confphase", headerName: "Conference Phase", width: 200 },
    { field: "userrole", headerName: "Your Role", width: 200 },
  ];

  async function saveConfIDOnUser(confID) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/updateConfContext`,
        {
          method: "POST",
          body: JSON.stringify({ userid: user, confid: confID }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );

      if (response.status !== 200) {
        const jsonResponse = await response.json();
        setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setError(
        <Alert severity="error">
          Something went wrong when obtaining the lines
        </Alert>
      );
    }
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <UpperNavBar whereIAm={"My Conferences"} />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <MDBox mb={3} mt={2} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                My Conferences
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                On this page, you'll find a comprehensive list of all the
                conferences you are participating in. Once inside, you'll have
                access to a wealth of resources, sessions, and interactive
                features tailored to enhance your conference experience.
              </MDTypography>

              <MDTypography ml={2} variant="body2">
                To explore any conference further, simply click on the "Enter"
                button next to its details.
              </MDTypography>
            </Card>
          </MDBox>
          {error}
          <Card>
            <CompleteTable
              columns={columns}
              rows={rows}
              numberOfRowsPerPage={10}
              height={200}
            />
          </Card>
        </MDBox>

        <Footer />
      </DashboardLayout>
    </>
  );
}
