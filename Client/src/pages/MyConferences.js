import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import UpperNavBar from "OurComponents/navBars/UpperNavBar";

import CompleteTable from "OurComponents/Table/CompleteTable";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth.context";
import Alert from "@mui/material/Alert";
import Card from "@mui/material/Card";

import MDButton from "components/MDButton";

export default function MyConferences() {
  const { user } = useContext(AuthContext);

  const [rows, setRow] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getMyConferences() {
      try {
        const response = await fetch("http://localhost:8003/myConferences", {
          method: "POST",
          body: JSON.stringify({ userid: user }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          credentials: "include",
        });

        const jsonResponse = await response.json();

        if (response.status === 200) {
          for (let line of jsonResponse) {
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
    }

    getMyConferences();
  }, []);

  const columns = [
    { field: "confname", headerName: "Conference Name", width: 600 },
    { field: "userrole", headerName: "Your Role", width: 200 },
    {
      field: "",
      headerName: "Enter in conference",
      description:
        "This column have a button taht allows the user to enter int a specific conference",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        const handleMoreDetailsButtonClick = () => {
          console.log(params.row);
        };

        return (
          <MDButton
            variant="gradient"
            color="info"
            onClick={handleMoreDetailsButtonClick}
            sx={{
              maxWidth: "80px",
              maxHeight: "30px",
              minWidth: "30px",
              minHeight: "30px",
            }}
          >
            Enter
          </MDButton>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <UpperNavBar />
      {error}
      <Card>
        <CompleteTable
          columns={columns}
          rows={rows}
          numerOfRowsPerPage={5}
          height={200}
        />
      </Card>
      <br></br>
      <Footer />
    </DashboardLayout>
  );
}
