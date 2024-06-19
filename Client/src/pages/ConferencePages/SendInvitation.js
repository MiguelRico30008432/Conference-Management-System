import React, { useState, useContext, useEffect } from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import Footer from "OurComponents/footer/Footer";
import MDButton from "components/MDButton";
import CompleteTable from "OurComponents/Table/CompleteTable";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MDBox from "components/MDBox";
import Alert from "@mui/material/Alert";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SendInvitation() {
  const { user } = useContext(AuthContext);
  const { confID } = useContext(ConferenceContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [emails, setEmails] = useState("");
  const [emailError, setEmailError] = useState("");
  const [rows, setRows] = useState([]);
  const [deleteError, setDeleteError] = useState("");
  const [invitationError, setInvitationError] = useState("");
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [invitationEmailSuccess, setInvitationEmailSuccess] = useState("");
  const [alreadyInvitedEmails, setAlreadyInvitedEmails] = useState([]);

  const columns = [
    { field: "recipient", headerName: "Recipient", width: 200 },
    { field: "role", headerName: "Role", width: 200 },
    { field: "status", headerName: "Status", width: 200 },
    { field: "dateSent", headerName: "Date Sent", width: 200 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {params.row.status === "Used" ? null : (
            <MDButton
              variant="gradient"
              color="error"
              onClick={() => handleDeleteInvitation(params.id)}
              sx={{
                maxWidth: "80px",
                maxHeight: "30px",
                minWidth: "30px",
                minHeight: "30px",
              }}
            >
              Delete
            </MDButton>
          )}
        </div>
      ),
    },
  ];

  const getData = async () => {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/checkInvitations?confID=${confID}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const { invitationsSent } = await response.json();

      // Function to format date
      function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB");
      }

      // Transform the data to match the column format
      const transformedData = invitationsSent.map((invite) => ({
        id: invite.invitationid,
        recipient: invite.invitationemail,
        role: invite.invitationrole,
        status: invite.invitationcodeused ? "Used" : "Pending",
        dateSent: formatDate(invite.invitationadddate),
      }));
      setRows(transformedData);
    } catch (error) {
      console.error("Error fetching invitations data:", error);
      // Optionally handle errors in state/UI
    } finally {
      setOpenLoading(false);
    }
  };

  useEffect(() => {
    if (confID) {
      getData();
    }
  }, [confID]);

  const handleDeleteInvitation = async (invitationId) => {
    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/deleteInvitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ invitationId }), // Sending invitationId in the body
        }
      );
      if (response.ok) {
        const updatedRows = rows.filter((row) => row.id !== invitationId);
        setRows(updatedRows);
        setDeleteError(""); // Clear delete error if any
        setDeleteSuccessMessage("Invitation deleted successfully");
      } else {
        throw new Error("Failed to delete the invitation");
      }
    } catch (error) {
      console.error("Error deleting invitation:", error);
      setDeleteError("Failed to delete the invitation. Please try again.");
    } finally {
      setOpenLoading(false);
    }
  };

  const handleSendInvitation = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    setRoleError("");
    setEmailError("");
    setInvitationError("");
    setDeleteError("");
    setInvitationEmailSuccess("");
    setAlreadyInvitedEmails([]); // Reset the state for already invited emails

    if (!role) {
      setRoleError("You must select a role!");
      setOpenLoading(false);
      return;
    }

    if (!emails) {
      setEmailError("You must enter recipients!");
      setOpenLoading(false);
      return;
    }

    const emailList = emails.split(",").map((email) => email.trim());

    const invalidEmails = emailList.filter((email) => !emailRegex.test(email));

    if (invalidEmails.length > 0) {
      setEmailError("Invalid email format: " + invalidEmails.join(", "));
      setOpenLoading(false);
      return;
    }

    setOpenLoading(true); // Start loading indicator

    // Send the list of emails to the backend
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/sendNewInvitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            userid: user,
            role: role,
            recipients: emailList,
            confID: confID,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setInvitationEmailSuccess(data.message);

        if (data.alreadyInvited && data.alreadyInvited.length > 0) {
          setAlreadyInvitedEmails(data.alreadyInvited);
        }

        // Update table data after sending invitations
        getData(); // Assuming getData function fetches updated data
      } else {
        const data = await response.json();
        if (data.alreadyInvited && data.alreadyInvited.length > 0) {
          setAlreadyInvitedEmails(data.alreadyInvited);
          setInvitationError(data.message);
        } else {
          throw new Error("Failed to send invitations");
        }
      }
    } catch (error) {
      console.error("Error sending invitations:", error);
      setInvitationError(
        "An error occurred while sending invitations. Please try again."
      );
    } finally {
      setOpenLoading(false);
    }
  };

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <Container maxWidth="sm">
          <MDBox mt={10} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                Send Invitation
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                On this page you can send invites so new members can join your
                conference, you can send an email to multiple users, each one
                will have a different code. Make sure to choose the role you
                want the user's to have. After sending the invitation, in case
                there was an error or you sent to the incorrect user, you can
                always delete the invitation if it has not been already used.
              </MDTypography>
            </Card>
            <Card sx={{ mt: 3, p: 3 }}>
              {invitationEmailSuccess && (
                <Alert severity="success">{invitationEmailSuccess}</Alert>
              )}
              {invitationError && (
                <Alert severity="error">{invitationError}</Alert>
              )}
              {alreadyInvitedEmails.length > 0 && (
                <Alert severity="info">
                  The following emails have already received an invitation:{" "}
                  {alreadyInvitedEmails.join(", ")}
                </Alert>
              )}
              <Box component="form" onSubmit={handleSendInvitation} noValidate>
                <FormControl
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  error={Boolean(roleError)}
                >
                  <MDTypography variant="body2">Role *</MDTypography>
                  <Select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    displayEmpty
                    inputProps={{ "aria-label": "Without label" }}
                    IconComponent={ArrowDropDownIcon}
                    sx={{ height: "3rem" }}
                  >
                    <MenuItem value="" disabled>
                      Choose a Role
                    </MenuItem>
                    <MenuItem value="Chair">Chair</MenuItem>
                    <MenuItem value="Committee">Committee</MenuItem>
                  </Select>
                  {roleError && <Alert severity="error">{roleError}</Alert>}
                </FormControl>
                <FormControl fullWidth error={Boolean(emailError)}>
                  <MDTypography variant="body2" sx={{ mt: 2, mb: 1 }}>
                    Recipients *
                  </MDTypography>
                  <Box
                    sx={{
                      "& textarea": {
                        width: "100%",
                        padding: "18.5px 14px",
                        fontSize: "0.9rem",
                        fontFamily:
                          '"Roboto", "Helvetica", "Arial", sans-serif',
                        border: "1px solid #c4c4c4",
                        borderRadius: "4px",
                        resize: "vertical",
                        marginTop: "8px",
                      },
                    }}
                  >
                    <textarea
                      id="emails"
                      placeholder="Enter recipients separated by commas"
                      value={emails}
                      onChange={(e) => setEmails(e.target.value)}
                      rows={4}
                    />
                  </Box>
                  {emailError && <Alert severity="error">{emailError}</Alert>}
                </FormControl>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{ mt: 3, mb: 2, color: "white !important" }}
                >
                  Send Invitation
                </Button>
              </Box>
            </Card>
            <Card sx={{ mt: 3 }}>
              {deleteError && <Alert severity="error">{deleteError}</Alert>}
              {deleteSuccessMessage && (
                <Alert severity="success">{deleteSuccessMessage}</Alert>
              )}
              <CompleteTable
                columns={columns}
                rows={rows}
                numberOfRowsPerPage={5}
                height={200}
              />
            </Card>
          </MDBox>
          <br></br>
        </Container>
        <Footer />
      </DashboardLayout>
    </>
  );
}
