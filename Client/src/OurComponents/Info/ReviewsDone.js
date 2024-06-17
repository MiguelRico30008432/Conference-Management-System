import * as React from "react";
import { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import Alert from "@mui/material/Alert";
import MDButton from "components/MDButton";
import { fetchAPI } from "OurFunctions/fetchAPI";
import { AuthContext } from "auth.context";
import { ConferenceContext } from "conference.context";
import ReviewsCard from "./ReviewsCard";
import PopUpWithMessage from "OurComponents/Info/PopUpWithMessage";
import ModalInfo from "OurComponents/Modal/ModalInfo";

export default function ReviewsDone({ assignmentID, title, onClose }) {
  const { user } = useContext(AuthContext);
  const { confID, confPhase } = useContext(ConferenceContext);

  const [abstract, setAbstract] = useState(null);
  const [review, setReview] = useState("");
  const [originReview, setOriginReview] = useState(null);
  const [originGrade, setOriginGrade] = useState(null);

  const [openLoading, setOpenLoading] = useState(false);
  const [addReviewActive, setAddReviewActive] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [error, setError] = useState(null);
  const [popMessage, setPopMessage] = useState(false);
  const [deletePopMessage, setDeletePopMessage] = useState(false);
  const [blockCrud, setBlockCrud] = useState(false);

  useEffect(() => {
    async function fetchSingleReviews() {
      const response = await fetchAPI(
        "singleReview",
        "POST",
        { userid: user, assignmentid: assignmentID },
        setError,
        setOpenLoading
      );

      if (response) {
        setAbstract(response.abstract[0].submissionabstract);

        if (response.review.length > 0) {
          response.review[0].read = true;
          setOriginReview(response.review[0].reviewtext);
          setOriginGrade(response.review[0].reviewgrade);
          setReview(response.review[0]);
          setAddReviewActive(false);
        } else {
          setAddReviewActive(true);
          addNewReview(response.username[0].username);
        }
      }
    }

    if (assignmentID) fetchSingleReviews();
    if (confPhase !== "Review") setBlockCrud(true);
  }, [assignmentID]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  async function submitReview() {
    if (verifyRequiredFields()) {
      if (changeDetected()) {
        const response = await fetchAPI(
          "saveReview",
          "POST",
          {
            addNew: addReviewActive,
            confid: confID,
            responsibleUser: user,
            assignmentid: assignmentID,
            reviewgrade: review.reviewgrade,
            reviewtext: review.reviewtext,
          },
          setError,
          setOpenLoading
        );

        if (response) {
          setError(
            <Alert severity="success">
              Submission {addReviewActive ? "registered" : "updated"} with
              success
            </Alert>
          );
        }
      }

      disabledReviews();
      setAddReviewActive(false);
      setHideButton(false);
      setOriginReview(review.reviewtext);
      setOriginGrade(review.reviewgrade);
    }
  }

  async function deleteReview() {
    await fetchAPI(
      "deleteReview",
      "POST",
      {
        assignmentid: assignmentID,
        confid: confID,
        responsibleUser: user,
      },
      setError,
      setOpenLoading
    );

    setDeletePopMessage(false);
    closeComponent();
  }

  function addNewReview(userName) {
    setHideButton(true);

    setReview({
      username: userName,
      reviewadddate: new Date().toLocaleDateString(),
      reviewtext: "",
      reviewgrade: 1,
      read: false,
    });
  }

  function updateReview() {
    setHideButton(true);
    setReview({
      ...review,
      read: false,
    });
  }

  function disabledReviews() {
    setReview({
      ...review,
      read: true,
    });
  }

  function handleReviewChange(key, value) {
    setReview((review) => ({
      ...review,
      [key]: value,
    }));
  }

  function verifyCloseReview() {
    if (changeDetected()) {
      setPopMessage(true);
    } else {
      closeComponent();
    }
  }

  function changeDetected() {
    const text = review.reviewtext ?? null;
    const grade = review.reviewgrade ?? null;

    if (text !== originReview || grade !== originGrade) {
      return true;
    } else {
      return false;
    }
  }

  function verifyRequiredFields() {
    const text = review.reviewtext ?? null;
    const grade = review.reviewgrade ?? null;

    if (text === "" || text === null) {
      setError(<Alert severity="error">Your review cannot be empty</Alert>);
      return false;
    }
    if (grade === "" || grade === null) {
      setError(<Alert severity="error">Your grade cannot be empty</Alert>);
      return false;
    }

    return true;
  }

  function closeComponent() {
    onClose();
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <ModalInfo open={true} onClose={onClose}>
        <PopUpWithMessage
          open={popMessage}
          title={"Changes not saved!"}
          text={
            "Wait! You are about to lose your unsaved review, are you sure do you want to go back?"
          }
          negativeButtonName={"Cancel"}
          handleClose={() => setPopMessage(false)}
          affirmativeButtonName={"Yes, I'm Sure"}
          handleConfirm={closeComponent}
        />
        <PopUpWithMessage
          open={deletePopMessage}
          title={"Delete Review?"}
          text={"Wait! You are about to delete your review, are you sure?"}
          negativeButtonName={"Cancel"}
          handleClose={() => setDeletePopMessage(false)}
          affirmativeButtonName={"Yes, I'm Sure"}
          handleConfirm={async () => await deleteReview()}
        />
        <Card sx={{ mb: 2 }}>{error}</Card>
        <MDButton
          variant="gradient"
          color="info"
          onClick={verifyCloseReview}
          sx={{
            maxWidth: "140px",
            maxHeight: "30px",
            minWidth: "5px",
            minHeight: "30px",
            mb: 2,
          }}
        >
          Close Review
        </MDButton>
        {!blockCrud && (
          <>
            {!addReviewActive && !hideButton && (
              <>
                <MDButton
                  variant="gradient"
                  color="info"
                  onClick={updateReview}
                  sx={{
                    maxWidth: "145px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    ml: 2,
                    mb: 2,
                  }}
                >
                  Update Review
                </MDButton>

                <MDButton
                  variant="gradient"
                  color="error"
                  onClick={() => setDeletePopMessage(true)}
                  sx={{
                    maxWidth: "145px",
                    maxHeight: "30px",
                    minWidth: "5px",
                    minHeight: "30px",
                    ml: 2,
                    mb: 2,
                  }}
                >
                  Delete Review
                </MDButton>
              </>
            )}

            {hideButton && (
              <MDButton
                variant="gradient"
                color="success"
                onClick={async () => await submitReview()}
                sx={{
                  maxWidth: "150px",
                  maxHeight: "30px",
                  minWidth: "5px",
                  minHeight: "30px",
                  ml: 2,
                  mb: 2,
                }}
              >
                {addReviewActive ? "Add Review" : "Save Review"}
              </MDButton>
            )}
          </>
        )}
        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} md={5}>
            <Card>
              <MDTypography ml={2} mt={2} variant="h9">
                Title
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                {title}
              </MDTypography>
              <MDTypography ml={2} mt={2} variant="h9">
                Abstract
              </MDTypography>
              <MDTypography ml={2} mb={2} mr={1} variant="body2">
                {abstract}
              </MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <ReviewsCard
              reviewName={review.username}
              reviewDate={review.reviewadddate}
              review={review.reviewtext}
              grade={review.reviewgrade}
              read={review.read}
              onReviewTextChange={(value) =>
                handleReviewChange("reviewtext", value)
              }
              onReviewGradeChange={(value) =>
                handleReviewChange("reviewgrade", value)
              }
            />
          </Grid>
        </Grid>
      </ModalInfo>
    </>
  );
}
