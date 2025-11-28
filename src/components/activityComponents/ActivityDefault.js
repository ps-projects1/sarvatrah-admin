import React from "react";
import { Typography, Box } from "@mui/material";

const ActivityDefault = () => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="400px">
      <Typography variant="h5" color="textSecondary">
        Select an activity option from the sidebar to get started
      </Typography>
    </Box>
  );
};

export default ActivityDefault;