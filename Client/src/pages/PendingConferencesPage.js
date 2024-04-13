import * as React from "react";
import { useEffect, useState } from "react";
import MDButton from "components/MDButton";
import Alert from "@mui/material/Alert";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import MoreDetails from "OurComponents/Info/MoreDetails";

export default function PendingConferencesPage() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getRows() {
      try {
        const response = await fetch(
          "http://localhost:8003/pendingConferences",
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

    getRows();
  }, []);

  async function acceptOrRejectConference(id, accept) {
    try {
      const response = await fetch(
        "http://localhost:8003/acceptOrRejectConference",
        {
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({ confid: id, acceptOrReject: accept }),
        }
      );
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    { field: "confname", headerName: "Conference Name", width: 200 },
    { field: "confstartdate", headerName: "Conference Start Date", width: 200 },
    { field: "confenddate", headerName: "Conference End Date", width: 200 },
    {
      field: "More Info.",
      headerName: "More Info.",
      description:
        "This column have a button to give details about the conference",
      sortable: false,
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
              maxWidth: "80px",
              maxHeight: "30px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          >
            Details
          </MDButton>
        );
      },
    },
    {
      field: "Aprove",
      headerName: "Aprove",
      description: "This column have a button to accept the conference",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const handleAcceptButtonClick = async () => {
          await acceptOrRejectConference(params.row.id, 2);
        };

        return (
          <MDButton
            variant="gradient"
            color="success"
            onClick={handleAcceptButtonClick}
            sx={{
              maxWidth: "80px",
              maxHeight: "30px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          >
            Accept
          </MDButton>
        );
      },
    },
    {
      field: "Reject",
      headerName: "Reject",
      description: "This column have a button to reject the conference",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const handleRejectButtonClick = async () => {
          await acceptOrRejectConference(params.row.id, 1);
        };

        return (
          <MDButton
            variant="gradient"
            color="error"
            onClick={handleRejectButtonClick}
            sx={{
              maxWidth: "80px",
              maxHeight: "30px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          >
            Reject
          </MDButton>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <UpperNavBar />
      {!detailsOpen ? (
        <>
          {error}
          <CompleteTable columns={columns} rows={rows} numerOfRowsPerPage={5} />
        </>
      ) : (
        <MoreDetails
          text={dataForDetails}
          onClose={() => setDetailsOpen(false)}
        />
      )}
      <Footer />
    </DashboardLayout>
  );
}
