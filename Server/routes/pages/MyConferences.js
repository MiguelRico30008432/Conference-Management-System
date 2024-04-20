const express = require("express");
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const router = express.Router();

router.post("/myConferences", auth.ensureAuthenticated, async (req, res) => {
  try {
    const result = await db.fetchMyConferences(req.body.userid);

    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;
