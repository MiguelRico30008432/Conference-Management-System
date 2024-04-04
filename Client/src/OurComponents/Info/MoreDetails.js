import * as React from "react";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function MoreDetails({ onClose, text }) {
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
              sx={{ mb: 3}}
              mt={1}
            >
              {`Aqui aparece o nome da conferencia`}
            </MDTypography>

            <Accordion style={{ marginBottom: '10px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
              >
                <Typography variant="h5">Descrição</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Aqui vai estar a descrição da conferencia  <br />
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion style={{ marginBottom: '10px' }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel-content"
                id="panel-header"
              >
                <Typography variant="h5">Important Dates</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Aqui vão estar as datas  <br />
                </Typography>
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
