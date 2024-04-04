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
    lastName: "Snow",
    firstName: "Jon",
    age: 35,
  });

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 100 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 300,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
    {
      field: "More Info.",
      headerName: "More Info.",
      description: "This column have a button to give details about the conference",
      sortable: false,
      width: 100,
      renderCell: (params) => {
        const handleRejectButtonClick = () => {
          console.log("Botão clicado na linha com ID:", params.row.id);
          setDetailsOpen(true);
        };

        return (
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleRejectButtonClick}
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
          console.log("Botão clicado na linha com ID:", params.row.id);
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
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
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
