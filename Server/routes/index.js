const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const usersRouter = require("./users");
const logInLogoutRouter = require("./logInLogout");
const pendingConferences = require("./pages/PendingConferences");
const myProfile = require("./pages/MyProfile");
const myConferences = require("./pages/MyConferences");
const createConference = require("./pages/CreateConference");
const ConferenceContext = require("./conferenceContext");
const ComitteeManagementPage = require("./pages/ComiteManagement");
const emailsPage = require("./pages/EmailsPage");
const conferenceDefinitions = require("./pages/ConferenceDefinitions");
const createSubmission = require("./pages/CreateSubmission");
const sendInvitations = require("./pages/SendInvitations");
const mySubmissions = require("./pages/MySubmissions");
const allSubmissions = require("./pages/AllSubmissions");
const conferenceDescription = require("./pages/ConferenceDescription");
const allConflicts = require("./pages/AllConflicts");
const events = require("./pages/Events");
const updateSubmission = require("./pages/UpdateSubmission");
const callForPapers = require("./pages/CallForPapers");

router.use(fileUpload());

router.use(logInLogoutRouter);
router.use(emailsPage);
router.use(sendInvitations);
router.use(usersRouter);
router.use(pendingConferences);
router.use(myProfile);
router.use(myConferences);
router.use(createConference);
router.use(ConferenceContext);
router.use(ComitteeManagementPage);
router.use(conferenceDefinitions);
router.use(createSubmission);
router.use(mySubmissions);
router.use(allSubmissions);
router.use(conferenceDescription);
router.use(allConflicts);
router.use(events);
router.use(updateSubmission);
router.use(callForPapers);

module.exports = router;
