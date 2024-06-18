const cron = require("node-cron");
const db = require("../utility/database");
const al = require("../utility/algorithms");
const log = require("../logs/logsManagement");

// Conflicts Cron Job
cron.schedule("0 0 0 * * *", async () => {
  try {
    const conferencesStartingBiggingPhase = await db.fetchDataCst(`
        SELECT confid FROM conferences WHERE DATE(confstartbidding) = DATE(NOW());
    `);

    if (conferencesStartingBiggingPhase.length > 0) {
      for (const conference of conferencesStartingBiggingPhase) {
        await al.conflicAlgorithm(conference.confid);
      }
    }
  } catch (error) {
    log.addLog(error, "cronjobs", "Conflicts Cron Job");
  }
});

// Review Assignments Cron Job
cron.schedule("0 0 0 * * *", async () => {
  try {
    const conferencesStartingReviewPhase = await db.fetchDataCst(`
            SELECT confid FROM conferences WHERE DATE(confendbidding) = DATE(NOW());
        `);

    if (conferencesStartingReviewPhase.length > 0) {
      for (const conference of conferencesStartingReviewPhase) {
        console.log(conference.confid);
        await al.ReviewsAssignmentAlgorihtm(conference.confid);
      }
    }
  } catch (error) {
    log.addLog(error, "cronjobs", "Review Assignments Cron Job");
  }
});
