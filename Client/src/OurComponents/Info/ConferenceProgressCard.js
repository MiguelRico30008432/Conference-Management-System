import * as React from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ConferenceProgress from "OurComponents/loading/ConferenceProgress";
import { useEffect, useState, useContext } from "react";
import { ConferenceContext } from "conference.context";

export default function ConferenceProgressCard() {
  const { confID } = useContext(ConferenceContext);
  const [increment, setIncrement] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function getRows() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/conferanceProgress`,
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
          setIncrement(jsonResponse.percentage);
          setStatus(jsonResponse.status);
        }
      } catch (error) {}
    }

    if (confID) {
      getRows();
    }
  }, [confID]);

  return (
    <>
      <MDBox mb={3} textAlign="left">
        <Card>
          <MDBox display="flex" alignItems="center" p={1}>
            <MDTypography variant="body2">Conference Progress:</MDTypography>
            <MDBox
              width="40px"
              height="40px"
              borderRadius="50%"
              bgcolor="green"
              display="flex"
              justifyContent="center"
              alignItems="center"
              mr={2}
            >
              <ConferenceProgress value={increment} />
            </MDBox>
            <MDTypography variant="body2" ml={2}>
              |
            </MDTypography>
            <MDTypography variant="body2" ml={2}>
              Current phase: {status}
            </MDTypography>
          </MDBox>
        </Card>
      </MDBox>
    </>
  );
}
