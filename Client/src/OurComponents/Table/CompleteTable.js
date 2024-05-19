import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import Card from "@mui/material/Card";

export default function CompleteTable({
  columns,
  rows,
  withCheckBoxSelection = false,
  height,
  width = "100%",
  rowHeight = 41,
  numerOfRowsPerPage = 5,
}) {
  const [selectedRows, setSelectedRows] = useState([]);

  return (
    <>
      <Card>
        <div
          style={{ height: rows.length > 0 ? "100%" : height, width: width }}
        >
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: numerOfRowsPerPage },
              },
            }}
            pageSizeOptions={[10, 50, { value: 100, label: "100" }]}
            checkboxSelection={withCheckBoxSelection}
            onRowSelectionModelChange={
              withCheckBoxSelection ? (itm) => setSelectedRows(itm) : null
            }
            rowHeight={rowHeight}
            sx={{
              // colunas
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "white",
                color: "#1F4576",
                fontWeight: 11,
                fontSize: "0.875rem",
              },
              // linhas
              "& .MuiDataGrid-cell": {
                backgroundColor: "white",
                color: "#1F4576",
                fontWeight: 11,
                fontSize: "0.875rem",
              },
              // contorno aquando a seleção da célula
              "& .MuiDataGrid-cell.MuiDataGrid-cell:focus": {
                outline: "none",
              },
              // cor da linha selecionada
              "& .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "#E6E6E6",
              },
              "& .MuiDataGrid-row:hover.Mui-selected": {
                backgroundColor: "#E6E6E6",
              },
              // Indicador do número de linhas selecionadas
              "& .MuiDataGrid-selectedRowCount": {
                color: "#1F4576",
              },
            }}
          />
        </div>
      </Card>
    </>
  );
}
