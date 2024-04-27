import PageNotFound from "pages/PageNotFound";

//Submissions
import CreateSubmission from "pages/ConferencePages/CreateSubmission"
import MySubmissions from "pages/ConferencePages/MySubmissions";
import AllSubmissions from "pages/ConferencePages/AllSubmissions";

//Bidding
import Bidding from "pages/ConferencePages/BiddingPage";
import Assignements from "pages/ConferencePages/Assignements";

//Reviews 
import MyReviews from "pages/ConferencePages/MyReviews";
import AllReviews from "pages/ConferencePages/AllReviews";

//Emails
import Compose from "pages/ConferencePages/Compose";
import SendInvitation from "pages/ConferencePages/SendInvitation";

//Administration
import ComiteManagement from "pages/ConferencePages/ComiteManagement";
import ConferenceDefinitions from "pages/ConferencePages/ConferenceDefinitionsPage";

//Details
import ConferenceDescription from "pages/ConferencePages/ConferenceDescription";
import ConferenceDates from "pages/ConferencePages/ConferenceDates";


const ConfRoutes = [
  {
    type: "title",
    name: "Conference",
    parentkey: "Details",
    permissions: ["All"],
  },
  {
    type: "collapse",//Done
    name: "Description",
    submenu: "Details",
    route: "/MyConferences/ConferenceDescription",
    component: <ConferenceDescription />,
    permissions: ["All"],
  },
  {
    type: "collapse",//Done
    name: "Dates",
    submenu: "Details",
    route: "/MyConferences/ConferenceDates",
    component: <ConferenceDates />,
    permissions: ["All"],
  },
  {
    type: "title",
    name: "Submissions",
    parentkey: "Submissions",
    permissions: ["All"],
  },
  {
    type: "collapse",//Done
    name: "Create Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/CreateSubmission",
    component: <CreateSubmission />,
    permissions: ["All"],
  },
  {
    type: "collapse",//Done
    name: "My Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/MySubmissions",
    component: <MySubmissions />,
    permissions: ["All"],
  },
  {
    type: "collapse",//Done
    name: "All Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/AllSubmissions",
    component: <AllSubmissions />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "title",
    name: "Bidding",
    parentkey: "Bidding",
    permissions: ["Chair", "Committee"],
  },
  {
    type: "collapse",//Done
    name: "Bidding Process",
    submenu: "Bidding",
    route: "/MyConferences/Conference/Bidding",
    component: <Bidding />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "collapse",//Done
    name: "Assignements",
    submenu: "Bidding",
    route: "/MyConferences/Conference/Assignements",
    component: <Assignements />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "title",
    name: "Reviews",
    parentkey: "Reviews",
    permissions: ["Chair", "Committee"],
  },
  {
    type: "collapse",//Done
    name: "All Reviews",
    submenu: "Reviews",
    route: "/MyConferences/Conference/AllReviews",
    component: <AllReviews />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "collapse",//Done
    name: "Assigned to me",
    submenu: "Reviews",
    route: "/MyConferences/Conference/MyReviews",
    component: <MyReviews />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "title",
    name: "Emails",
    parentkey: "Emails",
    permissions: ["Chair", "Committee"],
  },
  {
    type: "collapse",//Done
    name: "Compose",
    submenu: "Emails",
    route: "/MyConferences/Conference/EMails/Compose",
    component: <Compose />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "collapse",//Done
    name: "Send Invitation",
    submenu: "Emails",
    route: "/MyConferences/Conference/EMails/SendInvitation",
    component: <SendInvitation />,
    permissions: ["Chair", "Committee"],
  },
  {
    type: "title",
    name: "Administration",
    parentkey: "Settings",
    permissions: ["Chair"],
  },
  {
    type: "collapse",//Done
    name: "Comittee Management",
    submenu: "Settings",
    route: "/MyConferences/Conference/ComiteManagement",
    component: <ComiteManagement />,
    permissions: ["Chair"],
  },
  {
    type: "collapse",//Done
    name: "Conference Settings",
    submenu: "Settings",
    route: "/MyConferences/Conference/ConferenceSettings",
    component: <ConferenceDefinitions />,
    permissions: ["Chair"],
  },
  {
    type: "404",
    name: "404",
    key: "404",
    route: "/PageNotFound",
    component: <PageNotFound />,
    display: false,
  },
];

export default ConfRoutes;