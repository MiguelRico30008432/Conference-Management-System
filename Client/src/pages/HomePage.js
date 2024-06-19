import React from "react";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "OurComponents/footer/Footer";
import imageroom from "../assets/images/imageroom.jpg";
import imageroom1 from "../assets/images/imageroom1.jpg";
import imageroom2 from "../assets/images/imageroom2.jpg";
import MDBox from "components/MDBox";
import { Typography, Box, Container, Grid, Avatar } from "@mui/material";
import { styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageBox = styled(Box)(({ theme }) => ({
  position: "relative",
  height: "400px",
  backgroundSize: "cover",
  backgroundPosition: "center",
  borderRadius: "8px",
  margin: theme.spacing(2, 0),
  transition: "all 0.3s ease",
  "&:hover": {
    filter: "brightness(0.7)",
  },
}));

const HomePage = () => {
  const images = [
    {
      src: imageroom,
      text: "Conference Management",
      sectionId: "conference-management",
    },
    { src: imageroom2, text: "Submit Papers", sectionId: "submit-papers" },
    { src: imageroom1, text: "Review Process", sectionId: "review-process" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <DashboardLayout>
      <MDBox sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", my: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom>
              Conference Management
            </Typography>
            <Typography variant="h5" color="textSecondary">
              Simplify your conference management with our integrated system.
            </Typography>
          </Box>
          <Box sx={{ my: 4 }}>
            <Slider {...settings}>
              {images.map((image, index) => (
                <ImageBox
                  key={index}
                  sx={{ backgroundImage: `url(${image.src})` }}
                />
              ))}
            </Slider>
          </Box>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              Key Features
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <ImageBox sx={{ backgroundImage: `url(${imageroom})` }} />
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6">Conference Management</Typography>
                  <Typography color="textSecondary">
                    Organize and manage all aspects of your conference with
                    ease.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageBox sx={{ backgroundImage: `url(${imageroom2})` }} />
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6">Submit Papers</Typography>
                  <Typography color="textSecondary">
                    Facilitate paper submission and keep everything organized in
                    one place.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <ImageBox sx={{ backgroundImage: `url(${imageroom1})` }} />
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Typography variant="h6">Review Process</Typography>
                  <Typography color="textSecondary">
                    Manage the article review process efficiently and
                    collaboratively.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              Bidding Process
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <ImageBox sx={{ backgroundImage: `url(${imageroom})` }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="textSecondary" paragraph>
                  The bidding process allows the assignment of reviewers to
                  submissions either manually or automatically. This method
                  ensures that articles are evaluated by the most qualified
                  reviewers, promoting fair and thorough analysis.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Our platform is dynamic and flexible, adapting to the specific
                  needs of your conference. Whether through the manual process,
                  where reviewers select the papers they wish to review, or the
                  automatic process, where papers are assigned based on advanced
                  algorithms, management becomes efficient and precise.
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              Dynamism and Flexibility
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <ImageBox sx={{ backgroundImage: `url(${imageroom1})` }} />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" color="textSecondary" paragraph>
                  The platform offers a dynamic environment, facilitating
                  interaction between organizers, authors, and reviewers. With
                  an intuitive interface and powerful tools, you can manage all
                  aspects of the conference efficiently.
                </Typography>
                <Typography variant="body1" color="textSecondary" paragraph>
                  Our features include everything from submission and review of
                  articles to scheduling and communication with participants,
                  all in one place. Experience the flexibility and convenience
                  our platform provides.
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" gutterBottom>
              Testimonials
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, margin: "0 auto" }}>
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h6">John Doe</Typography>
                  <Typography color="textSecondary">
                    "The platform transformed how we organize our conference.
                    Everything became simpler and more organized."
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, margin: "0 auto" }}>
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h6">Jane Smith</Typography>
                  <Typography color="textSecondary">
                    "The submission and review process has never been easier.
                    The reviewers loved the intuitive interface."
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: "center", p: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, margin: "0 auto" }}>
                    <PersonIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h6">Carlos Santos</Typography>
                  <Typography color="textSecondary">
                    "Automatic reviewer assignment saved a lot of time and
                    improved the quality of the reviews."
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default HomePage;
