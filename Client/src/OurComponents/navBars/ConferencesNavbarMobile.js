/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import {IconButton, Icon } from "@mui/material";
import MDTypography from "components/MDTypography";
import NotificationItem from "examples/Items/NotificationItem";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

import * as React from 'react';
import { useState, useEffect, useContext} from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ConfRoutes from "../../conferenceRoutes";
import { ConferenceContext } from "../../conference.context";

function ConferencesNavbarMobile({ open, close }) {
  const { width } = open && open.getBoundingClientRect();

  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleCloseMenu = () => setOpenMenu(false);

  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <NotificationItem icon={<Icon>email</Icon>} title="Check new messages" />
      <NotificationItem icon={<Icon>podcasts</Icon>} title="Manage Podcast sessions" />
      <NotificationItem icon={<Icon>shopping_cart</Icon>} title="Payment successfully completed" />
    </Menu>
  );

  //----------------------------------------------------------------//
  const [anchorEl, setAnchorEl] = useState(null);
  const [subMenus, setSubMenus] = useState([]);

  const navigate = useNavigate();
  const { userRole } = useContext(ConferenceContext);
  const anchorRef = React.useRef(null);


  const handleClick = (event, parentKey) => {
    setAnchorEl(event.currentTarget);
    const menus = ConfRoutes.filter(
      (item) => item.type === "collapse" && item.submenu === parentKey
    );
    setSubMenus(menus);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubMenuClick = (route) => {
    handleClose();
    navigate(route);
  };

  const prevOpen = React.useRef(open);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
 //-----------------------------------------------------------------//
  
  return (
    <Menu
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      anchorEl={open}
      open={Boolean(open)}
      onClose={close}
      MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
    >
      <MDBox px={0.5}>
        {ConfRoutes.map((item) => {
            if (item.type === "title" && (item.permissions.includes(userRole) || item.permissions.includes("All"))) {
              return (
                <div key={item.name}>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    style={{ textTransform: "none", color: "black" }}
                    onClick={(e) => handleClick(e, item.parentkey)}
                  >
                    {item.name}
                  </Button>
                </div>
              );
            }
            return null;
          })}
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ // Define a origem do submenu
              vertical: "top",
              horizontal: "right", 
            }}
          >
            {subMenus.map((subMenu) => {
              // Verifique se o usuário tem permissão para ver este submenu
              if (subMenu.permissions.includes(userRole) || subMenu.permissions.includes("All")) {
                return (
                  <MenuItem
                    key={subMenu.name}
                    onClick={() => handleSubMenuClick(subMenu.route)}
                  >
                    {subMenu.name}
                  </MenuItem>
                );
              }})}
          </Menu>
        </MDBox>
    </Menu>
  );
}

// Typechecking props for the DefaultNavbarMenu
ConferencesNavbarMobile.propTypes = {
  open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
  close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

export default ConferencesNavbarMobile;
