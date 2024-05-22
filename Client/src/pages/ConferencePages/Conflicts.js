import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import { AuthContext } from "auth.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import CompleteTable from "OurComponents/Table/CompleteTable";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Footer from "OurComponents/footer/Footer";
import { v4 as uuidv4 } from "uuid";
import { Select, FormControl, InputLabel, MenuItem } from "@mui/material";

export default function Conflicts() {
  const { confID } = useContext(ConferenceContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsToDeclareConflicts, setRowsToDeclareConflicts] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);
  const [declareConflicts, setDeclareConflicts] = useState(false);
  const [memberInConflict, setMemberInConflict] = useState(null);

  useEffect(() => {
    async function fetchAllConflicts() {
      setOpenLoading(true);
      setRows([]);

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getConflicts`,
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

        const jsonResponse = await response.json();

        if (response.status === 200) {
          for (let line of jsonResponse) {
            line.id = uuidv4();
            setRows((allExistingRows) => [...allExistingRows, line]);
          }
        } else {
          setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">Failed to fetch conference conflicts!</Alert>
        );
      }
      setOpenLoading(false);
    }

    if (isLoggedIn && confID) {
      fetchAllConflicts();
    }
  }, [confID, isLoggedIn]);

  async function getInfoForDeclareConflicts() {
    setOpenLoading(true);
    setRowsToDeclareConflicts([]);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/infoToDeclareConflicts`,
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

      const jsonResponse = await response.json();

      if (response.status === 200) {
        const dataForTable = [
          {
            authors: jsonResponse.submissionInfo[0].authors,
            submissiontitle: jsonResponse.submissionInfo[0].submissiontitle,
            submissionid: jsonResponse.submissionInfo[0].submissionid,
            committee: jsonResponse.committee[0].committee,
          },
        ];

        for (let line of dataForTable) {
          line.id = uuidv4();
          setRowsToDeclareConflicts((allExistingRows) => [
            ...allExistingRows,
            line,
          ]);
        }
        console.log(dataForTable);
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(
        <Alert severity="error">
          Failed to fetch info to declare conference conflicts!
        </Alert>
      );
    }
    setOpenLoading(false);
  }

  const columns = [
    //falta mudar o nome das variaveis
    { field: "submissiontitle", headerName: "Submission Title", width: 400 },
    { field: "fullname", headerName: "Commite Member", width: 400 },
    { field: "conflictreason", headerName: "Conflict Reason", width: 500 },
  ];

  const columsForDeclareConflicts = [
    { field: "submissiontitle", headerName: "Submission Title", width: 400 },
    { field: "authors", headerName: "Submission Author(s)", width: 400 },
    {
      //N esta correto
      field: "committee",
      headerName: "Committee Member",
      width: 400,
      renderCell: (params) => {
        const committeeList = params.value.split(", ");
        return (
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              Select Committee Member
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Member in Conflict"
              onChange={(e) => setMemberInConflict(e.target.value)}
            >
              {committeeList.map((memberName) => (
                <MenuItem value={memberName}>{memberName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "",
      width: 100,
      renderCell: () => {
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
              onClick={async () => handleSubmitConflict()}
              sx={{
                maxWidth: "100px",
                maxHeight: "30px",
                minWidth: "5px",
                minHeight: "30px",
              }}
            >
              Submit
            </MDButton>
          </div>
        );
      },
    },
  ];

  async function handleSubmitConflict() {
    console.log(memberInConflict);
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        {!declareConflicts ? (
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              <MDBox mb={3} textAlign="left">
                <Card>
                  <MDTypography ml={2} variant="h6">
                    Conflicts of Interest
                  </MDTypography>
                  <MDTypography ml={2} variant="body2">
                    In this page, you will be able to observe the conflicts of
                    interest present in the conference.
                    <br />
                    You will be able to declare conflicts of interest manually,
                    by clicking the "Declare Conflicts" button.
                    <br />
                    There are two ways to run the algorithm that determines the
                    conflicts:
                    <br />
                    - Pressing the "Check for Conflicts" in Administration -&gt;
                    Conference Settings;
                    <br />- Automatically when the bidding process begins.
                  </MDTypography>
                </Card>

                {message && <Alert severity="error">{message}</Alert>}

                <MDBox mb={3} mt={4} textAlign="left">
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={() => {
                      getInfoForDeclareConflicts();
                      setDeclareConflicts(true);
                    }}
                    sx={{
                      maxWidth: "190px",
                      maxHeight: "40px",
                      minWidth: "30px",
                      minHeight: "30px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    Declare Conflicts
                  </MDButton>
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
            </MDBox>
          </Container>
        ) : (
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              <MDBox mb={2} textAlign="left">
                <Card>
                  <MDTypography ml={2} variant="h6">
                    Declare Conflicts of Interest
                  </MDTypography>
                  <MDTypography ml={2} variant="body2">
                    Here you are able to declare conflicts of interests present
                    in the conference.
                  </MDTypography>
                </Card>

                {message && <Alert severity="error">{message}</Alert>}

                <MDBox mb={3} mt={4} textAlign="left">
                  <MDButton
                    variant="gradient"
                    color="info"
                    onClick={() => {
                      setMessage(null);
                      setDeclareConflicts(false);
                    }}
                    sx={{
                      maxWidth: "90px",
                      maxHeight: "40px",
                      minWidth: "30px",
                      minHeight: "30px",
                      marginBottom: "10px",
                      marginLeft: "10px",
                    }}
                  >
                    Back
                  </MDButton>
                  <Card>
                    <CompleteTable
                      columns={columsForDeclareConflicts}
                      rows={rowsToDeclareConflicts}
                      numberOfRowsPerPage={100}
                      height={200}
                    />
                  </Card>
                </MDBox>
              </MDBox>
            </MDBox>
          </Container>
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
}
