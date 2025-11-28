import React from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/addActivity.css";
import Box from "@mui/material/Box";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const AddActivity = () => {
  return (
    <Box 
      bgcolor="primary.main" 
      color="white" 
      height="100vh"
      sx={{ overflow: "auto" }}
    >
      <Box p={2}>
        <div>
          <Accordion>
            <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
              <Typography style={{ fontWeight: "bold" }}>Experince</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to="/activity/titel">
                <Typography className="menuItem">Title</Typography>
              </Link>
              <Link to="/activity/duration">
                <Typography className="menuItem">Duration</Typography>
              </Link>
              <Link to="/activity/location">
                <Typography className="menuItem">Location</Typography>
              </Link>
              <Link to="/activity/categories">
                <Typography className="menuItem">Category & Themes</Typography>
              </Link>
              <Link to="/activity/description">
                <Typography className="menuItem">Description</Typography>
              </Link>
              <Link to="/activity/inclusions">
                <Typography className="menuItem">Inclusions</Typography>
              </Link>
              <Link to="/activity/exclusions">
                <Typography className="menuItem">Exclusions</Typography>
              </Link>
              <Link to="/activity/photos">
                <Typography className="menuItem">Photos</Typography>
              </Link>
              <Link to="/activity/videos">
                <Typography className="menuItem">Videos</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary aria-controls="panel2a-content" id="panel2a-header">
              <Typography style={{ fontWeight: "bold" }}>
                Availability
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to="/activity/timeDatePass">
                <Typography className="menuItem">Time, Date or Pass</Typography>
              </Link>
              <Link to="/activity/openingHours">
                <Typography className="menuItem">OpeningHours</Typography>
              </Link>
              <Link to="/activity/bookingCutoff">
                <Typography className="menuItem">Booking cutoff</Typography>
              </Link>
              <Link to="/activity/capacity">
                <Typography className="menuItem">Capacity</Typography>
              </Link>
              <Link to="/activity/startTime">
                <Typography className="menuItem">Start Time</Typography>
              </Link>
              <Link to="/activity/calendar">
                <Typography className="menuItem">End Time</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
              <Typography style={{ fontWeight: "bold" }}>Pricing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to="/activity/pricingCategories">
                <Typography className="menuItem">Pricing-Categories</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary aria-controls="panel4a-content" id="panel4a-header">
              <Typography style={{ fontWeight: "bold" }}>
                Meeting & Pick up
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to="/activity/meetingPickup">
                <Typography className="menuItem">How To Get There ?</Typography>
              </Link>
              <Link to="/activity/meetingPoint">
                <Typography className="menuItem">Meeting Point</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
        </div>
      </Box>
    </Box>
  );
};

export default AddActivity;