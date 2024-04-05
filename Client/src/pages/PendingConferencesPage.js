import * as React from "react";
import { useState } from "react";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import MoreDetails from "OurComponents/Info/MoreDetails";

export default function PendingConferencesPage() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({
    id: 2,
    confName: "Snow",
    confStartDate: "Jon",
    confEndDate: 35,
  });

  const columns = [
    { field: "confName", headerName: "Conference Name", width: 200 },
    { field: "confStartDate", headerName: "Conference Start Date", width: 200 },
    { field: "confEndDate", headerName: "Conference End Date", width: 200 },
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
        const handleAcceptButtonClick = () => {
          console.log("Botão clicado na linha com ID:", params.row);
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
        const handleRejectButtonClick = () => {
          console.log("Botão clicado na linha com ID:", params.row.id);
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

  const rows = [
    {
      id: 1,
      confName: "Our conference",
      confStartDate: "05-04-2024",
      confEndDate: "05-05-2024",
    },
    {
      id: 2,
      confName: "Our conference2",
      confStartDate: "05-04-2024",
      confEndDate: "05-05-2024",
    },
  ];

  return (
    <DashboardLayout>
      <UpperNavBar />
      {!detailsOpen ? (
        <CompleteTable columns={columns} rows={rows} numerOfRowsPerPage={5} />
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
