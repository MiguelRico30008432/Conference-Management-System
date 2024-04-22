const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/myConferences", auth.ensureAuthenticated, async (req, res) => {
  try {
    const query = `
      SELECT 
        userRoles.confid AS "id",
        confName,
        conferences.confid,
        STRING_AGG(userrole, ', ') AS userrole
      FROM conferences
      INNER JOIN userRoles ON userRoles.confid = conferences.confid
      WHERE userRoles.userid = ${req.body.userid} AND confenddate >= NOW()
      GROUP BY userRoles.confid, confName, conferences.confid`;

    const result = await db.fetchDataCst(query);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

router.post("/createConference", auth.ensureAuthenticated, async (req, res) => {
  try {
    const { title, user, confType, confArea, startDate, endDate, submissionStartDate, submissionEndDate, reviewStartDate, reviewEndDate, biddingStartDate, 
    biddingEndDate, description, country, city, numberMinReviewrs, numberMaxReviewrs, numberMaxSubmissions, confLink } = req.body;
    
    const findTypeId = await db.fetchData("conftypes", "conftypename", confType);
    const [{ conftypeid }] = findTypeId;
    
    const findAreaId = await db.fetchData("confareas", "confareaname", confArea);
    const [{ confareaid }] = findAreaId;
  
    await db.addData(
      "conferences",
      {
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
      },
    );
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
  }
);

router.get("/getConfAreas", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchAllData("confareas", "confareaname");
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
}
);

module.exports = router;
