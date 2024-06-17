import * as React from "react";
import { useState, useEffect, useContext } from "react";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import LoadingCircle from "OurComponents/loading/LoadingCircle";
import MDButton from "components/MDButton";
import { fetchAPI } from "OurFunctions/fetchAPI";
import { AuthContext } from "auth.context";
import ReviewsCard from "./ReviewsCard";
import ModalInfo from "OurComponents/Modal/ModalInfo";

export default function MultiReviewsDone({ submissionID, title, onClose }) {
  const { user } = useContext(AuthContext);

  const [abstract, setAbstract] = useState(null);
  const [reviews, setReviews] = useState([]);

  const [openLoading, setOpenLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMultiReviews() {
      const response = await fetchAPI(
        "multiReviews",
        "POST",
        { userid: user, submissionid: submissionID },
        setError,
        setOpenLoading
      );

      if (response) {
        setAbstract(response.abstract[0].submissionabstract);
        setReviews(response.lines);
      }
    }

    fetchMultiReviews();
  }, []);

  return (
    <>
      {openLoading && <LoadingCircle />}
      <ModalInfo onClose={onClose}>
        {error && <Card sx={{ mt: 2, mb: 2 }}>{error}</Card>}

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
            {reviews.map((review, index) => (
              <ReviewsCard
                key={index}
                reviewName={review.username}
                reviewDate={review.reviewadddate}
                review={review.reviewtext}
                grade={review.reviewgrade}
                read={review.read}
              />
            ))}
          </Grid>
        </Grid>
      </ModalInfo>
    </>
  );
}
