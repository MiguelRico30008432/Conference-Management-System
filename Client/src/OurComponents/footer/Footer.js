import PropTypes from "prop-types";
import Link from "@mui/material/Link";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import typography from "assets/theme/base/typography";
import UALConf_TOS from "../../assets/UALConf_TOS.pdf" 

// @material-ui core components
import GitHubIcon from '@mui/icons-material/GitHub';
import SchoolIcon from '@mui/icons-material/School';

export default function Footer({ links }) {
  const { size } = typography;

  const renderLinks = () =>
    links.map((link) => (
      <MDBox key={link.name} component="li" px={1} lineHeight={1}>
        <Link href={link.href} target="_blank">
          <div style={{ display: "flex", marginTop: "10px", marginRight: "50px" }}>
            {link.name === "GitHub" && ( // Check if the link name is "GitHub"
              <>
                <GitHubIcon sx={{ marginRight: 1, marginLeft: -5 }} />
              </>
            )}
            {link.name !== "GitHub" && ( // If it's not "GitHub", render only SchoolIcon
              <SchoolIcon sx={{ marginRight: 1 }} />
            )}
            <MDTypography variant="button" fontWeight="regular" color="text">
              {link.name}
            </MDTypography>
          </div>
        </Link>
      </MDBox>
    ));

  return (
    <div
      style={{
        width: "100%",
        position: "flex", //change to fixed, if you want to see it all the time
        bottom: 0,
        right: 0,
        backgroundColor: "#f5f5f5",
        borderTop: "1px solid #dddddd",
        zIndex: 1000,
      }}
    >
      <MDBox
        width="100%"
        display="flex"
        flexDirection={{ xs: "column", lg: "row" }}
        justifyContent="space-between"
        alignItems="center"
        px={1.5}
      >
        <MDBox
          color="text"
          fontSize={size.sm}
          px={1.5}
        >
          <Link href= {UALConf_TOS} download="UALConf_TOS&PrivacyPolicy.pdf" style={{ marginRight: "15px", fontWeight: "bold" }}>Terms of Use & Privacy Policy</Link><br></br>
          &copy; {new Date().getFullYear()}, Made by Bernardo Pires, Christian Duarte, Miguel Rico, Sara Nogueira
        </MDBox>
        <MDBox
          component="ul"
          sx={({ breakpoints }) => ({
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            listStyle: "none",
            mt: 3,
            mb: 2,
            p: 0,

            [breakpoints.up("lg")]: {
              mt: 0,
            },
          })}
        >
          {renderLinks()}
        </MDBox>
      </MDBox>
    </div>
  );
}

Footer.defaultProps = {
  links: [
    { href: "https://autonoma.pt/", name: "UAL" },
    { href: "https://github.com/MiguelRico30008432/finalProject_CMS", name: "GitHub" }
  ],
};

Footer.propTypes = {
  links: PropTypes.arrayOf(PropTypes.object),
};
