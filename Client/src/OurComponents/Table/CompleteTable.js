import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import Card from "@mui/material/Card";

export default function CompleteTable({
  columns,
  rows,
  withCheckBoxSelection = false,
  height = 400,
  width = "100%",
  numerOfRowsPerPage = 5,
}) {
  const [selectedRows, setSelectedRows] = useState([]);

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

  return (
    <>
      <Card>
        <div style={{ height: height, width: width }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: numerOfRowsPerPage },
              },
            }}
            pageSizeOptions={[6, 10]}
            checkboxSelection={withCheckBoxSelection}
            onRowSelectionModelChange={
              withCheckBoxSelection ? (itm) => setSelectedRows(itm) : null
            }
            sx={{
              "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
                backgroundColor: "white",
                color: "white",
                fontWeight: 10,
              },
            }}
          />
        </div>
      </Card>
    </>
  );
}
