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

export default function MyConferences() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const { setConfID, setUserRole } = useContext(ConferenceContext);

  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function getMyConferences() {
      try {
        const response = await fetch("http://localhost:8003/myConferences", {
          method: "POST",
          body: JSON.stringify({ userid: user }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        const jsonResponse = await response.json();
        console.log(jsonResponse)

        if (response.status === 200) {
          for (let line of jsonResponse) {
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
    }
    if (isLoggedIn) {
      getMyConferences();
    }
  }, [isLoggedIn]);

  const columns = [
    { field: "confname", headerName: "Conference Name", width: 600 },
    { field: "userrole", headerName: "Your Role", width: 200 },
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
        const handleMoreDetailsButtonClick = async () => {
          setConfID(params.row.confid);
          setUserRole(params.row.userrole);
          await saveConfIDOnUser(params.row.confid);
          navigate("/MyConferences/ConferenceDescription");
        };

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
              onClick={handleMoreDetailsButtonClick}
              sx={{
                maxWidth: "80px",
                maxHeight: "30px",
                minWidth: "30px",
                minHeight: "30px",
              }}
            >
              Enter
            </MDButton>
          </div>
        );
      },
    },
  ];

  async function saveConfIDOnUser(confID) {
    try {
      const response = await fetch("http://localhost:8003/updateConfContext", {
        method: "POST",
        body: JSON.stringify({ userid: user, confid: confID }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      if (response.status != 200) {
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
      <DashboardLayout>
        <UpperNavBar />
        <MDBox mb={5} textAlign="left">
          <Card>
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
            numerOfRowsPerPage={5}
            height={200}
          />
        </Card>
        <br></br>
        <Footer />
      </DashboardLayout>
    </>
  );
}
