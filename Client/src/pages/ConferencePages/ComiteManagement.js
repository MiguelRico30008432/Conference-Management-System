import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import Container from "@mui/material/Container";

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
import { v4 as uuidv4 } from "uuid";
import MDTypography from "components/MDTypography";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Import the ArrowDropDownIcon

export default function ComitteeManagementPage() {
  const { confID, userRole } = useContext(ConferenceContext);
  const { user, isLoggedIn } = useContext(AuthContext);

  const [infoOpen, setInfoOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [memberName, setMemberName] = useState(null);
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
    { field: "useraffiliation", headerName: "Affiliation", width: 90 },
    { field: "userrole", headerName: "Role", width: 200 },
    {
      field: "Info",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 60,
      renderCell: (params) => {
        const memberInfo = async () => {
          try {
            const response = await fetch(
              "http://localhost:8003/comiteInfoUser",
              {
                method: "POST",
                body: JSON.stringify({
                  userid: params.row.userid,
                  confid: confID,
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                credentials: "include",
              }
            );

            if (response.status === 200) {
            } else {
              const jsonResponse = await response.json();
              setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
            }
          } catch (error) {
            setError(<Alert severity="error">Something went wrong.</Alert>);
          }
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
              color="info"
              onClick={async () => {
                //await memberInfo();
                setMemberName(params.row.userfirstname);
                setEditOpen(false);
                setInfoOpen(true);
              }}
              sx={{
                maxWidth: "20px",
                maxHeight: "30px",
                minWidth: "5px",
                minHeight: "30px",
              }}
            >
              Info
            </MDButton>
          </div>
        );
      },
    },
    {
      field: "Edit",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 60,
      renderCell: (params) => {
        const editMember = () => {};

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
              onClick={() => {
                setMemberName(params.row.userfirstname);
                setInfoOpen(false);
                setEditOpen(true);
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
    {
      field: "Remove",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 110,
      renderCell: (params) => {
        if (params.row.userid === user) return null;

        const deleteMember = async () => {
          try {
            const response = await fetch(
              "http://localhost:8003/removePCMember",
              {
                method: "POST",
                body: JSON.stringify({
                  userid: params.row.userid,
                  confid: confID,
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
                credentials: "include",
              }
            );

            if (response.status === 200) {
              window.location.reload();
            } else {
              const jsonResponse = await response.json();
              setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
            }
          } catch (error) {
            setError(<Alert severity="error">Something went wrong.</Alert>);
          }
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
              onClick={deleteMember}
              sx={{
                maxWidth: "100px",
                maxHeight: "30px",
                minWidth: "30px",
                minHeight: "30px",
              }}
            >
              Remove User
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
                Committee Management
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                To access additional details, modify roles, or remove a PC
                member, simply click on 'info', 'edit', or 'remove user'
              </MDTypography>
            </Card>
          </MDBox>

          {/* Tabela principal */}
          <MDBox mb={3}>
            <Card>
              {error}
              <CompleteTable
                columns={columns}
                rows={rows}
                numerOfRowsPerPage={5}
                height={350}
              />
            </Card>
          </MDBox>

          {/* Quanto info for clicado */}
          {infoOpen && (
            <MDBox mb={3}>
              <Card>
                <MDTypography ml={2} variant="h6">
                  Info about {memberName}
                </MDTypography>

                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={() => setInfoOpen(false)}
                  sx={{
                    maxWidth: "20px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    mt: 1,
                    ml: 2,
                    mb: 2,
                  }}
                >
                  Close
                </MDButton>
              </Card>
            </MDBox>
          )}

          {/* Quanto edit for clicado */}
          {editOpen && (
            <MDBox mb={3}>
              <Card>
                <MDTypography ml={2} variant="h6">
                  Edit {memberName} data
                </MDTypography>
                <MDTypography ml={2} variant="body2">
                  Change role by selecting in the newxt drop down menu
                </MDTypography>

                <FormControl
                  variant="outlined"
                  sx={{ mt: 1, ml: 2, width: 200 }}
                >
                  <Select
                    id="recipient"
                    displayEmpty
                    IconComponent={() => <ArrowDropDownIcon />}
                    sx={{ height: 30 }}
                    onChange={() => setShowSaveButton(true)}
                  >
                    <MenuItem value="" disabled>
                      Choose a the role
                    </MenuItem>
                    <MenuItem value="chair">Chair</MenuItem>
                    <MenuItem value="pc-members">PC Members</MenuItem>
                  </Select>
                </FormControl>

                <div style={{ display: "flex", gap: 1 }}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={() => {
                      setEditOpen(false);
                      setShowSaveButton(false);
                    }}
                    sx={{
                      maxWidth: "20px",
                      maxHeight: "30px",
                      minWidth: "5px",
                      minHeight: "30px",
                      mt: 1,
                      ml: 2,
                      mb: 2,
                    }}
                  >
                    Close
                  </MDButton>
                  {showSaveButton && (
                    <MDButton
                      variant="gradient"
                      color="success"
                      onClick={() => {
                        setEditOpen(false);
                        setShowSaveButton(false);
                      }}
                      sx={{
                        maxWidth: "20px",
                        maxHeight: "30px",
                        minWidth: "5px",
                        minHeight: "30px",
                        mt: 1,
                        ml: 2,
                        mb: 2,
                      }}
                    >
                      Save
                    </MDButton>
                  )}
                </div>
              </Card>
            </MDBox>
          )}
        </MDBox>
      </Container>
      <Footer />
    </DashboardLayout>
  );
}
