import PageNotFound from "pages/PageNotFound";

//Submissions
import CreateSubmission from "pages/ConferencePages/CreateSubmission";
import MySubmissions from "pages/ConferencePages/MySubmissions";
import AllSubmissions from "pages/ConferencePages/AllSubmissions";

//Bidding
import Bidding from "pages/ConferencePages/BiddingPage";
import Conflicts from "pages/ConferencePages/Conflicts";
import MyBiddings from "pages/ConferencePages/MyBiddings";

//Reviews
import MyReviews from "pages/ConferencePages/MyReviews";
import AllReviews from "pages/ConferencePages/AllReviews";
import Assignements from "pages/ConferencePages/Assignements";

//Emails
import Compose from "pages/ConferencePages/Compose";
import SendInvitation from "pages/ConferencePages/SendInvitation";

//Administration
import ComiteManagement from "pages/ConferencePages/ComiteManagement";
import ConferenceDefinitions from "pages/ConferencePages/ConferenceDefinitionsPage";
import SubmissionsDecision from "pages/ConferencePages/SubmissionsDecision";

//Details
import ConferenceDescription from "pages/ConferencePages/ConferenceDescription";
import Events from "pages/ConferencePages/Events";

const ConfRoutes = [
  {
    type: "title",
    name: "Conference",
    parentkey: "Details",
    permissions: ["All"],
  },
  {
    type: "collapse", //Done
    name: "Details",
    submenu: "Details",
    route: "/MyConferences/ConferenceDescription",
    component: <ConferenceDescription />,
    permissions: ["All"],
  },
  {
    type: "collapse", //Done
    name: "Events",
    submenu: "Details",
    route: "/MyConferences/Events",
    component: <Events />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "title",
    name: "Submissions",
    parentkey: "Submissions",
    permissions: ["All"],
  },
  {
    type: "collapse", //Done
    name: "Create Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/CreateSubmission",
    component: <CreateSubmission />,
    permissions: ["All"],
  },
  {
    type: "collapse", //Done
    name: "My Submissions",
    submenu: "Submissions",
    route: "/MyConferences/Conference/MySubmissions",
    component: <MySubmissions />,
    permissions: ["All"],
  },
  {
    type: "collapse", //Done
    name: "All Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/AllSubmissions",
    component: <AllSubmissions />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "title",
    name: "Bidding",
    parentkey: "Bidding",
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "Bidding Process",
    submenu: "Bidding",
    route: "/MyConferences/Conference/Bidding",
    component: <Bidding />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "My Biddings",
    submenu: "Bidding",
    route: "/MyConferences/Conference/MyBidding",
    component: <MyBiddings />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "Conflicts Of Interest",
    submenu: "Bidding",
    route: "/MyConferences/Conference/ConflictsOfInterest",
    component: <Conflicts />,
    permissions: ["Owner", "Chair"],
  },
  {
    type: "title",
    name: "Reviews",
    parentkey: "Reviews",
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "All Reviews",
    submenu: "Reviews",
    route: "/MyConferences/Conference/AllReviews",
    component: <AllReviews />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "Assignements",
    submenu: "Reviews",
    route: "/MyConferences/Conference/Assignements",
    component: <Assignements />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "Assigned to me",
    submenu: "Reviews",
    route: "/MyConferences/Conference/MyReviews",
    component: <MyReviews />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "title",
    name: "Emails",
    parentkey: "Emails",
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "Compose",
    submenu: "Emails",
    route: "/MyConferences/Conference/EMails/Compose",
    component: <Compose />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "collapse", //Done
    name: "Send Invitation",
    submenu: "Emails",
    route: "/MyConferences/Conference/EMails/SendInvitation",
    component: <SendInvitation />,
    permissions: ["Owner", "Chair", "Committee"],
  },
  {
    type: "title",
    name: "Administration",
    parentkey: "Settings",
    permissions: ["Owner", "Chair"],
  },
  {
    type: "collapse", //Done
    name: "Comittee Management",
    submenu: "Settings",
    route: "/MyConferences/Conference/ComiteManagement",
    component: <ComiteManagement />,
    permissions: ["Owner", "Chair"],
  },
  {
    type: "collapse", //Done
    name: "Conference Settings",
    submenu: "Settings",
    route: "/MyConferences/Conference/ConferenceSettings",
    component: <ConferenceDefinitions />,
    permissions: ["Owner", "Chair"],
  },
  {
    type: "collapse", //Done
    name: "Submissions Decision",
    submenu: "Settings",
    route: "/MyConferences/Conference/SubmissionsDecision",
    component: <SubmissionsDecision />,
    permissions: ["Owner", "Chair"],
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
