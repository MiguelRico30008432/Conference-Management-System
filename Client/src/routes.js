import ExemplePage from "pages/ExemplePage";
import HomePage from "pages/HomePage";
import PageNotFound from "pages/PageNotFound";
import SignInPage from "pages/signInPage";
import SignUpPage from "pages/SignUpPage";
import PendingConferencesPage from "pages/PendingConferencesPage";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Home Page",
    key: "Home Page",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/HomePage",
    component: <HomePage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Pending Conferences",
    key: "Pending Conferences",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/PendingConferences",
    component: <PendingConferencesPage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Página de Exemplo",
    key: "ExemplePage",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/ExemplePage",
    component: <ExemplePage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "SignInPage",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/Signin",
    component: <SignInPage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/signup",
    component: <SignUpPage />,
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

/*  old menu
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
{
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
    display: false
  },
  {
    type: "collapse",
    name: "Tables",
    key: "tables",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/tables",
    component: <Tables />,
    display: false
  },
  {
    type: "collapse",
    name: "Billing",
    key: "billing",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/billing",
    component: <Billing />,
    display: false
  },
  {
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
    display: false
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/notifications",
    component: <Notifications />,
    display: false
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
    display: false
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
    display: false
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/sign-up",
    component: <SignUp />,
    display: false
  }, */
