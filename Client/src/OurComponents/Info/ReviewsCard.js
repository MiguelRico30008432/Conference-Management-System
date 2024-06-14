import * as React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

export default function ReviewsCard({
  reviewName,
  reviewDate,
  review,
  grade,
  read = true,
  onReviewTextChange,
  onReviewGradeChange,
}) {
  const [reviewText, setReviewText] = useState(review || "");
  const [reviewGrade, setReviewGrade] = useState(grade || 0);

  useEffect(() => {
    setReviewText(review || "");
    setReviewGrade(grade || 0);
  }, [review, grade]);

  function handleTextChange(event) {
    const value = event.target.value;
    setReviewText(value);
    onReviewTextChange(value);
  }

  function handleGradeChange(event) {
    const value = event.target.value;
    setReviewGrade(value);
    onReviewGradeChange(value);
  }

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <MDTypography ml={2} mt={2} variant="body2">
          By: {reviewName}
        </MDTypography>
        <MDTypography ml={2} mb={1} variant="body2">
          On: {reviewDate}
        </MDTypography>

        <Box
          sx={{
            "& textarea": {
              padding: "18.5px 14px",
              fontSize: "0.9rem",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              border: "1px solid #c4c4c4",
              borderRadius: "4px",
              resize: "vertical",
              width: "90%",
              ml: 2,
              mr: 2,
              mb: 2,
            },
          }}
        >
          <textarea
            id="review"
            value={reviewText}
            rows={4}
            disabled={read}
            onChange={handleTextChange}
          />
        </Box>

        <MDTypography ml={2} variant="body2">
          Grade
        </MDTypography>

        <Select
          value={reviewGrade}
          sx={{ ml: 2, mr: 2, mb: 2, width: "90%" }}
          disabled={read}
          onChange={handleGradeChange}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </Card>
    </>
  );
}
