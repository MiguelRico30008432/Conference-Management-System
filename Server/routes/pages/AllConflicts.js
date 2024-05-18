const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

router.post("/allConflicts", auth.ensureAuthenticated, async (req, res) => {
    try {
        const allConflicts = await db.queryCst(
        `SELECT
            
        `
        );

        if (allConflicts.length === 0) {
            return res.status(200).json([]);
        }
        
        return res.status(200).json(allConflicts);
    } catch (error) {
        log.addLog(error, "database", "AllConflicts -> /allConflicts");
        res.status(500).send({ msg: "Error fetching submission data" });
    }
});

module.exports = router;