const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/conferenceDescription", auth.ensureAuthenticated, async (req, res) => {
    try {
        const confData = await db.fetchDataCst(
        `SELECT
            c.confname,
            c.confcity,
            c.confcountry,
            c.confwebpage,
            c.confdescription,
            c.confstartsubmission,
            c.confendsubmission,
            c.confstartreview,
            c.confendreview,
            c.confstartbidding,
            c.confendbidding,
            c.confstartdate,
            c.confenddate,
            c.confmaxreviewers,
            c.confminreviewers,
            c.confadddate,
            c.confcontact,
            ct.conftypename AS conftype,
            ca.confareaname AS confareaid,
            CONCAT(u.userfirstname, ' ', u.userlastname) AS confowner
        FROM
            conferences c
        JOIN
            conftypes ct ON c.conftype = ct.conftypeid
        JOIN
            confareas ca ON c.confareaid = ca.confareaid
        JOIN
            users u ON c.confowner = u.userid
        WHERE
            c.confid = ${req.body.confID}`
        );

        return res.status(200).json(confData);
    } catch (error) {
        log.addLog(error, "database", "ConferenceDescription -> /conferenceDescription");
        res.status(500).send({ msg: "Error fetching submission data" });
    }
});

module.exports = router;