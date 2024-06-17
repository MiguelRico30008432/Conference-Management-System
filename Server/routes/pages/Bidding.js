const express = require("express");
const router = express.Router();
const db = require("../../utility/database");
const auth = require("../../utility/verifications");
const log = require("../../logs/logsManagement");

async function getCommitteeEmails(confid) {
  try {
    const committeeEmails = await db.fetchDataCst(`
    SELECT 
        u.userid,
        ur.userrole,
        u.useremail,
        u.useraffiliation
      FROM 
        userroles ur
      JOIN 
        users u ON ur.userid = u.userid
      WHERE 
        ur.confid = ${confid}
      AND ur.userrole IN ('Chair', 'Owner', 'Committee')
    `);
    return committeeEmails;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getCommitteeEmails()");
  }
}

async function getSubmissions(confid) {
  try {
    const submissions = await db.fetchDataCst(`
    SELECT
      submissionid
    FROM
      submissions
    WHERE
      submissionconfid = ${confid}
    ORDER BY 
      submissionid
    `);

    return submissions;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getSubmissions()");
  }
}

async function getBiddings(confid) {
  try {
    const biddings = await db.fetchDataCst(`
    SELECT
      s.submissiontitle,
      u.useremail,
      b.biddingconfidence,
      b.biddingadddata,
      b.biddingconfid,
      b.biddingsubmissionid,
      b.biddinguserid
    FROM
      biddings b
    JOIN
      users u ON b.biddinguserid = u.userid
    JOIN
      submissions s ON b.biddingsubmissionid = s.submissionid
    WHERE
      b.biddingconfid = ${confid}
    ORDER BY
      b.biddingid
    `);

    return biddings;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getBiddings()");
  }
}

async function getAssignments(confid) {
  try {
    const assignments = await db.fetchDataCst(`
    SELECT
      r.assignmentid,
      r.assignmentsubmissionid,
      u.useremail,
      r.assignmentmanually
    FROM
      reviewsassignments r
    JOIN
      users u ON r.assignmentuserid = u.userid
    WHERE
      r.assignmentconfid = ${confid}
    ORDER BY
      r.assignmentid
    `);

    return assignments;
  } catch (error) {
    log.addLog(error, "database", "Reviews -> getAssignments()");
  }
}

async function getConflicts(confid) {
  try {
    const conflicts = await db.fetchDataCst(`
    SELECT
      conflictsubmissionid,
      conflictuseremail
    FROM
      conflicts
    WHERE
      conflictconfid = ${confid}
    ORDER BY 
      conflictsubmissionid
    `);

    return conflicts;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getConflicts()");
  }
}

async function getWorkload(confid, committe) {
  try {
    const workload = await db.fetchDataCst(`
    SELECT 
      u.userid,
      u.useremail,
      ur.userrole,
      COUNT(ra.assignmentid) AS assignment_count
    FROM 
      userroles ur
    JOIN 
      users u ON ur.userid = u.userid
    JOIN 
      reviewsassignments ra 
      ON ur.userid = ra.assignmentuserid
      AND ur.confid = ra.assignmentconfid
    WHERE 
      ur.confid = ${confid}
      AND ur.userrole IN ('Chair', 'Owner', 'Committee')
    GROUP BY 
      u.useremail,
      ur.userrole,
      u.userid
    `);

    if (workload.length < committe.length) {
      //If theres no assignments we create workload where all users will have 0 as assignment_count
      for (const member of committe) {
        if (!workload.find((user) => user.userid === member.userid)) {
          member["assignment_count"] = 0;
          workload.push(member);
        }
      }
    }
    console.log("WORKLOAD");
    console.log(workload);
    return workload;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getWorkload()");
  }
}

async function addWorkload(workload, addingInfo) {
  for (const user of addingInfo) {
    for (const member of workload) {
      if (member.useremail === user || member.userid === user) {
        member.assignment_count = member.assignment_count + 1;
      }
    }
  }
  return workload;
}

async function addToAssignment(biddings) {
  try {
    for (const bid of biddings) {
      const verifyAssignmentExistence = await db.fetchDataCst(`
        SELECT 
          assignmentid
        FROM
          reviewsassignments
        WHERE
          assignmentconfid = ${bid.biddingconfid} AND assignmentsubmissionid = ${bid.biddingsubmissionid} AND	assignmentuserid = ${bid.biddinguserid}
        `);

      if (verifyAssignmentExistence.length === 0) {
        await db.fetchDataCst(`
          INSERT INTO ReviewsAssignments (assignmentconfid, assignmentsubmissionid, assignmentuserid, assignmentmanually)
          VALUES(${bid.biddingconfid}, ${bid.biddingsubmissionid}, ${bid.biddinguserid}, FALSE)
        `);
      }
    }
  } catch (error) {
    log.addLog(error, "database", "Bidding -> addToAssignment()");
  }
}

async function verifyAssignmentsReviewers(confid, minimumReviewersNeeded) {
  try {
    const assignments = await db.fetchDataCst(`
    SELECT
      assignmentsubmissionid,
      COUNT(assignmentsubmissionid) AS assignment_count
    FROM 
      reviewsassignments
    WHERE
      assignmentconfid = ${confid}
    GROUP by
      assignmentsubmissionid	
    `);
    for (const assignment of assignments) {
      if (assignment.assignment_count < minimumReviewersNeeded) {
        return false;
      }
    }
    return true;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> verifyAssignmentsReviewers()");
  }
}

async function deleteAutomaticAssignments(assignmentsToDelete) {
  try {
    for (const assignment of assignmentsToDelete) {
      await db.fetchDataCst(`
      DELETE FROM reviewsassignments WHERE assignmentid = ${assignment.assignmentid};
      `);
    }
  } catch (error) {
    log.addLog(error, "database", "Bidding -> deleteAutomaticAssignments()");
  }
}

async function getCommitteMembersWithLessWorkload(
  workload,
  missingReviewers,
  membersWithNoConflict
) {
  let choosenMembers = [];

  workload.sort((a, b) => a.assignment_count - b.assignment_count); //Orders the list by assignmentcount value from lower to higher
  for (const member of workload) {
    if (
      //checking if the committee member we want to choose has no conflict with the current submission
      membersWithNoConflict.some(
        (noConflictMember) => noConflictMember.useremail === member.useremail
      )
    ) {
      choosenMembers.push(member);
      if (choosenMembers.length === missingReviewers) {
        return choosenMembers;
      }
    }
  }
  return choosenMembers;
}

async function pickPreferableAutomaticAssignments(
  automaticAssignments,
  workload,
  assignmentsNeeded
) {
  //If we get to this function there probably was manual assignments added after the automatic ones were run at least once
  //soo we will chose the ones with the reviewer that has least workload
  try {
    let preferedAssignments = [];

    workload.sort((a, b) => a.assignment_count - b.assignment_count); //Orders the list by assignmentcount value from lower to higher
    //With the least ordered we will run each member to check if he has an automatica assignment
    //If he does we add it to the preferedAssignments list
    //When preferedAssignments.length === assignmentsNeeded we return preferedAssignments
    for (const member of workload) {
      for (const assignment of automaticAssignments) {
        if (member.useremail === assignment.useremail) {
          preferedAssignments.push(assignment);

          if (preferedAssignments.length === assignmentsNeeded) {
            return preferedAssignments;
          }
        }
      }
    }
  } catch (error) {
    log.addLog(
      error,
      "database",
      "Bidding -> pickPreferableAutomaticAssignments()"
    );
  }
}

async function pickPreferableBiddings(
  biddingsList,
  workload,
  bidsNeeded,
  minReviewers,
  assignments
) {
  let preferedBids = [];
  try {
    biddingsList.sort((a, b) => b.biddingconfidence - a.biddingconfidence); //Orders the list by biddingconfidence value from higher to lower

    for (const bid of biddingsList) {
      //We will check each bid until we have the equal ammount of bids needed
      if (
        !assignments.find(
          (assignment) => assignment.useremail === bid.useremail
        )
      ) {
        //If the bid doesnt exist has an assignment already then we continue
        for (const memberWorkload of workload) {
          //If the member workload is less than minReviewers + minReviewers/2  then we had the bid has a prefered bid
          if (
            bid.useremail === memberWorkload.useremail &&
            memberWorkload.assignment_count <
              minReviewers + Math.floor(minReviewers / 2)
          ) {
            preferedBids.push(bid);
            if (preferedBids.length === bidsNeeded) {
              return preferedBids;
            }
          }
        }
      }
    }

    if (preferedBids.length < bidsNeeded) {
      // If there was not enougth biddings selected we will just pick the first one with high confidence level
      if (
        !assignments.find(
          (assignment) => assignment.useremail === bid.useremail
        )
      ) {
        preferedBids.push(bid);
        if (preferedBids.length === bidsNeeded) {
          return preferedBids;
        }
      }
    }
  } catch (error) {
    log.addLog(error, "database", "Bidding -> pickPreferableBiddings()");
  }
}

async function prepareAssignmentForReviewers(
  choosenReviewers,
  confid,
  submissionid
) {
  let preparedToAddToAssignments = [];
  for (const reviewer of choosenReviewers) {
    preparedToAddToAssignments.push({
      biddingconfid: confid,
      biddingsubmissionid: submissionid,
      biddinguserid: reviewer.userid,
    });
  }
  return preparedToAddToAssignments;
}

async function ReviewsAssignmentAlghoritm(confid) {
  //get committe list
  const committeeEmails = await getCommitteeEmails(confid);

  //get submissions list
  const submissions = await getSubmissions(confid);

  //get biddings list
  const biddings = await getBiddings(confid);

  //get Assignments already defined
  const assignments = await getAssignments(confid);

  //get Conflicts list
  const conflicts = await getConflicts(confid);

  //get workload of each member in the committe
  let workload = await getWorkload(confid, committeeEmails);

  //Average reviewers needed per submission (if its a decimal number, round down)
  const reviewersNeededPerReview = Math.floor(
    submissions.length / committeeEmails.length
  );

  //Variable used in the while loop (will be true when all submission have the minimun number of reviewers assigned)
  let MinReviews = false;

  while (MinReviews === false) {
    for (const submission of submissions) {
      let membersToAddWorkload = [];
      //Create temporary list with committee members with no conflict with the current submission
      const submissionNoConflictCommittee = committeeEmails.filter((user) => {
        return !conflicts.some(
          (conflict) =>
            conflict.conflictsubmissionid === submission.submissionid &&
            conflict.conflictuseremail === user.useremail
        );
      });

      //Create temporary list with already defined assignments
      let submissionMadeAssignments = [];
      for (const assignment of assignments) {
        if (assignment.assignmentsubmissionid === submission.submissionid) {
          submissionMadeAssignments.push(assignment);
        }
      }

      //Separate manual assignments(cant be altered) from automatic assignments(can be altered)
      let manualAssignments = [];
      let automaticAssignments = [];
      if (submissionMadeAssignments.length > 0) {
        for (const madeAssignment of submissionMadeAssignments) {
          if (madeAssignment.assignmentmanually === true) {
            manualAssignments.push(madeAssignment);
          } else {
            automaticAssignments.push(madeAssignment);
          }
        }
      }
      //If theres enougth manual assignments, delete automatic assignments and skip to next submission
      if (manualAssignments.length >= reviewersNeededPerReview) {
        await deleteAutomaticAssignments(automaticAssignments);
        continue;
      }

      // If submissionMadeAssignments = reviewersNeededReview then we skip for next submission
      if (submissionMadeAssignments.length === reviewersNeededPerReview) {
        continue;
      }

      //If submissionMadeAssignments > reviewerNeededPerReview, then we need to choose witch automatica assignments stay
      if (submissionMadeAssignments.length > reviewersNeededPerReview) {
        //From the automatic assignments we choose the preferible ones having in count confidence level and workload of the committee members
        const automaticAssignmentsNeeded =
          reviewersNeededPerReview - manualAssignments.length;

        const choosenAutomaticAssignments =
          await pickPreferableAutomaticAssignments(
            automaticAssignments,
            workload,
            automaticAssignmentsNeeded
          );

        //Then we delete the assignments we do not use
        const unnacesseryAssignments = automaticAssignments.filter(
          (assignment) => {
            return !choosenAutomaticAssignments.some(
              (choosen) => choosen === assignment
            );
          }
        );

        await deleteAutomaticAssignments(unnacesseryAssignments);
        continue;
      }

      //If theres not enougth submissionMadeAssignments then we need to check biddings
      if (submissionMadeAssignments.length < reviewersNeededPerReview) {
        //create temporary list with the submission biddings
        const submissionBiddings = biddings.filter(
          (bid) => bid.biddingsubmissionid === submission.submissionid
        );

        //If theres enougth biddings so that all assignments + biddings = reviewersNeededPerReview, then we register the biddings as automatic assignments
        if (
          submissionMadeAssignments.length + submissionBiddings.length ===
          reviewersNeededPerReview
        ) {
          //Create the assignments from the biddings and add workload to the major list (this way we keep it updated without needing to check the database again)
          await addToAssignment(submissionBiddings);

          //Get list of the users who have new assignments to add on the workload
          membersToAddWorkload = [];
          for (const bid of submissionBiddings) {
            membersToAddWorkload.push(bid.useremail);
          }

          workload = await addWorkload(workload, membersToAddWorkload); //Apos ter esta função em todo o lado necessario ver qual a melhor maneira de processar e o que enviar para a função
          continue;
        }

        //If theres all assignments + biddings > reviewersNeededPerReview, then we need to pick our preferable biddings and then register them as automatic assignments
        if (
          submissionMadeAssignments.length + submissionBiddings.length >
          reviewersNeededPerReview
        ) {
          //First we check how many bids we need to choose
          const bidsNeeded =
            reviewersNeededPerReview - submissionMadeAssignments.length;

          //From the ones we have we pick the best ones, based on confidence level and workload
          const preferedBiddings = await pickPreferableBiddings(
            submissionBiddings,
            workload,
            bidsNeeded,
            reviewersNeededPerReview,
            assignments
          );
          //Then we add them to the reviewAssignments table and add the workload to keep it updated
          await addToAssignment(preferedBiddings);

          membersToAddWorkload = [];
          for (const bid of preferedBiddings) {
            membersToAddWorkload.push(bid.useremail);
          }

          workload = await addWorkload(workload, membersToAddWorkload);
          continue;
        }

        if (
          submissionMadeAssignments.length + submissionBiddings.length <
          reviewersNeededPerReview
        ) {
          //If we need to assign committee members to review a certain submission then we first need assign the biddings
          await addToAssignment(submissionBiddings);

          //Then we the pick the committee members with less workload
          //We need to know how many reviewers we need
          const missingReviewers =
            reviewersNeededPerReview -
            (submissionMadeAssignments.length + submissionBiddings.length);

          //Now we pick the ones with less workload
          const choosenReviewers = await getCommitteMembersWithLessWorkload(
            workload,
            missingReviewers,
            submissionNoConflictCommittee
          );

          //Preparing the data to send to addBiddingToAssignments
          const forcedAssignments = await prepareAssignmentForReviewers(
            choosenReviewers,
            confid,
            submission.submissionid
          );

          //Then we add them to the reviewAssignments table and add the workload to keep it updated
          await addToAssignment(forcedAssignments);

          membersToAddWorkload = [];
          for (const assignment of forcedAssignments) {
            membersToAddWorkload.push(assignment.biddinguserid);
          }

          workload = await addWorkload(workload, membersToAddWorkload);
          continue;
        }
      }
    }

    //Function to verify if all submissions have the minimal number of reviewers
    //If true the loop will stop and the algorithm is completed
    //If false the loop will run again and assign reviewers to the missing submissions
    MinReviews = await verifyAssignmentsReviewers(
      confid,
      reviewersNeededPerReview
    );
  }
  /*  VERIFICAR NO FINAL SE COM O QUE TEMOS ESTA RELATIVAMENTE BALANCEADO OU SE TEMOS DE CRIAR UMA FUNÇÂO PARA ISTO
--Verificar carga de trabalho de cada membro do comite: (Ver se consigo tratar disto logo no manualAssignments.length + submissionBiddings.length > reviewersNeededPerReview)
---Separar nº de assignments manuais (não alteráveis) e nº assignments automáticos (alteraveis)
---Por membro, se a diferença de carga laboral do mesmo e o membro com menos carga, existir uma diferença de (media de assignments por reviewer + metade da media) assignments:
---- Se for assignments manuais não mexe,
---- Se for assignments automaticos retirar ate chegar a uma diferença de (media de assignments por reviewer + metade da media) assignments em relação ao membro com menos carga
---- No final tenho de ter uma validação para passar isto true ou false devido aos assignments manuais (Desenvolver este ponto)
 */
}

router.post(
  "/reviewsAssignmentsAlgorithm",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      await ReviewsAssignmentAlghoritm(req.body.confid);
      return res
        .status(200)
        .send({ msg: "Reviews Assignments have been Updated" });
    } catch (error) {
      log.addLog(error, "database", "Bidding -> /reviewsAssignmentsAlgorithm");
      return res
        .status(500)
        .send({ msg: "Error running reviews assignment algorithm" });
    }
  }
);

router.post(
  "/getSubmissionsForBidding",
  auth.ensureAuthenticated,
  async (req, res) => {
    try {
      const result = await db.fetchDataCst(`
    SELECT
      s.submissionid,
      s.submissiontitle
    FROM
      submissions s
    WHERE
      s.submissionconfid = ${req.body.confid}
      AND NOT EXISTS (
          SELECT 1
          FROM biddings b
          WHERE b.biddingsubmissionid = s.submissionid
            AND b.biddinguserid = ${req.body.userid}
      )
      AND NOT EXISTS (
          SELECT 1
          FROM conflicts c
          JOIN users u ON u.useremail = c.conflictuseremail
          WHERE c.conflictsubmissionid = s.submissionid
            AND u.userid = ${req.body.userid})
    `);
      return res.status(200).send(result);
    } catch (error) {
      log.addLog(error, "endpoint", "getSubmissionsForBidding");
      return res.status(500).send({ msg: "Internal Error" });
    }
  }
);

router.post("/saveBidding", auth.ensureAuthenticated, async (req, res) => {
  try {
    if (req.body.bids.length === 0) {
      return res.status(404).send({ msg: "No valid bids were submitted." });
    }

    for (const bid of req.body.bids) {
      await db.fetchDataCst(`
      INSERT INTO biddings (biddingconfid, biddingsubmissionid, biddinguserid, biddingconfidence)
        VALUES (${req.body.confid}, ${bid.submissionid}, ${req.body.userid}, ${bid.confidence})
      `);
    }
    return res.status(200).send({});
  } catch (error) {
    log.addLog(error, "endpoint", "getSubmissionsForBidding");
    return res.status(500).send({ msg: "Internal Error" });
  }
});

module.exports = router;
