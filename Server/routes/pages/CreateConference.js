const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");
const router = express.Router();

router.post("/createConference", auth.ensureAuthenticated, async (req, res) => {
  try {
    let {
      title,
      user,
      confType,
      confArea,
      startDate,
      endDate,
      submissionStartDate,
      submissionEndDate,
      reviewStartDate,
      reviewEndDate,
      biddingStartDate,
      biddingEndDate,
      description,
      country,
      city,
      confLink,
      contact,
    } = req.body;

    if (!contact) {
      try {
        const userEmail = await db.fetchDataCst(`
          SELECT 
            useremail
          FROM 
            users
          WHERE 
            userid = ${user}
        `);

        contact = userEmail[0].useremail;
      } catch (error) {
        log.addLog(error, "database", "CreateConference -> /createConference");
        return res
          .status(500)
          .send({ msg: "Internal Error Getting User Contact" });
      }
    }

    const findTypeId = await db.fetchData(
      "conftypes",
      "conftypename",
      confType
    );
    const [{ conftypeid }] = findTypeId;

    const findAreaId = await db.fetchData(
      "confareas",
      "confareaname",
      confArea
    );
    const [{ confareaid }] = findAreaId;

    await db.fetchDataCst(
      `INSERT INTO conferences (
        confname, confowner, conftype, confareaid, confstartdate, confenddate, 
        confstartsubmission, confendsubmission, confstartreview, confendreview, 
        confstartbidding, confendbidding, confdescription, confcountry, confcity, 
        confwebpage, confcontact
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
      )`,
      [
        title,
        user,
        conftypeid,
        confareaid,
        startDate,
        endDate,
        submissionStartDate,
        submissionEndDate,
        reviewStartDate,
        reviewEndDate,
        biddingStartDate,
        biddingEndDate,
        description,
        country,
        city,
        confLink,
        contact,
      ]
    );

    await db.addData("conferences", {
      confname: title,
      confowner: user,
      conftype: conftypeid,
      confareaid: confareaid,
      confstartdate: startDate,
      confenddate: endDate,
      confstartsubmission: submissionStartDate,
      confendsubmission: submissionEndDate,
      confstartreview: reviewStartDate,
      confendreview: reviewEndDate,
      confstartbidding: biddingStartDate,
      confendbidding: biddingEndDate,
      confdescription: description,
      confcountry: country,
      confcity: city,
      confwebpage: confLink,
      confcontact: contact,
    });

    const query = `
      SELECT 
        confid
      FROM conferences
      WHERE confowner = ${user} AND confenddate >= NOW()
      ORDER BY confadddate DESC`;

    const addedConfID = await db.fetchDataCst(query);

    await db.addData("userroles", {
      userid: user,
      userrole: "Owner",
      confid: addedConfID[0].confid,
    });

    db.createEvent(addedConfID[0].confid, user, "Conference created");

    return res.status(200).send({ msg: "Conference created with success" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error  Create Conference" });
  }
});

router.get("/getConfTypes", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchAllData("conftypes", "conftypename");
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.get("/getConfAreas", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchAllData("confareas", "confareaname");
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;
