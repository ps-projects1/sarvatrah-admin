import { useEffect, useState } from "react";
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

  const location = useLocation();

  const fetchPackages = async (page = 1) => {
    try {
      setLoading(true);

      const limit = pagination.itemsPerPage || 10;
      const res = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/holiday/get-holiday-package?page=${page}&limit=${limit}&sort=-createdAt`
      );

      if (res.data && res.data.status && res.data.data) {
        const { holidayPackages, pagination: pag } = res.data.data;

        setPackages(Array.isArray(holidayPackages) ? holidayPackages : []);
        setFiltered(Array.isArray(holidayPackages) ? holidayPackages : []);

        setPagination((prev) => ({
          ...prev,
          currentPage: pag?.currentPage ?? page,
          totalPages: pag?.totalPages ?? prev.totalPages,
          totalItems: pag?.totalItems ?? prev.totalItems,
          itemsPerPage: pag?.itemsPerPage ?? prev.itemsPerPage,
        }));
      } else {
        setPackages([]);
        setFiltered([]);
        setPagination((prev) => ({ ...prev, totalPages: 1, totalItems: 0 }));
      }
    } catch (error) {
      setPackages([]);
      setFiltered([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showForm) {
      fetchPackages(1);
    }
  }, [showForm]);

  useEffect(() => {
    setShowForm(false);
    setEditPackage(null);
  }, [location.pathname]);

  // Client-side search on the currently fetched page
  useEffect(() => {
    const term = (searchTerm || "").toLowerCase().trim();
    if (!term) {
      setFiltered(packages);
      return;
    }

    setFiltered(
      packages.filter((pkg) => {
        if (!pkg) return false;
        const values = [
          pkg.packageName,
          pkg.uniqueId,
          pkg.packageType,
          pkg.selectType,
          pkg.startCity,
          ...(Array.isArray(pkg.destinationCity) ? pkg.destinationCity : []),
        ].filter(Boolean);

        return values.some((val) =>
          val?.toString().toLowerCase().includes(term)
        );
      })
    );
  }, [searchTerm, packages]);

  const handleAdd = () => {
    setEditPackage(null);
    setShowForm(true);
  };

  const handleEdit = (pkg) => {
    setEditPackage(pkg);
    setShowForm(true);
  };

  const handlePrev = () => {
    if (pagination.currentPage > 1) {
      fetchPackages(pagination.currentPage - 1);
    }
  };

  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      fetchPackages(pagination.currentPage + 1);
    }
  };

  return (
    <Box>
      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h5">
          {showForm ? (editPackage ? "Edit Package" : "Add New Package") : "Holiday Packages"}
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              setEditPackage(null);
            } else {
              handleAdd();
            }
          }}
        >
          {showForm ? "Back to Package Listing" : "Add Package"}
        </Button>
      </Box>

      {showForm ? (
        <AddHolidayPackage
          editPackageData={editPackage}
          onBack={() => {
            setShowForm(false);
            // after add/edit, refresh current page
            fetchPackages(pagination.currentPage || 1);
          }}
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
                      {Array.isArray(pkg.destinationCity) && pkg.destinationCity.length
                        ? pkg.destinationCity.slice(-1)[0]
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {pkg.packageDuration?.days ?? "-"}D / {pkg.packageDuration?.nights ?? "-"}N
                    </TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="outlined" onClick={() => handleEdit(pkg)}>
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
            <Box mt={2} display="flex" justifyContent="center" alignItems="center">
              <Button disabled={pagination.currentPage === 1} onClick={handlePrev}>
                Previous
              </Button>

              <Typography mx={2}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </Typography>

              <Button
                disabled={pagination.currentPage === pagination.totalPages}
                onClick={handleNext}
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
