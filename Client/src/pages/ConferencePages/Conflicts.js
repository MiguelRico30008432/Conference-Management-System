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

export default function Conflicts() {
  const { confID } = useContext(ConferenceContext);
  const { isLoggedIn } = useContext(AuthContext);
  const [message, setMessage] = useState(null);
  const [rows, setRows] = useState([]);
  const [dataForDetails, setDataForDetails] = useState({});
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);
  const [declareConflicts, setDeclareConflicts] = useState(false);

  useEffect(() => {
    async function fetchAllConflicts() {
      setOpenLoading(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/allConflicts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=UTF-8",
          },
          credentials: "include",
          body: JSON.stringify({
            confID: confID
          })
        });

        const jsonResponse = await response.json();

        if (response.status === 200) {

        } else {
          setMessage(
            <Alert severity="error">
              Failed to fetch Conflicts: {jsonResponse.message}
            </Alert>
          );
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">
            Failed to fetch conference conflicts!
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    if(isLoggedIn && confID){
      fetchAllConflicts()
    }
  }, [confID, isLoggedIn]);

  const columns = [
    { field: "Title", headerName: "Submission Title", width: 400 },
    { field: "Authors", headerName: "Authors", width: 500 },
    { field: "conflict", headerName: "Conflict With", width: 200 },
    {
      field: "moreInfo",
      headerName: "",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      width: 150,
      renderCell: (params) => (
        <MDButton
          variant="gradient"
          color="info"
          onClick={() => {
            setDataForDetails(params.row);
            setDetailsOpen(true);
          }}
          sx={{
            maxWidth: "80px",
            maxHeight: "30px",
            minWidth: "30px",
            minHeight: "30px",
          }}
        >
          Details
        </MDButton>
      ),
    },
  ];

  function verifyConflicts(){
    console.log("fds")
  };

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
                   In this page you will be able to observe the conflicts of interests present in the conference.<br/>
                   You will be able to declares conflicts of interest mannually, by clicking the "Declare Conflicts" button.<br/>
                   There are two ways to run the algorithm that determines the conflicts:<br/>
                   - Pressing the "Check for Conflitcs" button;<br/>
                   - Automatically when the bidding process begins. 
                 </MDTypography>
               </Card>
               <MDBox mb={3} mt={4} textAlign="left">
                 <MDButton
                   variant="gradient"
                   color="info"
                   onClick={() => {
                     verifyConflicts()
                   }}
                   sx={{
                     maxWidth: "190px",
                     maxHeight: "40px",
                     minWidth: "30px",
                     minHeight: "30px",
                     marginBottom: "10px"
                   }}
                   >
                   Check for Conflitcs
                 </MDButton>
                 
                 <MDButton
                   variant="gradient"
                   color="info"
                   onClick={() => {
                     setDeclareConflicts(true);
                   }}
                   sx={{
                     maxWidth: "190px",
                     maxHeight: "40px",
                     minWidth: "30px",
                     minHeight: "30px",
                     marginBottom: "10px",
                     marginLeft: "10px"
                   }}
                   >
                   Declare Conflicts
                 </MDButton>

                   {message && <Alert severity="error">{message}</Alert>}
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
        ): (
          <Container maxWidth="sm">
            <MDBox mt={10} mb={2} textAlign="left">
              Criar tabela para manualmente declara os conflitos
            </MDBox>
          </Container>
        )}
        <Footer />
      </DashboardLayout>
    </>
  );
}
