import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import Alert from "@mui/material/Alert";
import Footer from "OurComponents/footer/Footer";
import CompleteTable from "OurComponents/Table/CompleteTable";
import MoreDetails from "OurComponents/Info/MoreDetails";
import { v4 as uuidv4 } from "uuid";
import MDTypography from "components/MDTypography";

export default function ComitteeManagementPage() {
  const { confID, userRole } = useContext(ConferenceContext);
  const { user, isLoggedIn } = useContext(AuthContext);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getRows() {
      try {
        const response = await fetch("http://localhost:8003/comite", {
          method: "POST",
          body: JSON.stringify({ confid: confID }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        const jsonResponse = await response.json();

        if (response.status === 200) {
          for (let line of jsonResponse) {
            line.id = uuidv4();
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

    if (isLoggedIn && confID > 0) {
      getRows();
    }
  }, [isLoggedIn, confID]);

  const columns = [
    { field: "userfirstname", headerName: "First Name", width: 150 },
    { field: "userlastname", headerName: "Last Name", width: 150 },
    { field: "useremail", headerName: "Email", width: 250 },
    { field: "userphone", headerName: "Phone", width: 120 },
    { field: "useraffiliation", headerName: "Affiliation", width: 90 },
    { field: "userrole", headerName: "Role", width: 130 },
    {
      field: "info",
      headerName: "",
      description:
        "This column has a button to give details about the conference",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 60,
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
              maxWidth: "20px",
              maxHeight: "30px",
              minWidth: "5px",
              minHeight: "30px",
            }}
          >
            Info
          </MDButton>
        );
      },
    },
    {
      field: "edit",
      headerName: "",
      description:
        "This column has a button to give details about the conference",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 60,
      renderCell: (params) => {
        const handleMoreDetailsButtonClick = () => {
          setDataForDetails(params.row);
          setDetailsOpen(true);
        };

        return (
          <MDButton
            variant="gradient"
            color="success"
            onClick={handleMoreDetailsButtonClick}
            sx={{
              maxWidth: "20px",
              maxHeight: "30px",
              minWidth: "5px",
              minHeight: "30px",
            }}
          >
            Edit
          </MDButton>
        );
      },
    },
    {
      field: "remove",
      headerName: "",
      description:
        "This column has a button to give details about the conference",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 110,
      renderCell: (params) => {
        const handleMoreDetailsButtonClick = () => {
          setDataForDetails(params.row);
          setDetailsOpen(true);
        };

        return (
          <MDButton
            variant="gradient"
            color="error"
            onClick={handleMoreDetailsButtonClick}
            sx={{
              maxWidth: "100px",
              maxHeight: "30px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          >
            Remove User
          </MDButton>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <ConfNavbar />
      <MDBox mt={10} mb={2} textAlign="left">
        <MDBox mb={5} textAlign="left">
          <Card>
            <MDTypography ml={2} variant="h6">
              Program Committee
            </MDTypography>
            <MDTypography ml={2} variant="body2">
              To access additional details, modify roles, or remove a PC member,
              simply click on 'info', 'edit', or 'remove user
            </MDTypography>
          </Card>
        </MDBox>

        {!detailsOpen ? (
          <>
            <Card>
              {error}
              <CompleteTable
                columns={columns}
                rows={rows}
                numerOfRowsPerPage={5}
                height={200}
              />
            </Card>
          </>
        ) : (
          <MoreDetails
            text={dataForDetails}
            onClose={() => setDetailsOpen(false)}
          />
        )}
      </MDBox>

      <Footer />
    </DashboardLayout>
  );
}
