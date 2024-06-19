import * as React from "react";
import { useEffect, useState, useContext } from "react";
import MDButton from "components/MDButton";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import ConfereceDetails from "OurComponents/Info/ConfereceDetails";
import { AuthContext } from "../auth.context";
import { fetchAPI } from "OurFunctions/fetchAPI";
import ModalInfo from "OurComponents/Modal/ModalInfo";
import MDBox from "components/MDBox";

export default function PendingConferencesPage() {
  const { isLoggedIn, isAdmin } = useContext(AuthContext);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);

  useEffect(() => {
    async function getRows() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/pendingConferences`,
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

    if (isLoggedIn && isAdmin) {
      getRows();
    }
  }, [isLoggedIn]);

  async function acceptOrRejectConference(id, accept, owner, name) {
    const response = await fetchAPI(
      "acceptOrRejectConference",
      "POST",
      {
        confid: id,
        acceptOrReject: accept,
        confowner: owner,
        confname: name,
      },
      setError,
      setOpenLoading
    );

    if (response) {
      window.location.reload();
    }
  }

  const columns = [
    { field: "confname", headerName: "Conference Name", width: 400 },
    { field: "confstartdate", headerName: "Conference Start Date", width: 200 },
    { field: "confenddate", headerName: "Conference End Date", width: 200 },
    {
      field: "More Info.",
      filterable: false,
      headerName: "",
      description:
        "This column has a button to give details about the conference",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 100,
      renderCell: (params) => {
        const handleMoreDetailsButtonClick = () => {
          setDataForDetails(params.row);
          setDetailsOpen(true);
        };

        return (
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleMoreDetailsButtonClick}
            sx={{
              maxWidth: "60px",
              maxHeight: "23px",
              minWidth: "30px",
              minHeight: "23px",
            }}
          >
            Details
          </MDButton>
        );
      },
    },
    {
      field: "Aprove",
      filterable: false,
      headerName: "",
      description: "This column has a button to accept the conference",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 100,
      renderCell: (params) => {
        const handleAcceptButtonClick = async () => {
          await acceptOrRejectConference(
            params.row.id,
            2,
            params.row.confowner,
            params.row.confname
          );
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
              color="success"
              onClick={handleAcceptButtonClick}
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
        );
      },
    },
    {
      field: "Reject",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 100,
      renderCell: (params) => {
        const handleRejectButtonClick = async () => {
          await acceptOrRejectConference(
            params.row.id,
            1,
            params.row.confowner,
            params.row.confname
          );
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
              color="error"
              onClick={handleRejectButtonClick}
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
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <UpperNavBar whereIAm={"Pending Conferences"} />
      <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <>
          <MDBox mb={3} textAlign="left">
            <Card>{error}</Card>
          </MDBox>

          <Card>
            <CompleteTable
              columns={columns}
              rows={rows}
              numberOfRowsPerPage={10}
              height={200}
            />
          </Card>
        </>

        {detailsOpen && (
          <ModalInfo onClose={() => setDetailsOpen(false)}>
            <ConfereceDetails
              text={dataForDetails}
              displayCloseButton={true}
              onClose={() => setDetailsOpen(false)}
            />
          </ModalInfo>
        )}
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}
