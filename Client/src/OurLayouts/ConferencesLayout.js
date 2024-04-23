// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import ConferenceNavBar from "OurComponents/navBars/ConferenceNavBar";
import PageLayout from "examples/LayoutContainers/PageLayout";

import { AuthContext } from "../auth.context";

export default function ConferencesLayout({ coverHeight, image, children }) {
  return (
    <PageLayout>
      <ConferenceNavBar/>
      <MDBox
        minHeight={coverHeight}
        borderRadius="xl"
        mx={2}
        my={2}
        pt={6}
        pb={10}
      />
      <MDBox
        mt={{ xs: -20, lg: -20 }}
        px={1}
        width="calc(100% - 2rem)"
        mx="auto"
      >
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={11} sm={9} md={5} lg={4} xl={4}>
            {children}
          </Grid>
        </Grid>
      </MDBox>
    </PageLayout>
  );
}

// Setting default props for the CoverLayout
ConferencesLayout.defaultProps = {
  coverHeight: "35vh",
};

// Typechecking props for the CoverLayout
ConferencesLayout.propTypes = {
  coverHeight: PropTypes.string,
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
