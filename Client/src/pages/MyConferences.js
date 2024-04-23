import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

import ConferencePage from "./ConferencePages/ConferencePage";

import CompleteTable from "OurComponents/Table/CompleteTable";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth.context";
import { ConferenceContext } from "../conference.context";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";

import MDButton from "components/MDButton";

export default function MyConferences() {
  const { user, isLoggedIn } = useContext(AuthContext);
  const { setConfID, setUserRole } = useContext(ConferenceContext);

  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);
  const [openConference, setOpenConference] = useState(false);

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
      field: "",
      headerName: "",
      description:
        "This column has a button taht allows the user to enter int a specific conference",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 200,
      renderCell: (params) => {
        const handleMoreDetailsButtonClick = () => {
          setConfID(params.row.confid);
          setUserRole(params.row.userrole);
          setOpenConference(true);
        };

        return (
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
        );
      },
    },
  ];

  return (
    <>
      {openConference ? (
        <ConferencePage></ConferencePage>
      ) : (
        <DashboardLayout>
          <UpperNavBar />
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
      )}
    </>
  );
}
