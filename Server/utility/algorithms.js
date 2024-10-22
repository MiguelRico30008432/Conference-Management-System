const db = require("../utility/database");
const log = require("../logs/logsManagement");

//------------ALORITHM FOR CONFLICTS----------------------------
async function conflicAlgorithm(confid) {
  try {
    //Obter lista com os emails do comite, chair, owner e respetivas afiliações
    const committeeIdsAffiliation = await db.fetchDataCst(`
        SELECT 
          ur.userrole,
          u.userid,
          u.useraffiliation
        FROM 
          userroles ur
        JOIN 
          users u ON ur.userid = u.userid
        WHERE 
          ur.confid = ${confid}
        AND ur.userrole IN ('Chair', 'Owner', 'Committee')
        `);

    //Obter submissões da conferência
    const submissionsids = await db.fetchDataCst(`
          SELECT
              submissionid
          FROM
              submissions
          WHERE
              submissionconfid = ${confid}
          `);

    //Por submissão obter os emails dos autores
    if (submissionsids.length > 0) {
      for (const submission of submissionsids) {
        const submissionid = submission.submissionid;
        const authorsEmails = await db.fetchDataCst(`
              SELECT
                  authorid,
                  userid,
                  authoraffiliation
              FROM 
                  authors
              WHERE
                  submissionid = ${submissionid}
            `);

        //Por membro do comite verificar se faz parte dos autores ou se é da mesma afiliação que os autores
        for (const committee of committeeIdsAffiliation) {
          for (const author of authorsEmails) {
            const conflictExists = await db.fetchDataCst(`
                  SELECT
                    conflictid
                  FROM
                    conflicts
                  WHERE
                    conflictconfid = ${confid} AND conflictuserid = '${committee.userid}' AND conflictsubmissionid = ${submission.submissionid}
                `);

            //Verificar primeiro se o conflito já existe
            if (conflictExists.length === 0) {
              //Se o membro do comitte for autor ou se tiver a mesma afiliação que, pelo menos, 1 dos autores, então adicionar na tabela de conflitos

              if (committee.userid === author.userid) {
                await db.fetchDataCst(`
                    INSERT INTO conflicts(conflictconfid, conflictreason, conflictsubmissionid, conflictuserid)
                    VALUES(${confid}, 'Part of the committee as ${committee.userrole} and registered as author.', ${submission.submissionid}, '${committee.userid}')
                    `);
              } else if (
                committee.useraffiliation === author.authoraffiliation
              ) {
                await db.fetchDataCst(`
                    INSERT INTO conflicts(conflictconfid, conflictreason, conflictsubmissionid, conflictuserid)
                    VALUES(${confid}, 'Same affiliation has 1 or more authors.', ${submission.submissionid}, '${committee.userid}')
                    `);
              }
            }
          }
        }
      }
    } else {
      return "No submissions where detected for this conference";
    }

    verifyBiddingsAfterConflictCheck();

    return "Conflicts have been Updated";
  } catch (error) {
    log.addLog(error, "database", "Algorithms -> conflicAlgorithm");
    return "Error declaring Conflicts (Algorithm)";
  }
}

//------------SUPPORT FUNCTION FOR CONFLICTS ALGORITHM----------
async function verifyBiddingsAfterConflictCheck() {
  //verificar se já existem biddings que sejam conflitos se sim apagar as mesmas
  const result = await db.fetchDataCst(`
    SELECT b.biddingid
    FROM biddings b
    JOIN conflicts c ON b.biddingconfid = c.conflictconfid 
      AND b.biddingsubmissionid = c.conflictsubmissionid
    JOIN users u ON c.conflictuserid = u.userid
    WHERE b.biddinguserid = u.userid
    `);

  if (result.length > 0) {
    for (const bid of result) {
      await db.fetchDataCst(`
        DELETE FROM biddings WHERE biddingid = ${bid.biddingid}
        `);
    }
  }
}

//------------ALORITHM FOR AUTOMATIC ASSIGNMENTS----------------------------
async function ReviewsAssignmentAlgorihtm(confid) {
  //get committe list
  const committeeIds = await getcommitteeIds(confid);

  //get submissions list
  const submissions = await getSubmissions(confid);

  //get biddings list
  const biddings = await getBiddings(confid);

  //get Assignments already defined
  const assignments = await getAssignments(confid);

  //get Conflicts list
  const conflicts = await getConflicts(confid);

  //get workload of each member in the committe
  let workload = await getWorkload(confid, committeeIds);

  //Average reviewers needed per submission (if its a decimal number, round down)
  const reviewersNeededPerReview = Math.floor(
    submissions.length / committeeIds.length
  );

  //Variable used in the while loop (will be true when all submission have the minimun number of reviewers assigned)
  let MinReviews = false;
  let loopsCompleted = 0;

  while (MinReviews === false || loopsCompleted === 5) {
    for (const submission of submissions) {
      let membersToAddWorkload = [];
      //Create temporary list with committee members with no conflict with the current submission
      const submissionNoConflictCommittee = committeeIds.filter((user) => {
        return !conflicts.some(
          (conflict) =>
            conflict.conflictsubmissionid === submission.submissionid &&
            conflict.conflictuserid === user.userid
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
            membersToAddWorkload.push(bid.userid);
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
            membersToAddWorkload.push(bid.userid);
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
    loopsCompleted++;
  }
  return "Algorithm runned successfully";
}

//------------SUPPORT FUNCTIONS FOR AUTOMATIC ASSIGNMENTS ALGORITHM----------
async function getcommitteeIds(confid) {
  try {
    const committeeIds = await db.fetchDataCst(`
      SELECT 
          u.userid,
          ur.userrole,
          u.useraffiliation
        FROM 
          userroles ur
        JOIN 
          users u ON ur.userid = u.userid
        WHERE 
          ur.confid = ${confid}
        AND ur.userrole IN ('Chair', 'Owner', 'Committee')
      `);
    return committeeIds;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getCommitteeIds()");
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
        u.userid,
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
        u.userid,
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
        conflictuserid
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
    return workload;
  } catch (error) {
    log.addLog(error, "database", "Bidding -> getWorkload()");
  }
}

async function addWorkload(workload, addingInfo) {
  for (const user of addingInfo) {
    for (const member of workload) {
      if (member.userid === user) {
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
        (noConflictMember) => noConflictMember.userid === member.userid
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
        if (member.userid === assignment.userid) {
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
      if (!assignments.find((assignment) => assignment.userid === bid.userid)) {
        //If the bid doesnt exist has an assignment already then we continue
        for (const memberWorkload of workload) {
          //If the member workload is less than minReviewers + minReviewers/2  then we had the bid has a prefered bid
          if (
            bid.userid === memberWorkload.userid &&
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
      if (!assignments.find((assignment) => assignment.userid === bid.userid)) {
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

module.exports = {
  conflicAlgorithm,
  ReviewsAssignmentAlgorihtm,
};
