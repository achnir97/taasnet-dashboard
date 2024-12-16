import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import profileImage from "../assets/Profile_jhon.png";
import portfolioImage from "../assets/portfolio.png";
import clientImage2 from "../assets/client.png";

export const ProfileManagement: React.FC = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 1200,
        margin: "30px auto",
        borderRadius: "16px",
        backgroundColor: "#F9FAFB",
      }}
    >
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Profile Rating */}
          <Box display="flex" alignItems="center" mb={2}>
            <StarIcon sx={{ color: "#FFB400", mr: 1 }} />
            <Typography variant="h6" fontWeight="600">
              Rating: 4.8/5.0
            </Typography>
          </Box>

          {/* Profile Info */}
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              src={profileImage}
              alt="Profile"
              sx={{
                width: 120,
                height: 120,
                border: "4px solid #FFB400",
                mr: 3,
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold" color="primary">
                John Doe
              </Typography>
              <Typography color="text.secondary" display="flex" alignItems="center">
                <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                New York, USA
              </Typography>
              <Typography>Skills: Web Development, Graphic Design</Typography>
              <Typography>Orders Completed: 250+</Typography>
            </Box>
          </Box>

          {/* About Section */}
          <Typography variant="h6" fontWeight="600" gutterBottom>
            About
          </Typography>
          <Typography paragraph color="text.secondary">
            I am a dedicated software engineer with expertise in full-stack development...
          </Typography>

          {/* Specific Skills */}
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Specific Skill Sets
          </Typography>
          <Typography color="text.secondary" mb={2}>
            React, Node.js, Figma, AWS, Docker
          </Typography>

          {/* Portfolio Section */}
          <Typography variant="h6" fontWeight="600" gutterBottom>
            My Portfolio
          </Typography>
          <Box display="flex" gap={2} mb={3}>
            <img
              src={portfolioImage}
              alt="Portfolio"
              style={{
                width: "100px",
                height: "80px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <img
              src={portfolioImage}
              alt="Portfolio"
              style={{
                width: "100px",
                height: "80px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            />
            <img
              src={portfolioImage}
              alt="Portfolio"
              style={{
                width: "100px",
                height: "80px",
                borderRadius: "8px",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
              }}
            />
          </Box>

          {/* Reviews Section */}
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Reviews & Ratings
          </Typography>
          <Typography color="primary" mb={2}>
            4.8/5.0 based on 200+ reviews
          </Typography>

          {/* Review Cards */}
          <Card
            variant="outlined"
            sx={{
              display: "flex",
              alignItems: "flex-start",
              p: 2,
              mb: 2,
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            <Avatar src={clientImage2} alt="Client" sx={{ mr: 2, width: 50, height: 50 }} />
            <Box>
              <Typography fontWeight="600">Michael B.</Typography>
              <Typography color="primary">Rating: 4.7</Typography>
              <Typography color="text.secondary">
                John is a highly talented developer who communicates well and delivers on time.
                Would highly recommend!
              </Typography>
            </Box>
          </Card>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <Card
            elevation={2}
            sx={{
              p: 3,
              borderRadius: "12px",
              backgroundColor: "#FFF",
              boxShadow: "0 6px 10px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h5" fontWeight="600" mb={3} color="primary">
              Service Pricing
            </Typography>

            <PricingOption title="Basic" price="$50" description="Basic support and services." />
            <PricingOption
              title="Standard"
              price="$100"
              description="All features in Basic plus more options."
            />
            <PricingOption
              title="Premium"
              price="$150"
              description="All features in Standard plus premium support."
            />
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Pricing Option Component
const PricingOption: React.FC<{ title: string; price: string; description: string }> = ({
  title,
  price,
  description,
}) => (
  <Box
    sx={{
      p: 2,
      mb: 2,
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
      "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
    }}
  >
    <Typography variant="h6" fontWeight="600">
      {title}
    </Typography>
    <Typography color="primary" fontWeight="600">
      {price}
    </Typography>
    <Typography color="text.secondary">{description}</Typography>
  </Box>
);
