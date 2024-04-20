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

const routes = [
  {
    type: "collapse",
    name: "ConferencePage",
    key: "ConferencePage",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/MyConferences/Conference",
    component: <ConferencePage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Submissions",
    key: "Submissions",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/Submissions",
    component: <Submissions />,
    display: true,
  },
  {
    type: "collapse",
    name: "Bidding",
    key: "Bidding",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/Bidding",
    component: <Bidding />,
    display: true,
  },
  {
    type: "collapse",
    name: "Reviews",
    key: "Reviews",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/Reviews",
    component: <Reviews />,
    display: true,
  },
  {
    type: "collapse",
    name: "Envio de Mails",
    key: "Envio de Mails",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/EMails",
    component: <Mails />,
    display: true,
  },
  {
    type: "collapse",
    name: "Gestão do Comitê",
    key: "Gestão do Comitê",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/ComiteManagement",
    component: <ComiteManagement />,
    display: true,
  },
  {
    type: "collapse",
    name: "Definições da Conferência",
    key: "Definições da Conferência",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/ConferenceDefinitions",
    component: <ConferenceDefinitions />,
    display: true,
  },
  {
    type: "collapse",
    name: "404",
    key: "404",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/PageNotFound",
    component: <PageNotFound />,
    display: false,
  },
];

export default routes;
