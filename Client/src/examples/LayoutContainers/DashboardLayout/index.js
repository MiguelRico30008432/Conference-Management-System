import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import MDBox from "components/MDBox";
import { useMaterialUIController, setLayout } from "context";

function DashboardLayout({ children }) {
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav } = controller;
  const { pathname } = useLocation();
  const [showMiniSidenav, setShowMiniSidenav] = useState(miniSidenav);

  useEffect(() => {
    setLayout(dispatch, "dashboard");
  }, [dispatch]);

  useEffect(() => {
    setShowMiniSidenav(miniSidenav);
  }, [miniSidenav]);

  return (
    <MDBox
      sx={({ breakpoints, transitions, functions: { pxToRem } }) => ({
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginLeft: showMiniSidenav ? pxToRem(0) : pxToRem(274),
        transition: transitions.create(["margin-left", "margin-right"], {
          easing: transitions.easing.easeInOut,
          duration: transitions.duration.standard,
        }),
        [breakpoints.up("xl")]: {
          marginLeft: showMiniSidenav ? pxToRem(120) : pxToRem(274),
        },
      })}
    >
      {children}
    </MDBox>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
