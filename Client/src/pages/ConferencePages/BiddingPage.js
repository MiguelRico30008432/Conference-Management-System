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
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import { v4 as uuidv4 } from "uuid";
import MDButton from "components/MDButton";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Footer from "OurComponents/footer/Footer";
import { handleDownload } from "OurFunctions/DownloadFile";
import BlockPageForConfStatus from "OurComponents/errorHandling/BlockPageForConfStatus";

export default function BiddingPage() {
  const { confID, confPhase } = useContext(ConferenceContext);
  const { user, isLoggedIn } = useContext(AuthContext);

  const [message, setMessage] = useState(null);
  const [openLoading, setOpenLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [blockCrud, setBlockCrud] = useState(false);

  //O use effect não tem a função defina dentro do mesmo para, na função handleSubmit;
  //poder ser chamada fetchAllSubmissionsForBidding() sem dar refresh a pagina
  useEffect(() => {
    if (isLoggedIn && confID && confPhase === "Bidding") {
      fetchAllSubmissionsForBidding();
    }

    if (confPhase !== "Submission") setBlockCrud(true);
  }, [confID, isLoggedIn]);

  async function fetchAllSubmissionsForBidding() {
    setOpenLoading(true);
    setRows([]);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/getSubmissionsForBidding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            confid: confID,
            userid: user,
          }),
        }
      );

      const jsonResponse = await response.json();

      if (response.status === 200) {
        for (let line of jsonResponse) {
          line.id = uuidv4();
          line.confidence = 1;
          setRows((allExistingRows) => [...allExistingRows, line]);
        }
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(
        <Alert severity="error">Failed to fetch submissions for bidding!</Alert>
      );
    }
    setOpenLoading(false);
  }

  const columns = [
    // Nome da Submission
    { field: "submissiontitle", headerName: "Submission Title", width: 400 },
    // Botão para fazer download da submissão
    {
      field: "download",
      filterable: false,
      headerName: "",
      description: "",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 250,
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
              onClick={() => {
                const submission = {
                  id: params.row.submissionid,
                  title: params.row.submissiontitle,
                };

                handleDownload(submission, setMessage, setOpenLoading);
              }}
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
    // Campo para descrever de 0-5 o nivel de confiança em avaliar a submissão
    {
      field: "confidence",
      headerName: "Confidence Level",
      width: 150,
      editable: true,
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      renderCell: (params) => (
        <Select
          value={params.value}
          onChange={(event) => handleConfidenceChange(event, params)}
          style={{ width: "100%" }}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    // Checkbox para assinalar caso queira fazer bidding pela submissão
    {
      field: "",
      headerName: "Bidding",
      sortable: false,
      disableColumnMenu: true,
      resizable: false,
      width: 150,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(event) => handleCheckboxChange(event, params)}
        />
      ),
    },
  ];

  async function handleSubmit() {
    const selectedRows = rows.filter((row) => row.bidding);

    setOpenLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/saveBidding`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            bids: selectedRows,
            userid: user,
            confid: confID,
          }),
        }
      );

      const jsonResponse = await response.json();

      if (response.status === 200) {
        setMessage(
          <Alert severity="success">Bids submitted successfully!</Alert>
        );
        fetchAllSubmissionsForBidding();
      } else {
        setMessage(<Alert severity="error">{jsonResponse.msg}</Alert>);
      }
    } catch (error) {
      setMessage(<Alert severity="error">Failed to submit bids!</Alert>);
    }
    setOpenLoading(false);
  }

  const handleCheckboxChange = (event, params) => {
    const { id } = params.row;
    const { checked } = event.target;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, bidding: checked } : row
      )
    );
  };

  const handleConfidenceChange = (event, params) => {
    const { id } = params.row;
    const { value } = event.target;
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, confidence: value } : row
      )
    );
  };

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
        <ConfNavbar />
        <Container maxWidth="sm">
          {!blockCrud && (
            <>
              <MDBox mt={10} mb={2} textAlign="left">
                <MDBox mb={3} textAlign="left">
                  <Card>
                    <MDTypography ml={2} variant="h6">
                      Bidding Process
                    </MDTypography>
                    <MDTypography ml={2} variant="body2">
                      In this page you are able to choose wich submissions you
                      wish to review and attribute a value to how confortable
                      you are around the subject.<br></br>
                      After clicking submit, submissions with the checkbox
                      clicked, will stop showing up and will be visible in My
                      Biddings page.
                    </MDTypography>
                  </Card>
                </MDBox>
              </MDBox>
              {message}
              <MDBox mt={2} mb={2} textAlign="left">
                <MDBox mb={3} textAlign="left"></MDBox>
                <MDButton
                  variant="gradient"
                  color="success"
                  onClick={handleSubmit}
                  sx={{
                    maxWidth: "90px",
                    maxHeight: "40px",
                    minWidth: "30px",
                    minHeight: "30px",
                    marginBottom: "10px",
                    marginLeft: "10px",
                  }}
                >
                  Submit
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
            </>
          )}
          {blockCrud && (
            <>
              <BlockPageForConfStatus
                text={
                  "It seems that this conference is no longer in the bidding phase"
                }
              />
            </>
          )}
        </Container>
        <Footer />
      </DashboardLayout>
    </>
  );
}
