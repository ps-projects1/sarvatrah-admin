// Hotel.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useMediaQuery,
  useTheme,
  Button,
  Box,
  TextField,
  Autocomplete,
  Pagination,
  Modal,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  fetchHotels,
  addHotel,
  updateHotel,
  deleteHotel,
  setSearchTerm,
  setStateFilter,
  setCityFilter,
  setPage,
  filterHotels,
} from "../../redux/slices/hotelSlice";
import HotelList from "../../components/Hotel/HotelList";
import HotelForm from "../../components/Hotel/HotelForm";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useDebounce } from "../../hooks/useDebounce";

const Hotel = () => {
  const dispatch = useDispatch();
  const {
    data: hotels = [],
    filteredData = [],
    filters = { searchTerm: "", state: "", city: "" },
    pagination = { currentPage: 1, rowsPerPage: 5, totalPages: 1 },
    status = "idle",
  } = useSelector((state) => state.hotel || {});

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [availableStates, setAvailableStates] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  // Initial Fetch
  useEffect(() => {
    if (status === "idle" && !hasFetched) {
      dispatch(fetchHotels())
        .then(() => setHasFetched(true))
        .catch(() => {
          showErrorToast("Failed to load hotels");
        });
    }
  }, [status, dispatch, hasFetched]);

  // Extract states
  useEffect(() => {
    if (hotels.length > 0) {
      setAvailableStates([...new Set(hotels.map((h) => h.state))]);
    }
  }, [hotels]);

  // Extract cities based on selected state
  useEffect(() => {
    if (filters.state) {
      const cities = hotels
        .filter((h) => h.state === filters.state)
        .map((h) => h.city);
      setAvailableCities([...new Set(cities)]);
    } else {
      setAvailableCities([]);
    }
  }, [filters.state, hotels]);

  // Filtering
  useEffect(() => {
    if (hotels.length > 0) {
      dispatch(filterHotels());
    }
  }, [
    debouncedSearchTerm,
    filters.state,
    filters.city,
    dispatch,
    hotels.length,
  ]);

  // Pagination
  const paginatedHotels = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  const handlePageChange = (e, value) => {
    dispatch(setPage(value));
  };

  const handleEdit = (hotel) => {
    setEditingHotel(hotel);
    setOpenEditModal(true);
  };

  const handleDelete = async (hotelId) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await dispatch(deleteHotel(hotelId));
        showSuccessToast("Hotel deleted successfully");
      } catch {
        showErrorToast("Failed to delete hotel");
      }
    }
  };

  const handleAddHotel = async (newHotel) => {
    try {
      console.log(newHotel);
      dispatch(addHotel(newHotel))
        .then((data) => {
          if (data.error) {
            throw new Error(data.error.message);
          }
          showSuccessToast("Hotel added successfully");
          dispatch(fetchHotels()); // Refresh hotel list after adding
          setOpenAddModal(false);
        })
        .catch((error) => {
          showErrorToast("Failed to add hotel: " + error.message);
        });
    } catch {
      showErrorToast("Failed to add hotel");
    }
  };

  const handleUpdateHotel = async (formData) => {
    try {
      dispatch(updateHotel(formData));
      showSuccessToast("Hotel updated successfully");
      setOpenEditModal(false);
      dispatch(fetchHotels()); // Refresh the hotel list
    } catch (error) {
      showErrorToast(error.message || "Failed to update hotel");
    }
  };

  const [updatingHotelId, setUpdatingHotelId] = useState(null);

  const handleStatusToggle = async (hotelId, newStatus) => {
    try {
      if (!newStatus) {
        const confirm = window.confirm(
          "Are you sure you want to deactivate this hotel? " +
            "This may affect bookings and visibility."
        );
        if (!confirm) return;
      }

      setUpdatingHotelId(hotelId);

      // Rest of the update logic...
      const updateData = {
        _id: hotelId,
        active: newStatus,
      };

      dispatch(updateHotel(updateData));
      showSuccessToast(
        `Hotel ${newStatus ? "activated" : "deactivated"} successfully`
      );
      dispatch(fetchHotels());
      setSelectedHotel({ ...selectedHotel, active: newStatus });
    } catch (error) {
      showErrorToast("Failed to update hotel status");
      console.error("Status update error:", error);
    } finally {
      setUpdatingHotelId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Hotel Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddModal(true)}
        >
          Add Hotel
        </Button>
      </Box>

      {/* Search Filters */}
      <Box mb={3} p={2} bgcolor="background.paper" borderRadius={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Hotels"
              variant="outlined"
              value={filters.searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={availableStates}
              value={filters.state}
              onChange={(e, value) => dispatch(setStateFilter(value))}
              renderInput={(params) => (
                <TextField {...params} label="Filter by State" />
              )}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Autocomplete
              options={availableCities}
              value={filters.city}
              onChange={(e, value) => dispatch(setCityFilter(value))}
              disabled={!filters.state}
              renderInput={(params) => (
                <TextField {...params} label="Filter by City" />
              )}
            />
          </Grid>
        </Grid>
      </Box>

      {/* List */}
      {status === "loading" ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredData.length === 0 ? (
        <Box textAlign="center" my={4}>
          <Typography variant="h6">
            {hotels.length === 0
              ? "No hotels found"
              : "No hotels match your filters"}
          </Typography>
        </Box>
      ) : (
        <>
          <HotelList
            hotels={paginatedHotels}
            loading={status === "loading"}
            selectedHotel={selectedHotel}
            setSelectedHotel={setSelectedHotel}
            handleDelete={handleDelete}
            handleEdit={handleEdit}
            isMobile={isMobile}
            theme={theme}
            openViewModal={openViewModal}
            setOpenViewModal={setOpenViewModal}
            handleStatusToggle={handleStatusToggle}
            updatingHotelId={updatingHotelId}
          />
          {filteredData.length > pagination.rowsPerPage && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Add Hotel Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle(isMobile)}>
          <HotelForm onSubmit={handleAddHotel} mode="add" />
        </Box>
      </Modal>

      {/* Edit Hotel Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle(isMobile)}>
          {editingHotel && (
            <HotelForm
              onSubmit={handleUpdateHotel}
              mode="edit"
              hotelData={editingHotel}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = (isMobile) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: isMobile ? "95%" : "80%",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
});

export default Hotel;
