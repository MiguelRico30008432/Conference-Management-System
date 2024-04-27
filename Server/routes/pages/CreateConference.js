const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/createConference", auth.ensureAuthenticated, async (req, res) => {
  try {
    const {
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
      numberMinReviewrs,
      numberMaxReviewrs,
      numberMaxSubmissions,
      confLink,
    } = req.body;

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
      confmaxreviewers: numberMaxReviewrs,
      confminreviewers: numberMinReviewrs,
      confmaxsubmissions: numberMaxSubmissions,
      confwebpage: confLink,
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
      userrole: "Chair",
      confid: addedConfID[0].confid,
    });

    return res.status(200).send({ msg: "Conferência criada com sucesso" });
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
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
