import PageNotFound from "pages/PageNotFound";
import Submissions from "pages/ConferencePages/SubmissionsPage";
import Bidding from "pages/ConferencePages/BiddingPage";
import Reviews from "pages/ConferencePages/ReviewsPage";
import Mails from "pages/ConferencePages/EmailsPage";
import ComiteManagement from "pages/ConferencePages/ComiteManagement";
import ConferenceDefinitions from "pages/ConferencePages/ConferenceDefinitionsPage";
import ConferencePage from "pages/ConferencePages/ConferencePage";

// @mui icons
import Icon from "@mui/material/Icon";

const ConfRoutes = [
  {
    type: "title",
    name: "Details",
    parentkey: "Details",
    display: true,
  },
  {
    type: "collapse",
    name: "Details",
    submenu: "Details",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/MyConferences/Conference",
    component: <ConferencePage/>,
    display: true,
  },
  {
    type: "title",
    name: "Submissions",
    parentkey: "Submissions",
    display: true,
  },
  {
    type: "collapse",
    name: "Submissions",
    submenu: "Submissions",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/MyConferences/Conference/Submissions",
    component: <Submissions/>,
    display: true,
  },
  {
    type: "title",
    name: "Bidding",
    parentkey: "Bidding",
    display: true,
  },
  {
    type: "collapse",
    name: "Bidding",
    submenu: "Bidding",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/MyConferences/Conference/Bidding",
    component: <Bidding />,
    display: true,
  },
  {
    type: "title",
    name: "Reviews",
    parentkey: "Reviews",
    display: true,
  },
  {
    type: "collapse",
    name: "Reviews",
    submenu: "Reviews",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/MyConferences/Conference/Reviews",
    component: <Reviews />,
    display: true,
  },
  {
    type: "title",
    name: "Emails",
    parentkey: "Emails",
    display: true,
  },
  {
    type: "collapse",
    name: "Envio de Mails",
    submenu: "Emails",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/MyConferences/Conference/EMails",
    component: <Mails />,
    display: true,
  },
  {
    type: "title",
    name: "Settings",
    parentkey: "Settings",
    display: true,
  },
  {
    type: "collapse",
    name: "Gestão do Comitê",
    submenu: "Settings",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/MyConferences/Conference/ComiteManagement",
    component: <ComiteManagement />,
    display: true,
  },
  {
    type: "collapse",
    name: "Definições",
    submenu: "Settings",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/MyConferences/Conference/Settings",
    component: <ConferenceDefinitions />,
    display: true,
  },
  {
    type: "404",
    name: "404",
    key: "404",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/PageNotFound",
    component: <PageNotFound />,
    display: false,
  },
];

export default ConfRoutes;