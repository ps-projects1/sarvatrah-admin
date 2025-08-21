import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import AddHolidayPackage from "./addHolidayPackage";
import { useLocation } from "react-router-dom";

const PackageListing = () => {
  const [packages, setPackages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editPackage, setEditPackage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  useEffect(() => {
    if (!showForm) fetchPackages();
  }, [showForm]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    setFiltered(
      packages.filter((pkg) => {
        const values = [
          pkg.packageName,
          pkg.uniqueId,
          pkg.packageType,
          pkg.selectType,
          pkg.startCity,
          ...(pkg.destinationCity || []),
        ];
        return values.some((val) => val?.toLowerCase().includes(term));
      })
    );
  }, [searchTerm, packages]);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:3232/holiday/get-holiday-package"
      );
      if (res.data.status) {
        setPackages(res.data.data.holidayPackages);
        setPagination(res.data.data.pagination); // Store pagination info
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditPackage(null);
    setShowForm(true);
  };

  const handleEdit = (pkg) => {
    setEditPackage(pkg);
    setShowForm(true);
  };

  const location = useLocation();

  useEffect(() => {
    // Reset form visibility when route changes
    setShowForm(false);
    setEditPackage(null);
  }, [location.pathname]);

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">
          {showForm
            ? editPackage
              ? "Edit Package"
              : "Add New Package"
            : "Holiday Packages"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (showForm) {
              setShowForm(false); // go back to listing
              setEditPackage(null); // clear edit data
            } else {
              handleAdd(); // go to add form
            }
          }}
        >
          {showForm ? "Back to Package Listing" : "Add Package"}
        </Button>
      </Box>

      {showForm ? (
        <AddHolidayPackage
          editPackageData={editPackage}
          onBack={() => setShowForm(false)}
        />
      ) : loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <>
          <Box mb={2}>
            <TextField
              label="Search packages..."
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package Name</TableCell>
                  <TableCell>Unique ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Start City</TableCell>
                  <TableCell>End City</TableCell>
                  <TableCell>Days/Nights</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((pkg) => (
                  <TableRow key={pkg._id}>
                    <TableCell>{pkg.packageName}</TableCell>
                    <TableCell>{pkg.uniqueId}</TableCell>
                    <TableCell>{pkg.packageType}</TableCell>
                    <TableCell>{pkg.startCity}</TableCell>
                    <TableCell>
                      {pkg.destinationCity?.slice(-1)[0] || "-"}
                    </TableCell>
                    <TableCell>
                      {pkg.packageDuration?.days}D /{" "}
                      {pkg.packageDuration?.nights}N
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(pkg)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No matching packages found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box
              mt={2}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Button
                disabled={pagination.currentPage === 1}
                onClick={() => fetchPackages(pagination.currentPage - 1)}
              >
                Previous
              </Button>
              <Typography mx={2}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </Typography>
              <Button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={() => fetchPackages(pagination.currentPage + 1)}
              >
                Next
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PackageListing;
