import PageNotFound from "pages/PageNotFound";

//Submissions
import CreateSubmission from "pages/ConferencePages/CreateSubmission";
import MySubmissions from "pages/ConferencePages/MySubmissions";
import AllSubmissions from "pages/ConferencePages/AllSubmissions";

//Bidding
import Bidding from "pages/ConferencePages/BiddingPage";
import Conflicts from "pages/ConferencePages/Conflicts";
import MyBiddings from "pages/ConferencePages/MyBiddings";
import ManualAssignments from "pages/ConferencePages/ManualAssignments";
import AutomaticAssignments from "pages/ConferencePages/AutomaticAssignments";

//Reviews
import MyReviews from "pages/ConferencePages/MyReviews";
import AllReviews from "pages/ConferencePages/AllReviews";
import MySubmissionReviews from "pages/ConferencePages/MySubmissionReviews";

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
    icon: "copyall",
  },
  {
    type: "collapse", //Done
    name: "Details",
    submenu: "Details",
    route: "/MyConferences/ConferenceDescription",
    component: <ConferenceDescription />,
    permissions: ["All"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "Events",
    submenu: "Details",
    route: "/MyConferences/Events",
    component: <Events />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "title",
    name: "Submissions",
    parentkey: "Submissions",
    permissions: ["All"],
    icon: "publish",
  },
  {
    type: "collapse", //Done
    name: "Create Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/CreateSubmission",
    component: <CreateSubmission />,
    permissions: ["All"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "My Submissions",
    submenu: "Submissions",
    route: "/MyConferences/Conference/MySubmissions",
    component: <MySubmissions />,
    permissions: ["All"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "All Submission",
    submenu: "Submissions",
    route: "/MyConferences/Conference/AllSubmissions",
    component: <AllSubmissions />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "title",
    name: "Bidding",
    parentkey: "Bidding",
    permissions: ["Owner", "Chair", "Committee"],
    icon: "accessibility",
  },
  {
    type: "collapse", //Done
    name: "Conflicts Of Interest",
    submenu: "Bidding",
    route: "/MyConferences/Conference/ConflictsOfInterest",
    component: <Conflicts />,
    permissions: ["Owner", "Chair"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "All Assignments",
    submenu: "Bidding",
    route: "/MyConferences/Conference/AllAssignments",
    component: <AutomaticAssignments />,
    permissions: ["Owner", "Chair"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "Manual Assignments",
    submenu: "Bidding",
    route: "/MyConferences/Conference/ManualAssignments",
    component: <ManualAssignments />,
    permissions: ["Owner", "Chair"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "Bidding Process",
    submenu: "Bidding",
    route: "/MyConferences/Conference/Bidding",
    component: <Bidding />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "My Biddings",
    submenu: "Bidding",
    route: "/MyConferences/Conference/MyBidding",
    component: <MyBiddings />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "title",
    name: "Reviews",
    parentkey: "Reviews",
    permissions: ["All"],
    icon: "visibility",
  },
  {
    type: "collapse", //Done
    name: "All Reviews",
    submenu: "Reviews",
    route: "/MyConferences/Conference/AllReviews",
    component: <AllReviews />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "My Reviews",
    submenu: "Reviews",
    route: "/MyConferences/Conference/MyReviews",
    component: <MyReviews />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "Reviews of My Submissions",
    submenu: "Reviews",
    route: "/MyConferences/Conference/MySubmissionReviews",
    component: <MySubmissionReviews />,
    permissions: ["Author"],
    icon: "dashboard",
  },
  {
    type: "title",
    name: "Emails",
    parentkey: "Emails",
    permissions: ["Owner", "Chair", "Committee"],
    icon: "email",
  },
  {
    type: "collapse", //Done
    name: "Compose",
    submenu: "Emails",
    route: "/MyConferences/Conference/EMails/Compose",
    component: <Compose />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "email",
  },
  {
    type: "collapse", //Done
    name: "Send Invitation",
    submenu: "Emails",
    route: "/MyConferences/Conference/EMails/SendInvitation",
    component: <SendInvitation />,
    permissions: ["Owner", "Chair", "Committee"],
    icon: "dashboard",
  },
  {
    type: "title",
    name: "Administration",
    parentkey: "Settings",
    permissions: ["Owner", "Chair"],
    icon: "apartment",
  },
  {
    type: "collapse", //Done
    name: "Comittee Management",
    submenu: "Settings",
    route: "/MyConferences/Conference/ComiteManagement",
    component: <ComiteManagement />,
    permissions: ["Owner", "Chair"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "Conference Settings",
    submenu: "Settings",
    route: "/MyConferences/Conference/ConferenceSettings",
    component: <ConferenceDefinitions />,
    permissions: ["Owner", "Chair"],
    icon: "dashboard",
  },
  {
    type: "collapse", //Done
    name: "Submissions Decision",
    submenu: "Settings",
    route: "/MyConferences/Conference/SubmissionsDecision",
    component: <SubmissionsDecision />,
    permissions: ["Owner", "Chair"],
    icon: "dashboard",
  },
  {
    type: "404",
    name: "404",
    key: "404",
    route: "/PageNotFound",
    component: <PageNotFound />,
    display: false,
    icon: "dashboard",
  },
];

export default ConfRoutes;
