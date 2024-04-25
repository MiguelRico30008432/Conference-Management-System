//Layout Component
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import ConfNavbar from "../../OurComponents/navBars/ConferenceNavBar"
import { ConferenceContext } from "conference.context";
import Footer from "OurComponents/footer/Footer";

// @mui material components
import * as React from "react";
import { useState, useContext } from "react";
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Import the ArrowDropDownIcon



export default function EmailsPage() {
  const { confID, userRole } = useContext(ConferenceContext);
  const [recipient, setRecipient] = useState('');

  const handleSendEmail = (event) => {
    event.preventDefault();
    // Implement your logic for sending an email here
  };

  const handleRecipientChange = (event) => {
    setRecipient(event.target.value);
  };

  return (
    <DashboardLayout>
      <ConfNavbar/>
      <Container maxWidth="sm">
        <Card sx={{ mt: 6, p: 3 }}>
          <Typography variant="h6" gutterBottom component="div">
            Send Email
          </Typography>
          <Box component="form" onSubmit={handleSendEmail} noValidate sx={{ mt: 1 }}>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Send To
            </Typography>
            <FormControl fullWidth margin="normal" variant="outlined" sx={{ width: '100%' }}>
              <Select
                id="recipient"
                value={recipient}
                onChange={handleRecipientChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                IconComponent={() => <ArrowDropDownIcon />} // Use IconComponent to display the arrow
                sx={{ height: '3rem' }} // Adjust height here
              >
                <MenuItem value="" disabled>Choose a Group to Send the Email</MenuItem>
                <MenuItem value="chair">Chair</MenuItem>
                <MenuItem value="pc-members">PC Members</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Subject *
            </Typography>
            <Box
              sx={{
                '& textarea': {
                  width: '100%',
                  padding: '18.5px 14px',
                  fontSize: '0.9rem',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  border: '1px solid #c4c4c4',
                  borderRadius: '4px',
                  '&:focus': {
                    outline: '2px solid #3f51b5',
                    borderColor: 'transparent',
                  },
                  resize: 'vertical',
                },
              }}
            >
              <textarea
                aria-label="Subject"
                rows={1}
                placeholder="Enter your subject here"
                required
              />
            </Box>
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Description *
            </Typography>
            <Box
              sx={{
                '& textarea': {
                  width: '100%',
                  padding: '18.5px 14px',
                  fontSize: '0.9rem',
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  border: '1px solid #c4c4c4',
                  borderRadius: '4px',
                  '&:focus': {
                    outline: '2px solid #3f51b5',
                    borderColor: 'transparent',
                  },
                  resize: 'vertical',
                },
              }}
            >
              <textarea
                aria-label="Description"
                rows={4}
                placeholder="Enter your description here"
                required
              />
            </Box>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, color: 'white !important' }}
            >
              Send Email
            </Button>
          </Box>
        </Card>
      </Container>
      <br></br>
      <Footer />
    </DashboardLayout>
  );
}