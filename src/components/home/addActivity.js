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
    <Box display="flex" flexDirection="row">
      {/* Left Side Menu */}
      <Box
        bgcolor="primary.main"
        color="white"
        p={2}
        minWidth={250}
        sx={{ overflow: "scroll", maxHeight: "625px" }}
      >
        <div>
          <Accordion>
            <AccordionSummary
              // expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography style={{ fontWeight: "bold" }}>Experince</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to={"/titel"}>
                <Typography className="menuItem">Title</Typography>
              </Link>
              <Link to={"/duration"}>
                <Typography className="menuItem">Duration</Typography>
              </Link>
              <Link to={"/location"}>
                <Typography className="menuItem">Location</Typography>
              </Link>
              <Link to={"/categories"}>
                <Typography className="menuItem">Category & Themes</Typography>
              </Link>
              <Link to={"/description"}>
                <Typography className="menuItem">Description</Typography>
              </Link>
              <Link to={"/inclusions"}>
                <Typography className="menuItem">Inclusions</Typography>
              </Link>
              <Link to={"/exclusions"}>
                <Typography className="menuItem">Exclusions</Typography>
              </Link>
              <Link to={"/photos"}>
                <Typography className="menuItem">Photos</Typography>
              </Link>
              <Link to={"/videos"}>
                <Typography className="menuItem">Videos</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              // expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2a-content"
              id="panel2a-header"
            >
              <Typography style={{ fontWeight: "bold" }}>
                Availability
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to={"/timeDatePass"}>
                <Typography className="menuItem">Time, Date or Pass</Typography>
              </Link>
              <Link to={"/openingHours"}>
                <Typography className="menuItem">OpeningHours</Typography>
              </Link>
              <Link to={"/bookingCutoff"}>
                <Typography className="menuItem">Booking cutoff</Typography>
              </Link>
              {/* <Link to={"/bookingOpeningDate"}>
                <Typography className="menuItem">
                  Booking Opening date
                </Typography>
              </Link> */}
              <Link to={"/capacity"}>
                <Typography className="menuItem">Capacity</Typography>
              </Link>
              <Link to={"/startTime"}>
                <Typography className="menuItem">Start Time</Typography>
              </Link>
              <Link to={"/calendar"}>
                <Typography className="menuItem">End Time</Typography>
              </Link>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              // expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography style={{ fontWeight: "bold" }}>Pricing</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to={"/pricingCategories"}>
                <Typography className="menuItem">Pricing-Categories</Typography>
              </Link>
              {/* <Link to={'/rates'}> */}
              {/*   <Typography className='menuItem'>Rates</Typography> */}
              {/* </Link> */}
              {/* <Link to={'/pricing'}> */}
              {/*   <Typography className='menuItem'>Pricing</Typography> */}
              {/* </Link> */}
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              // expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4a-content"
              id="panel4a-header"
            >
              <Typography style={{ fontWeight: "bold" }}>
                Meeting & Pick up
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Link to={"/meetingPickup"}>
                <Typography className="menuItem">How To Get There ?</Typography>
              </Link>
              <Link to={"/meetingPoint"}>
                <Typography className="menuItem">Meeting Point</Typography>
              </Link>
              {/* <Typography className="menuItem">Drop-off Service</Typography> */}
            </AccordionDetails>
          </Accordion>
        </div>
        {/* Add more menu items as needed */}
      </Box>
    </Box>
  );
};

export default AddActivity;

