import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import CompleteTable from "OurComponents/Table/CompleteTable";
import { v4 as uuidv4 } from "uuid";

export default function DefinitionsPage() {
  const { confID, userRole } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [rows, setRow] = useState([]);

  useEffect(() =>{
    async function getRows(){
      try{
         const response = await fetch("http://localhost:8003/confDefinitions", {
          method: "POST",
          body: JSON.stringify({confid: confID, userid: user}),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        const jsonResponse = await response.json();
        
        if (response.status === 200){
          for (let line of jsonResponse) {
            line.id = uuidv4();
            setRow((allExistingRows) => [...allExistingRows, line]);
          }
        } else {
          setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }

      }catch{
        setError(
          <Alert severity="error">
            Something went wrong when obtaining the lines
          </Alert>
        );
      }
    }

    if (confID > 0) {
      if (userRole.includes("Chair")) {
        getRows();
      } else {
        setError(
          <Alert severity="error">User does not have permissions</Alert>
        );
      }
    }
  }, [confID])

  const columns = [
    { field: "Option", width: 500 },
    { field: "Definition", headerName: "Role", width: 500 },
    {
      field: "Edit",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 100,
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
                console.log(params.row);
              }}
              sx={{
                maxWidth: "20px",
                maxHeight: "30px",
                minWidth: "5px",
                minHeight: "30px",
              }}
            >
              Edit
            </MDButton>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <ConfNavbar />
      <Container maxWidth="sm">
        <MDBox mt={10} mb={2} textAlign="left">
          <MDBox mb={3} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                Definitions
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                To edit details from your conference simply click on 'edit'
              </MDTypography>
            </Card>
          </MDBox>
          <MDBox mb={3} textAlign="left">
            <Card>
            <CompleteTable
                columns={columns}
                rows={rows}
                numerOfRowsPerPage={100}
                height={350}
              />
            </Card>
          </MDBox>
        </MDBox>
      </Container>
    </DashboardLayout>
  );
}
