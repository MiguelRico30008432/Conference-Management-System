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
import { FormControl, MenuItem, Select } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";
import LoadingCircle from "OurComponents/loading/LoadingCircle";

export default function ComitteeManagementPage() {
  const { confID, userRole } = useContext(ConferenceContext);
  const { user } = useContext(AuthContext);

  const [infoOpen, setInfoOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [popMessage, setPopMessage] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);

  const [selectValueRole, setSelectValueRole] = useState("Choose a role");
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [memberName, setMemberName] = useState(null);
  const [memberID, setMemberID] = useState(null);
  const [memberRoles, setMemberRoles] = useState(null);
  const [memberInfoData, setMemberInfoData] = useState({});

  useEffect(() => {
    async function getRows() {
      setOpenLoading(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/comite`,
          {
            method: "POST",
            body: JSON.stringify({ confid: confID }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
            credentials: "include",
          }
        );

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
      setOpenLoading(false);
    }

    if (confID > 0) {
      if (userRole.includes("Chair") || userRole.includes("Owner")) {
        getRows();
      } else {
        setError(
          <Alert severity="error">User does not have permissions</Alert>
        );
      }
    }
  }, [confID]);

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
                setMemberInfoData(params.row);
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
        if (params.row.userid === user || params.row.userrole === "Owner")
          return null;

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
                setMemberID(params.row.userid);
                setMemberRoles(params.row.userrole);
                setSelectValueRole("Choose a role");
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
        if (params.row.userid === user || params.row.userrole === "Owner")
          return null;

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
              onClick={() => {
                setPopMessage(true);
                setMemberID(params.row.userid);
              }}
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

  async function deleteMember() {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/removePCMember`,
        {
          method: "POST",
          body: JSON.stringify({
            responsibleUser: user,
            userid: memberID,
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
    setOpenLoading(false);
  }

  async function changeMemberRole() {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/updateRoleMember`,
        {
          method: "POST",
          body: JSON.stringify({
            responsibleUser: user,
            userid: memberID,
            confid: confID,
            role: selectValueRole,
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
    setOpenLoading(false);
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Container maxWidth="sm">
            {/*Mensagem de erro*/}
            <PopUpWithMessage
              open={popMessage}
              handleClose={() => setPopMessage(false)}
              handleConfirm={async () => {
                await deleteMember();
                setPopMessage(false);
              }}
              affirmativeButtonName={"Yes, I'm Sure"}
              negativeButtonName={"Cancel"}
              title={"Confirm Remove Member?"}
              text={"Are you sure you want to remove the selected user?"}
            />

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

              <MDBox mb={3} textAlign="left">
                <Card>{error}</Card>
              </MDBox>

              {/* Tabela principal */}
              <MDBox mb={3}>
                <Card>
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
                    <MDTypography ml={2} mb={2} mt={2} variant="h6">
                      Information about {memberName}
                    </MDTypography>

                    <MDBox ml={2} mb={1}>
                      <MDTypography variant="body2">
                        <b>First name: </b>
                        {memberInfoData.userfirstname}
                      </MDTypography>

                      <MDTypography variant="body2">
                        <b>Last name: </b> {memberInfoData.userlastname}
                      </MDTypography>

                      <MDTypography variant="body2">
                        <b>Email: </b> {memberInfoData.useremail}
                      </MDTypography>

                      <MDTypography variant="body2">
                        <b>Phone: </b> {memberInfoData.userphone}
                      </MDTypography>

                      <MDTypography variant="body2">
                        <b>Affiliation: </b> {memberInfoData.useraffiliation}
                      </MDTypography>

                      <MDTypography variant="body2">
                        <b>Created Date: </b> {memberInfoData.useradddate}
                      </MDTypography>

                      <MDTypography mt={2} variant="body2">
                        <b>Submitted papers:</b>
                      </MDTypography>
                      <MDTypography variant="body2">Missing Info</MDTypography>

                      <MDTypography variant="body2">
                        <b>Assigned submissions:</b>
                      </MDTypography>
                      <MDTypography variant="body2">Missing Info</MDTypography>

                      <MDTypography variant="body2">
                        <b>Bidding:</b>
                      </MDTypography>

                      <MDTypography variant="body2">Missing Info</MDTypography>

                      <MDTypography variant="body2">
                        <b>Reviewed submissions:</b>
                      </MDTypography>

                      <MDTypography variant="body2">Missing Info</MDTypography>

                      <MDTypography variant="body2">
                        <b>Conflict list:</b>
                      </MDTypography>

                      <MDTypography variant="body2">Missing Info</MDTypography>
                    </MDBox>

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
                <Card>
                  <MDTypography ml={2} mt={2} variant="h6">
                    Edit {memberName} roles
                  </MDTypography>

                  <MDBox mb={3}>
                    <MDTypography mt={1} ml={2} variant="body2">
                      Change the role using the dropdown menu below
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
                        value={selectValueRole}
                        onChange={(event) => {
                          if (event.target.value === "Choose a role") {
                            setSelectValueRole("Choose a role");
                            setShowSaveButton(false);
                          } else {
                            setSelectValueRole(event.target.value);
                            setShowSaveButton(true);
                          }
                        }}
                      >
                        <MenuItem value="Choose a role">Choose a role</MenuItem>
                        {!memberRoles.includes("Chair") && (
                          <MenuItem value="Chair">Chair</MenuItem>
                        )}
                        {!memberRoles.includes("Committee") && (
                          <MenuItem value="Committee">Committee</MenuItem>
                        )}
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
                          mt: 2,
                          ml: 2,
                          mb: 1,
                        }}
                      >
                        Close
                      </MDButton>

                      {showSaveButton && (
                        <MDButton
                          variant="gradient"
                          color="success"
                          onClick={async () => {
                            setEditOpen(false);
                            setShowSaveButton(false);
                            await changeMemberRole();
                          }}
                          sx={{
                            maxWidth: "20px",
                            maxHeight: "30px",
                            minWidth: "5px",
                            minHeight: "30px",
                            mt: 2,
                            ml: 2,
                            mb: 1,
                          }}
                        >
                          Save
                        </MDButton>
                      )}
                    </div>
                  </MDBox>
                </Card>
              )}
            </MDBox>
          </Container>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
