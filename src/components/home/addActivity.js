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
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const AddActivity = () => {
  const location = useLocation();

  const sections = [
    {
      id: "panel1",
      title: "Experience",
      icon: <LocalActivityIcon sx={{ mr: 1, fontSize: 20 }} />,
      items: [
        { path: "/activity/titel", label: "Title" },
        { path: "/activity/duration", label: "Duration" },
        { path: "/activity/location", label: "Location" },
        { path: "/activity/categories", label: "Category & Themes" },
        { path: "/activity/description", label: "Description" },
        { path: "/activity/inclusions", label: "Inclusions" },
        { path: "/activity/exclusions", label: "Exclusions" },
        { path: "/activity/photos", label: "Photos" },
        { path: "/activity/videos", label: "Videos" },
      ],
    },
    {
      id: "panel2",
      title: "Availability",
      icon: <EventAvailableIcon sx={{ mr: 1, fontSize: 20 }} />,
      items: [
        { path: "/activity/timeDatePass", label: "Time, Date or Pass" },
        { path: "/activity/openingHours", label: "Opening Hours" },
        { path: "/activity/bookingCutoff", label: "Booking Cutoff" },
        { path: "/activity/capacity", label: "Capacity" },
        { path: "/activity/startTime", label: "Start Time" },
        { path: "/activity/calendar", label: "End Time" },
      ],
    },
    {
      id: "panel3",
      title: "Pricing",
      icon: <AttachMoneyIcon sx={{ mr: 1, fontSize: 20 }} />,
      items: [
        { path: "/activity/pricingCategories", label: "Pricing Categories" },
      ],
    },
    {
      id: "panel4",
      title: "Meeting & Pick up",
      icon: <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />,
      items: [
        { path: "/activity/meetingPickup", label: "How To Get There?" },
        { path: "/activity/meetingPoint", label: "Meeting Point" },
      ],
    },
  ];

  return (
    <Box
      bgcolor="primary.main"
      color="white"
      height="100vh"
      sx={{
        overflow: "auto",
        boxShadow: 3,
      }}
    >
      <Box px={2} py={3}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            px: 1,
            letterSpacing: 0.5,
          }}
        >
          Activity Setup
        </Typography>
        <Divider sx={{ bgcolor: "rgba(255, 255, 255, 0.2)", mb: 2 }} />

        <Box>
          {sections.map((section) => (
            <Accordion
              key={section.id}
              className="activity-accordion"
              sx={{
                bgcolor: "transparent",
                color: "white",
                boxShadow: "none",
                mb: 1,
                "&:before": { display: "none" },
                "&.Mui-expanded": {
                  margin: "0 0 8px 0",
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                aria-controls={`${section.id}-content`}
                id={`${section.id}-header`}
                sx={{
                  minHeight: 48,
                  px: 2,
                  borderRadius: 1,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                  },
                  "&.Mui-expanded": {
                    minHeight: 48,
                    bgcolor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <Box display="flex" alignItems="center">
                  {section.icon}
                  <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {section.title}
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0, pt: 0.5 }}>
                {section.items.map((item, index) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    style={{ textDecoration: "none" }}
                  >
                    <Typography
                      className={`menuItem ${
                        location.pathname === item.path ? "active" : ""
                      }`}
                      sx={{
                        py: 1.25,
                        px: 3,
                        fontSize: "0.875rem",
                        color: location.pathname === item.path
                          ? "white"
                          : "rgba(255, 255, 255, 0.85)",
                        bgcolor: location.pathname === item.path
                          ? "rgba(255, 255, 255, 0.15)"
                          : "transparent",
                        borderLeft: location.pathname === item.path
                          ? "3px solid white"
                          : "3px solid transparent",
                        transition: "all 0.2s ease-in-out",
                        cursor: "pointer",
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          color: "white",
                          paddingLeft: "28px",
                        },
                        borderBottom: index < section.items.length - 1
                          ? "1px solid rgba(255, 255, 255, 0.1)"
                          : "none",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Link>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default AddActivity;