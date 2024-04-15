import HomePage from "pages/HomePage";
import PageNotFound from "pages/PageNotFound";
import SignInPage from "pages/signInPage";
import SignUpPage from "pages/SignUpPage";
import Logout from "pages/LogOut.js";
import PendingConferencesPage from "pages/PendingConferencesPage";
import MyConferences from "pages/MyConferences";
import MyProfilePage from "pages/MyProfilePage";
import CallForPapers from "pages/CallForPapers";

// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "title",
    name: "admin",
    key: "AdminTitle",
    display: true,
  },
  {
    type: "collapse",
    name: "Pending Conferences",
    key: "PendingConferences",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/PendingConferences",
    component: <PendingConferencesPage />,
    display: true,
  },
  {
    type: "title",
    name: "HomePage",
    key: "HomePageTitle",
    display: true,
  },

  {
    type: "collapse",
    name: "Home Page",
    key: "HomePage",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/HomePage",
    component: <HomePage />,
    display: true,
  },
  {
    type: "title",
    name: "Conferences",
    key: "ConferencesTitle",
    display: true,
  },
  {
    type: "collapse",
    name: "Call For Papers",
    key: "CallForPapers",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/CallForPapers",
    component: <CallForPapers />,
    display: true,
  },
  {
    type: "collapse",
    name: "My Conferences",
    key: "MyConferences",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/MyConferences",
    component: <MyConferences />,
    display: true,
  },
  {
    type: "title",
    name: "User",
    key: "User",
    display: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "SignIn",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/Signin",
    component: <SignInPage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "Signup",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/signup",
    component: <SignUpPage />,
    display: true,
  },
  {
    type: "collapse",
    name: "My Profile",
    key: "MyProfile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/MyProfile",
    component: <MyProfilePage />,
    display: true,
  },
  {
    type: "collapse",
    name: "Log Out",
    key: "Logout",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/logout",
    component: <Logout />,
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
