import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar";
import { ConferenceContext } from "conference.context";
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

export default function CreateSubmission() {
  const { confID, userRole } = useContext(ConferenceContext);
  const [file, setFile] = useState({});

  async function uploadFile(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    fetch("http://localhost:8003/uploadFile", {
      method: "POST",
      body: formData,
    });
  }

  async function handleDownload() {
    try {
      const response = await fetch("http://localhost:8003/downloadFile", {
        method: "POST",
        body: JSON.stringify({ fileid: 10 }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${"filename"}`);
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        const errorText = await response.text();
        console.error("Erro ao baixar o arquivo:", errorText);
      }
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
    }
  }

  return (
    <DashboardLayout>
      <ConfNavbar />
      <Container maxWidth="sm">
        <MDBox mt={10} mb={2} textAlign="left">
          <MDBox mb={3} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                Create Submission
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                text goes here
              </MDTypography>
            </Card>

            <Card sx={{ mt: 2 }}>
              <div className="form-group">
                <label>file</label>
                <input
                  type="file"
                  className="form-control"
                  placeholder="file"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
                  }}
                  id="file"
                  name="file"
                />
                <button onClick={(event) => uploadFile(event)}>Upload</button>
              </div>
            </Card>

            <Card sx={{ mt: 2 }}>
              <button onClick={handleDownload}>Download Ficheiro</button>
            </Card>
          </MDBox>
        </MDBox>
      </Container>
    </DashboardLayout>
  );
}
