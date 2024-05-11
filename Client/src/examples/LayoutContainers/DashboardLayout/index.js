import { useEffect, useState } from "react";

// react-router-dom components
import { useLocation } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React context
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
        p: 3,
        position: "relative",
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

// Typechecking props for the DashboardLayout
DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
