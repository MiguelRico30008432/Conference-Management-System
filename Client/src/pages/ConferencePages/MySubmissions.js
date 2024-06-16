import React, { useEffect, useState, useContext } from "react";
import MDButton from "components/MDButton";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import CompleteTable from "OurComponents/Table/CompleteTable";
import SubmissionsDetails from "OurComponents/Info/SubmissionDetails";
import UpdateSubmission from "OurComponents/Info/updateSubmission";

import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";

export default function MySubmissionsPage() {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [dataForUpdate, setDataForUpdate] = useState({});
  const [update, setUpdate] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [openPopUpMessage, setOpenPopUpMessage] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const [dataForDelete, setDataForDelete] = useState(null);
  const [subUpdate, setSubUpdate] = useState(null);

  const { user } = useContext(AuthContext);
  const { confID, confPhase } = useContext(ConferenceContext);

  useEffect(() => {
    async function fetchSubmissions() {
      setOpenLoading(true);

      if (confID && user) {
        try {
          const update = await fetch(
            `${process.env.REACT_APP_API_URL}/getUpdateInfo`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
              credentials: "include",
              body: JSON.stringify({
                confid: confID,
              }),
            }
          );

          const updateResponse = await update.json();

          if (update.status === 200) {
            setSubUpdate(updateResponse[0].update);
          }

          const response = await fetch(
            `${process.env.REACT_APP_API_URL}/mySubmissions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json; charset=UTF-8",
              },
              credentials: "include",
              body: JSON.stringify({
                userID: user,
                confID: confID,
              }),
            }
          );

          const jsonResponse = await response.json();

          if (response.ok) {
            const transformedData = jsonResponse.map((submission) => ({
              id: submission.id,
              title: submission.title,
              authors: submission.authors,
              status: submission.status, // This will now be 'Accepted', 'Rejected', or 'Pending'
              addDate: submission.adddate,
              abstract: submission.abstract,
              fileUrl: submission.fileUrl,
            }));
            setRows(transformedData);
          } else {
            setError(<Alert severity="error">{jsonResponse.message}</Alert>);
          }
        } catch (error) {
          setError(<Alert severity="error">Could not fetch submissions</Alert>);
        }
      }
      setOpenLoading(false);
    }

    if (user && confID) {
      fetchSubmissions();
    }
  }, [confID, user]);

  const handleDelete = async () => {
    setError(null);
    setOpenLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/deleteSubmission`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            submissionID: dataForDelete,
          }),
        }
      );

      const jsonResponse = await response.json();

      if (response.ok) {
        setRows((rows) => rows.filter((row) => row.id !== dataForDelete));
        setError(
          <Alert severity="success">Submission deleted successfully</Alert>
        );
      } else {
        setError(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setError(<Alert severity="error">Could not delete submission</Alert>);
    }

    setOpenLoading(false);
  };

  const handleDownload = async (submission) => {
    setError(null);
    setOpenLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/downloadSubmissionFile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            submissionID: submission.id,
          }),
        }
      );

      if (!response.ok) {
        const jsonResponse = await response.json();
        setError("Failed to download file: " + jsonResponse.msg);
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = submission.title + ".pdf"; // Set the file name
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError(<Alert severity="error">Could not download file</Alert>);
    }

    setOpenLoading(false);
  };

  const columns = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    { field: "authors", headerName: "Authors", width: 200 },
    { field: "addDate", headerName: "Submission Date", width: 120 },
    {
      field: "edit",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 55,
      renderCell: (params) => {
        if (confPhase !== "Submission" || !subUpdate) return null;

        return (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {
              <MDButton
                variant="gradient"
                color="success"
                onClick={() => {
                  setDataForUpdate(params.row.id);
                  setUpdate(true);
                }}
                sx={{
                  maxWidth: "60px",
                  maxHeight: "23px",
                  minWidth: "30px",
                  minHeight: "23px",
                }}
              >
                Edit
              </MDButton>
            }
          </div>
        );
      },
    },
    {
      field: "download",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 130,
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
              color="warning"
              onClick={() => handleDownload(params.row)}
              sx={{
                maxWidth: "120px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Download File
            </MDButton>
          </div>
        );
      },
    },
    {
      field: "details",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 80,
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
              onClick={() => {
                setDataForDetails(params.row);
                setDetailsOpen(true);
              }}
              sx={{
                maxWidth: "60px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Details
            </MDButton>
          </div>
        );
      },
    },
    {
      field: "delete",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 150,
      renderCell: (params) => {
        if (confPhase !== "Submission") return null;

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
                setDataForDelete(params.row.id);
                setOpenPopUpMessage(true);
              }}
              sx={{
                maxWidth: "130px",
                maxHeight: "23px",
                minWidth: "30px",
                minHeight: "23px",
              }}
            >
              Delete Submission
            </MDButton>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {openLoading && <LoadingCircle />}
      <PopUpWithMessage
        open={openPopUpMessage}
        handleClose={() => setOpenPopUpMessage(false)}
        handleConfirm={async () => {
          await handleDelete();
          setOpenPopUpMessage(false);
        }}
        title={"Confirm your submission removal"}
        text={"Are you sure you want to remove this submission?"}
      />

      <DashboardLayout>
        <ConferenceNavBar />
        {!update ? (
          <>
            <Container maxWidth="sm">
              <MDBox mt={10} mb={2} textAlign="left">
                <Card>
                  <MDTypography ml={2} variant="h6">
                    My Submissions
                  </MDTypography>
                  <MDTypography ml={2} variant="body2">
                    Here you can view and manage your submissions.
                  </MDTypography>
                </Card>

                <Card sx={{ mt: 2, mb: 2 }}>{error}</Card>

                <MDBox mb={3} textAlign="left">
                  <Card>
                    <CompleteTable
                      columns={columns}
                      rows={rows}
                      numberOfRowsPerPage={100}
                      height={200}
                    />
                  </Card>
                </MDBox>
              </MDBox>
            </Container>
            {!detailsOpen ? null : (
              <SubmissionsDetails
                submission={dataForDetails}
                onClose={() => setDetailsOpen(false)}
              />
            )}
          </>
        ) : (
          <UpdateSubmission
            submissionID={dataForUpdate}
            onClose={() => setUpdate(false)}
          />
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
}
