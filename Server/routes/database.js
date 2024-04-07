const express = require("express");
const db = require("../utility/database");
const auth = require("../utility/verifications");
const router = express.Router();

router.get("/pendingConferences", auth.ensureAuthenticated, async (req, res)=>{
  try {
    const result = await db.fetchDataPendingConferences("confapproved", 0);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send("Internal Error");
  }
});

router.post("/acceptOrRejectConference", async function (req, res) {
  try {
    await db.updateData(
      "conferences",
      { confapproved: req.body.acceptOrReject },
      { confid: req.body.confid }
    );
    return res.status(200).send("");
  } catch (error) {
    return res.status(500).send("Internal Error");
  }
});

module.exports = router;
