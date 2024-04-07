import * as React from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function MoreDetails({ onClose, text }) {
  //falta alterar os dados para o start e end de sbmissions/bidding/reviews
  const rows = [
    { phase: "Phase", start: "Start", end: "End" },
    { phase: "Conference", start: text.confStartDate, end: text.confEndDate },
    { phase: "Submissions", start: text.confStartDate, end: text.confEndDate },
    { phase: "Bidding", start: text.confStartDate, end: text.confEndDate },
    { phase: "Reviews", start: text.confStartDate, end: text.confEndDate },
  ];

  return (
    <>
      <Card>
        <Container component="main" maxWidth="xs">
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "left",
            }}
          >
            <MDTypography
              variant="h10"
              fontWeight="medium"
              color="grey"
              textAlign="center"
              sx={{ mb: 3 }}
              mt={1}
            >
              {text.confname}
            </MDTypography>

            <Accordion style={{ marginBottom: "10px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
              >
                <Typography variant="h5">Description</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  {text.confdescription} <br />
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion style={{ marginBottom: "10px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
              >
                <Typography variant="h5">Important Dates</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow
                          key={row.phase}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {row.phase}
                          </TableCell>
                          <TableCell align="left">{row.start}</TableCell>
                          <TableCell align="left">{row.end}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>

            <Accordion style={{ marginBottom: "10px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
              >
                <Typography variant="h5">Extra Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                Aqui vou meter info extra como : conftype/ confareaid/
                confmaxreviewers/ confminreviewers/ confmaxsubmissions
              </AccordionDetails>
            </Accordion>

            <MDButton
              variant="gradient"
              color="info"
              sx={{ mt: 2, mb: 2 }}
              onClick={onClose}
            >
              Close Details
            </MDButton>
          </Box>
        </Container>
      </Card>
    </>
  );
}
