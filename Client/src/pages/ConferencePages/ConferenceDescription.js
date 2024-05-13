import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import Container from "@mui/material/Container";
import Footer from "OurComponents/footer/Footer";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import ConfereceDetails from "OurComponents/Info/ConfereceDetails";
import Alert from "@mui/material/Alert";

export default function ConferenceDetails() {
  const { confID } = useContext(ConferenceContext);
  const [openLoading, setOpenLoading] = useState(false);
  const [dataForDetails, setDataForDetails] = useState({});
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchConfDetails() {
      setOpenLoading(true);

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/conferenceDescription`, {
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

        if(response.status === 200){
          setDataForDetails({
            confname: jsonResponse[0].confname,
            confcity: jsonResponse[0].confcity,
            confcountry: jsonResponse[0].confcountry,
            confwebpage: jsonResponse[0].confwebpage,
            confowner: jsonResponse[0].confowner,
            confdescription: jsonResponse[0].confdescription,
            confstartsubmission: formatDate(jsonResponse[0].confstartsubmission),
            confendsubmission: formatDate(jsonResponse[0].confendsubmission),
            confstartreview: formatDate(jsonResponse[0].confstartreview),
            confendreview: formatDate(jsonResponse[0].confendreview),
            confstartbidding: formatDate(jsonResponse[0].confstartbidding),
            confendbidding: formatDate(jsonResponse[0].confendbidding),
            confstartdate: formatDate(jsonResponse[0].confstartdate),
            confenddate: formatDate(jsonResponse[0].confenddate),
            conftype: jsonResponse[0].conftype,
            confareaid: jsonResponse[0].confareaid,
            confmaxreviewers: jsonResponse[0].confmaxreviewers,
            confminreviewers: jsonResponse[0].confminreviewers,
            confadddate: formatDate(jsonResponse[0].confadddate),
            confcontact: jsonResponse[0].confcontact,
          })

        } else {
          setMessage(
            <Alert severity="error">
              Failed to fetch conference details: {jsonResponse.message}
            </Alert>
          );
        }
      } catch (error) {
        setMessage(
          <Alert severity="error">
            Failed to fetch conference details!
          </Alert>
        );
      }
      setOpenLoading(false);
    }

    if(confID){
      fetchConfDetails()
    }
  }, [confID]);

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <DashboardLayout>
       <ConfNavbar />
         <Container maxWidth="sm">
           <MDBox mt={10} mb={2} textAlign="left">
           {message}
             <MDBox mb={3} textAlign="left">
               <Card>
                 <ConfereceDetails
                   text={dataForDetails}
                 />
               </Card>
             </MDBox>
           </MDBox>
         </Container>
       <Footer />
      </DashboardLayout>
    </>
  );
}
