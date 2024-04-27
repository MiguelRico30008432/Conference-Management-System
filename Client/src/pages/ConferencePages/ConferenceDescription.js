//Layout Component
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar"
import { ConferenceContext } from "conference.context";

// @mui material components
import * as React from "react";
import { useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";


export default function ConferenceDetails() {
  const { confID, userRole } = useContext(ConferenceContext);

  return (
    <DashboardLayout>
      <ConfNavbar/>
      Conference Description
    </DashboardLayout>
  );
}
