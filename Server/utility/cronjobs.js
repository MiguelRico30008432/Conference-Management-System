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
        await al.ReviewsAssignmentAlgorihtm(conference.confid);
      }
    }
  } catch (error) {
    log.addLog(error, "cronjobs", "Review Assignments Cron Job");
  }
});

// Delete expired cookies Cron Job
cron.schedule("0 0 0 * * *", async () => {
  try {
    const sessionsExpired = await db.fetchDataCst(`
      SELECT sid FROM session WHERE expire < NOW() 
    `);

    if (sessionsExpired.length > 0) {
      for (const session of sessionsExpired) {
        await db.fetchDataCst(`
          DELETE FROM session
          WHERE sid = ${session[0].sid}  
        `);
      }
    }
  } catch (error) {
    log.addLog(error, "cronjobs", "Delete expired cookies Cron Job");
  }
});
