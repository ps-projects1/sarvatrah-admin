import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Typography,
  Modal,
  CircularProgress,
  TextField,
  Autocomplete,
  Grid,
  Pagination,
} from "@mui/material";

import ConfirmDialog from "../../components/Common/ConfirmDialog";

import {
  fetchCities,
  addCity,
  updateCity,
  deleteCity,
  setSearchTerm,
  setStateFilter,
  setPage,
  filterCities,
  fetchStates,
} from "../../redux/slices/citySlice";

import CityList from "../../components/City/CityList";
import CityForm from "../../components/City/CityForm";

import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { useDebounce } from "../../hooks/useDebounce";

const City = () => {
  const dispatch = useDispatch();

  const {
    data: cities = [],
    filteredData = [],
    states = [],
    filters = { searchTerm: "", state: "" },
    pagination = { currentPage: 1, rowsPerPage: 10 },
    status = "idle",
  } = useSelector((state) => state.cities || {});  // FIXED HERE

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editingCity, setEditingCity] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  // Initial Load (states + cities)
  useEffect(() => {
    if (status === "idle" && !hasFetched) {
      dispatch(fetchCities())
        .then(() => dispatch(fetchStates()))
        .then(() => setHasFetched(true))
        .catch(() => showErrorToast("Failed to load data"));
    }
  }, [status, dispatch, hasFetched]);

  // Filtering
  useEffect(() => {
    if (cities.length > 0) {
      dispatch(filterCities());
    }
  }, [debouncedSearchTerm, filters.state, dispatch, cities.length]);

  // Pagination calc
  const totalPages = Math.ceil(filteredData.length / pagination.rowsPerPage);
  const paginatedCities = filteredData.slice(
    (pagination.currentPage - 1) * pagination.rowsPerPage,
    pagination.currentPage * pagination.rowsPerPage
  );

  const handlePageChange = (e, value) => {
    dispatch(setPage(value));
  };

  const getStateName = (stateId) => {
    const state = states.find((s) => s._id === stateId);
    return state ? state.name : "Unknown State";
  };

  const handleAddCity = async (newCity) => {
    try {
      const result = await dispatch(addCity(newCity));
      if (result.error) throw new Error(result.error.message);

      showSuccessToast("City added successfully");
      dispatch(fetchCities());
      setOpenAddModal(false);
    } catch (error) {
      showErrorToast("Failed to add city: " + error.message);
    }
  };

  const handleEdit = (city) => {
    setEditingCity(city);
    setOpenEditModal(true);
  };

  const handleUpdateCity = async (updatedCity) => {
    try {
      const result = await dispatch(updateCity(updatedCity));
      if (result.error) throw new Error(result.error.message);

      showSuccessToast("City updated successfully");
      dispatch(fetchCities());
      setOpenEditModal(false);
    } catch (error) {
      showErrorToast("Failed to update city: " + error.message);
    }
  };

  const handleDelete = (cityId) => {
    setCityToDelete(cityId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await dispatch(deleteCity(cityToDelete));
      if (result.error) throw new Error(result.error.message);

      showSuccessToast("City deleted successfully");
      dispatch(fetchCities());
    } catch (error) {
      showErrorToast("Failed to delete city: " + error.message);
    } finally {
      setDeleteConfirmOpen(false);
      setCityToDelete(null);
    }
  };

  const stateOptions = states.map((state) => ({
    id: state._id,
    label: state.name,
  }));

  return (
    <div>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4">City Management</Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenAddModal(true)}>
          Add City
        </Button>
      </Box>

      {/* Filters */}
      <Box mb={3} p={2} bgcolor="background.paper" borderRadius={1}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search Cities"
              variant="outlined"
              value={filters.searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              placeholder="Search by city name"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Autocomplete
              options={stateOptions}
              value={filters.state ? stateOptions.find((s) => s.label === filters.state) : null}
              onChange={(e, value) => dispatch(setStateFilter(value?.label || ""))}
              renderInput={(params) => <TextField {...params} label="Filter by State" />}
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
            {cities.length === 0 ? "No cities found" : "No cities match your filters"}
          </Typography>
        </Box>
      ) : (
        <>
          <CityList cities={paginatedCities} onEdit={handleEdit} onDelete={handleDelete} getStateName={getStateName} />

          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={3}>
              <Pagination count={totalPages} page={pagination.currentPage} onChange={handlePageChange} color="primary" />
            </Box>
          )}
        </>
      )}

      {/* Add Modal */}
      <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
        <Box sx={modalStyle}>
          <CityForm onSubmit={handleAddCity} mode="add" onCancel={() => setOpenAddModal(false)} states={states} />
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          {editingCity && (
            <CityForm
              onSubmit={handleUpdateCity}
              mode="edit"
              cityData={editingCity}
              onCancel={() => setOpenEditModal(false)}
              states={states}
            />
          )}
        </Box>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete City"
        message="Are you sure you want to delete this city? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "80%", md: "600px" },
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 1,
};

export default City;
