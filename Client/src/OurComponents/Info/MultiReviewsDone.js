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

export default function MultiReviewsDone({ assignmentID, title, onClose }) {
  const { user } = useContext(AuthContext);
  const { confPhase } = useContext(ConferenceContext);

  const [abstract, setAbstract] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [userName, setUserName] = useState("");

  const [openLoading, setOpenLoading] = useState(false);
  const [addReviewActive, setAddReviewActive] = useState(false);
  const [hideButton, setHideButton] = useState(false);
  const [error, setError] = useState(null);

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

        if (response.lines.length > 0) {
          setReviews(response.lines);
          setAddReviewActive(false);
        } else {
          setUserName(response.username[0].username);
          setAddReviewActive(true);
        }
      }
    }

    fetchSingleReviews();
  }, []);

  function addNewReview() {
    setHideButton(true);
    const newReview = {
      username: userName,
      reviewadddate: new Date().toLocaleDateString(),
      reviewtext: "",
      reviewgrade: 1,
      read: false,
    };
    setReviews([...reviews, newReview]);
  }

  function updateReview() {
    setHideButton(true);
    setReviews(
      reviews.map((review) => ({
        ...review,
        read: false,
      }))
    );
  }

  function disabledReviews() {
    setReviews(
      reviews.map((review) => ({
        ...review,
        read: true,
      }))
    );
  }

  function handleReviewChange(index, key, value) {
    const updatedReviews = [...reviews];
    updatedReviews[index][key] = value;
    setReviews(updatedReviews);
  }

  async function submitReview() {
    const response = await fetchAPI(
      "saveReview",
      "POST",
      {
        addNew: addReviewActive,
        assignmentid: assignmentID,
        reviewgrade: reviews[0].reviewgrade,
        reviewtext: reviews[0].reviewtext,
      },
      setError,
      setOpenLoading
    );

    if (response) {
      setError(
        <Alert severity="success">
          Submission {addReviewActive ? "registered" : "updated"} with success
        </Alert>
      );
    }

    disabledReviews();
    setAddReviewActive(false);
    setHideButton(false);
  }

  return (
    <>
      {openLoading && <LoadingCircle />}
      <Container maxWidth="sm">
        <MDBox mt={10} mb={2} textAlign="left">
          <MDBox mb={3} textAlign="left">
            <Card>
              <MDTypography ml={2} variant="h6">
                My Reviews
              </MDTypography>
              <MDTypography ml={2} variant="body2">
                text goes here
              </MDTypography>
            </Card>
          </MDBox>
        </MDBox>

        <Card sx={{ mt: 2, mb: 2 }}>{error}</Card>

        <MDButton
          variant="gradient"
          color="info"
          onClick={onClose}
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

        {addReviewActive && !hideButton && (
          <MDButton
            variant="gradient"
            color="info"
            onClick={addNewReview}
            sx={{
              maxWidth: "125px",
              maxHeight: "30px",
              minWidth: "5px",
              minHeight: "30px",
              ml: 2,
              mb: 2,
            }}
          >
            New Review
          </MDButton>
        )}

        {!addReviewActive && !hideButton && (
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
            {addReviewActive ? "Add new" : "Save"}
          </MDButton>
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
              <MDTypography ml={2} mb={2} variant="body2">
                {abstract}
              </MDTypography>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            {reviews.map((review, index) => (
              <ReviewsCard
                key={index}
                reviewName={review.username}
                reviewDate={review.reviewadddate}
                review={review.reviewtext}
                grade={review.reviewgrade}
                read={review.read}
                onReviewTextChange={(value) =>
                  handleReviewChange(index, "reviewtext", value)
                }
                onReviewGradeChange={(value) =>
                  handleReviewChange(index, "reviewgrade", value)
                }
              />
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
