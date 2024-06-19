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
import BlockPageForConfStatus from "OurComponents/errorHandling/BlockPageForConfStatus";

export default function Conflicts() {
  const { confID, confPhase } = useContext(ConferenceContext);
  const { isLoggedIn } = useContext(AuthContext);

  const [message, setMessage] = useState(null);
  const [rows, setRows] = useState([]);
  const [rowsToDeclareConflicts, setRowsToDeclareConflicts] = useState([]);
  const [openLoading, setOpenLoading] = useState(false);
  const [blockCrud, setBlockCrud] = useState(false);

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

    if (isLoggedIn && confID && confPhase) {
      if (confPhase !== "Bidding") setBlockCrud(true);
      else fetchAllConflicts();
    }
  }, [confID, isLoggedIn, confPhase]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [message]);

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
        for (let line of jsonResponse) {
          line.id = uuidv4();
          setRowsToDeclareConflicts((allExistingRows) => [
            ...allExistingRows,
            line,
          ]);
        }
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

  async function handleDeleteConflict() {}

  const columns = [
    { field: "submissiontitle", headerName: "Submission Title", width: 400 },
    { field: "fullname", headerName: "Commite Member", width: 400 },
    { field: "conflictreason", headerName: "Conflict Reason", width: 500 },
    {
      field: "",
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
              color="error"
              onClick={async () => handleDeleteConflict(params.row)}
              sx={{
                maxWidth: "100px",
                maxHeight: "30px",
                minWidth: "5px",
                minHeight: "30px",
              }}
            >
              Delete
            </MDButton>
          </div>
        );
      },
    },
  ];

  const columsForDeclareConflicts = [
    { field: "submissiontitle", headerName: "Submission Title", width: 400 },
    {
      field: "authorfullnames",
      headerName: "Submission Author(s)",
      width: 400,
    },
    {
      field: "committeefullnames",
      headerName: "Committee Member",
      width: 400,
      renderCell: (params) => {
        const committeeList = params.value ? params.value.split(", ") : [];
        return (
          <FormControl fullWidth>
            <InputLabel id={`select-label-${params.id}`}>
              Select Committee Member
            </InputLabel>
            <Select
              labelId={`select-label-${params.id}`}
              id={`select-${params.id}`}
              label="Member in Conflict"
            >
              {committeeList.map((memberName, index) => (
                <MenuItem key={index} value={memberName}>
                  {memberName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      },
    },
    {
      field: "",
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
              onClick={async () => handleSubmitConflict(params.row)}
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

  async function handleSubmitConflict(info) {
    setOpenLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/declareConflict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            dataToAddConflict: info,
            confid: confID,
          }),
        }
      );

      const jsonResponse = await response.json();

      if (response.status === 200) {
        getInfoForDeclareConflicts();
        setMessage(
          <Alert severity="success">Conflict Added With Success</Alert>
        );
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(
        <Alert severity="error">Failed to declare new conflict!</Alert>
      );
    }
    setOpenLoading(false);
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {!blockCrud && (
            <>
              <Container maxWidth="sm">
                <MDBox mt={10} mb={2} textAlign="left">
                  <MDBox mb={3} textAlign="left">
                    <Card>
                      <MDTypography ml={2} variant="h6">
                        Conflicts of Interest
                      </MDTypography>
                      <MDTypography ml={2} variant="body2">
                        In this page, you will be able to observe the conflicts
                        of interest present in the conference.
                        <br />
                        You will be able to declare conflicts of interest
                        manually, by clicking the "Declare Conflicts" button.
                        <br />
                        There are two ways to run the algorithm that determines
                        the conflicts:
                        <br />
                        - Pressing the "Check for Conflicts" in Administration
                        -&gt; Conference Settings;
                        <br />- Automatically when the bidding process begins.
                      </MDTypography>
                    </Card>

                    <MDBox mt={3} mb={3} textAlign="left">
                      <Card>{message}</Card>
                    </MDBox>

                    <MDBox mb={3} mt={4} textAlign="left">
                      <Card>
                        <CompleteTable
                          columns={columns}
                          rows={rows}
                          numberOfRowsPerPage={10}
                          height={200}
                        />
                      </Card>
                    </MDBox>
                    <Card>
                      <CompleteTable
                        columns={columsForDeclareConflicts}
                        rows={rowsToDeclareConflicts}
                        numberOfRowsPerPage={10}
                        height={200}
                      />
                    </Card>
                  </MDBox>
                </MDBox>
              </Container>
            </>
          )}
          {blockCrud && (
            <>
              <BlockPageForConfStatus
                text={
                  "It seems that this conference is not in the bidding phase"
                }
              />
            </>
          )}
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
}
