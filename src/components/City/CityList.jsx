import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CityList = ({ cities, onEdit, onDelete, getStateName }) => {
  if (!cities || cities.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No cities found
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Sr. No</strong></TableCell>
            <TableCell><strong>City Name</strong></TableCell>
            <TableCell><strong>State</strong></TableCell>
{/*             <TableCell><strong>Status</strong></TableCell> */}
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cities.map((city, index) => (
            <TableRow key={city._id || index} hover>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{city.name}</TableCell>
              <TableCell>{getStateName(city.state)}</TableCell>
             {/*  <TableCell>
                <Chip
                  label={city.active ? "Active" : "Inactive"}
                  color={city.active ? "success" : "default"}
                  size="small"
                />
              </TableCell> */}
              <TableCell align="center">
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => onEdit(city)}
                  title="Edit"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onDelete(city._id)}
                  title="Delete"
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CityList;