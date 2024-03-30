import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

const columns = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First name", width: 130 },
  { field: "lastName", headerName: "Last name", width: 130 },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    width: 90,
  },
  {
    field: "fullName",
    headerName: "Full name",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (value, row) => `${row.firstName || ""} ${row.lastName || ""}`,
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
    description: "This column have a button to accept the conference",
    sortable: false,
    width: 160,
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

export default function PendingConferencesPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const getLine = (itm) => {
    const lines = [];
    for (const row of rows) {
      for (const selectedRow of selectedRows) {
        if (selectedRow === row.id) {
          lines.push(
            <p key={row.id}>
              {`ID: ${row.id}, First Name: ${row.firstName}, Last Name: ${row.lastName}`}
            </p>
          );
        }
      }
    }
    return lines;
  };

  const filteredRows = rows.filter((row) => {
    return Object.values(row).some(
      (column) =>
        typeof column === "string" &&
        column.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <UpperNavBar />
      <TextField
        id="outlined-basic"
        label="Search Table"
        variant="outlined"
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
      />
      <Card>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={filteredRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[6, 10]}
            checkboxSelection
            onRowSelectionModelChange={(itm) => setSelectedRows(itm)}
          />
        </div>
      </Card>
      {getLine()}
      <Footer />
    </DashboardLayout>
  );
}
