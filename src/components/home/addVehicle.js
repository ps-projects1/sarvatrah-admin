import React, { useState, useEffect } from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import {
  FormControlLabel,
  Switch,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from "../Common/ConfirmDialog";

const VEHICLE_TYPES = [
  { label: "Sedan" },
  { label: "Hatchback" },
  { label: "MUV" },
  { label: "SUV 6 Seater" },
  { label: "SUV 7 Seater" },
  { label: "Tempo Traveller 12 Seater" },
  { label: "Tempo Traveller 16 Seater" },
];

const initialVehicleState = {
  vehicleType: null,
  brandName: "",
  modelName: "",
  inventory: 0,
  status: false,
  seatLimit: 0,
  luggageCapacity: 0,
};

const AddVehicle = () => {
  const [vehicles, setVehicles] = useState([{ ...initialVehicleState }]);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isViewing, setIsViewing] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  useEffect(() => {
    fetchAvailableVehicles();
  }, []);

  const fetchAvailableVehicles = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vehicle/get-vehicles`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${user?.token}`,
          },
        }
      );
      const data = await response.json();
      if (data.status) {
        // Sort vehicles by creation date (newest first)
        const sortedVehicles = [...data.data].sort((a, b) => {
          const dateA = new Date(a.createdAt || 0);
          const dateB = new Date(b.createdAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        setAvailableVehicles(sortedVehicles);
      } else {
        toast.error("Failed to fetch vehicles");
      }
    } catch (error) {
      toast.error("Failed to fetch vehicles");
    }
  };

  const handleInputChange = (index, key, value) => {
    setVehicles((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  

  const removeVehicle = (index) => {
    if (vehicles.length <= 1) return;
    setVehicles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const vehicleData = vehicles[0];
      const payload = {
        vehicleType: vehicleData.vehicleType?.label || vehicleData.vehicleType,
        brandName: vehicleData.brandName,
        modelName: vehicleData.modelName,
        inventory: Number(vehicleData.inventory),
        active: Boolean(vehicleData.status),
        seatLimit: Number(vehicleData.seatLimit),
        luggageCapacity: Number(vehicleData.luggageCapacity),
      };

      const url = editingId
        ? `${process.env.REACT_APP_API_BASE_URL}/vehicle/update-vehicle/${editingId}`
  : `${process.env.REACT_APP_API_BASE_URL}/vehicle/add-vehicle`;

      const method = editingId ? "PUT" : "POST";

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && (data.status || data.success)) {
        toast.success(editingId ? "Vehicle updated!" : "Vehicle added!");
        setVehicles([{ ...initialVehicleState }]);
        setEditingId(null);
        fetchAvailableVehicles();
        setVehicleAddPop(false);
      } else {
        toast.error(data.message || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEdit = (vehicle) => {
    setVehicleAddPop(true);
    setEditingId(vehicle._id);

    setVehicles([
      {
        vehicleType: vehicle.vehicleType,
        brandName: vehicle.brandName,
        modelName: vehicle.modelName,
        inventory: vehicle.inventory,
        status: vehicle.active,
        seatLimit: vehicle.seatLimit,
        luggageCapacity: vehicle.luggageCapacity,
      },
    ]);
  };

  const handleDelete = (id) => {
    setVehicleToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vehicle/delete-vehicle/${vehicleToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${user?.token}`,
          },
        }
      );
      const data = await response.json();

      if (data.success) {
        toast.success("Vehicle deleted!");
        fetchAvailableVehicles();
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setVehicleToDelete(null);
    }
  };

  const handleView = (vehicle) => {
    setViewingVehicle(vehicle);
    setIsViewing(true);
  };

  const cancelEdit = () => {
    setVehicleAddPop(false);
    setEditingId(null);
    setVehicles([{ ...initialVehicleState }]);
  };
  const [VehicleAddPop, setVehicleAddPop] = useState(false);

  const [updatingVehicleId, setUpdatingVehicleId] = useState(null);

  const handleStatusToggle = async (vehicleId, newStatus) => {
    try {
      if (!newStatus) {
        const confirmed = window.confirm(
          "Are you sure you want to deactivate this vehicle? This may affect bookings and visibility."
        );
        if (!confirmed) return;
      }

      setUpdatingVehicleId(vehicleId);

      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/vehicle/update-vehicle/${vehicleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            active: newStatus,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update vehicle");


      toast.success(
        `Vehicle ${newStatus ? "activated" : "deactivated"} successfully`
      );

      fetchAvailableVehicles();
    } catch (error) {
      toast.error("Failed to update vehicle status");
    } finally {
      setUpdatingVehicleId(null);
    }
  };

  return (
    <div className="col-lg-12">
      <div className={`vehicle-add-pop ${VehicleAddPop && "open"}`}>
        <div className="card" style={{ margin: "15px", padding: "15px" }}>
          <div className="card-header align-items-center d-flex">
            <h1 className="card-title flex-grow-1">
              {editingId ? "Edit Vehicle" : "Add Vehicle"}
            </h1>
            {editingId && (
              <button onClick={cancelEdit} className="btn btn-danger btn-sm">
                Cancel Edit
              </button>
            )}
          </div>

          <div>
            {vehicles.map((vehicle, index) => (
              <VehicleForm
                key={index}
                index={index}
                vehicle={vehicle}
                onChange={handleInputChange}
                onRemove={removeVehicle}
                showRemove={vehicles.length > 1}
              />
            ))}

            {/* <div className="text-center my-3">
            <button onClick={addVehicle} className="btn btn-primary btn-border">
              Add Vehicle
            </button>
          </div> */}
          </div>

          <div className="d-flex justify-content-end p-3 border-top">
            <button
              className="btn btn-primary btn-border"
              onClick={handleSubmit}
            >
              {editingId ? "Update Vehicle" : "Submit"}
            </button>
          </div>
        </div>
      </div>

      <div
        onClick={() => setVehicleAddPop(false)}
        className={`backdrop ${!VehicleAddPop && "d-none"}`}
      ></div>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h4">Vehicle Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setVehicleAddPop(true)}
        >
          Add Vehicle
        </Button>
      </Box>

      {/* Available Vehicles List */}
      <div className="card">
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Available Vehicles</h1>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>Vehicle Type</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Inventory</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {availableVehicles.map((vehicle) => (
                  <tr key={vehicle._id}>
                    <td>{vehicle.vehicleType}</td>
                    <td>{vehicle.brandName}</td>
                    <td>{vehicle.modelName}</td>
                    <td>{vehicle.inventory}</td>
                    <td className="d-flex align-items-center gap-2">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={vehicle.active}
                            onChange={(e) =>
                              handleStatusToggle(vehicle._id, e.target.checked)
                            }
                            disabled={updatingVehicleId === vehicle._id}
                            color="primary"
                          />
                        }
                        label={vehicle.active ? "Active" : "Inactive"}
                      />
                      {updatingVehicleId === vehicle._id && (
                        <div
                          className="spinner-border spinner-border-sm text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      )}
                    </td>

                    <td>
                      <IconButton onClick={() => handleView(vehicle)}>
                        <Visibility color="primary" />
                      </IconButton>
                      <IconButton onClick={() => handleEdit(vehicle)}>
                        <Edit color="warning" />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(vehicle._id)}>
                        <Delete color="error" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {isViewing && viewingVehicle && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            marginTop: 60,
          }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Vehicle Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsViewing(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p>
                      <strong>Type:</strong> {viewingVehicle.vehicleType}
                    </p>
                    <p>
                      <strong>Brand:</strong> {viewingVehicle.brandName}
                    </p>
                    <p>
                      <strong>Model:</strong> {viewingVehicle.modelName}
                    </p>
                    <p>
                      <strong>Inventory:</strong> {viewingVehicle.inventory}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p>
                      <strong>Status:</strong>{" "}
                      {viewingVehicle.active ? "Active" : "Inactive"}
                    </p>
                    <p>
                      <strong>Seats:</strong> {viewingVehicle.seatLimit}
                    </p>
                    <p>
                      <strong>Luggage:</strong> {viewingVehicle.luggageCapacity}
                    </p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsViewing(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Vehicle"
        message="Are you sure you want to delete this vehicle? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

const VehicleForm = ({ index, vehicle, onChange, onRemove, showRemove }) => (
  <div className="mb-4">
    <div className="card-body">
      <div className="live-preview">
        <div className="row g-3">
          {/* Vehicle Type (using a select as a Bootstrap alternative to Autocomplete) */}
          <div className="col-sm-4">
            <label className="form-label">Vehicle Type</label>
            <select
              className="form-select"
              value={vehicle.vehicleType}
              onChange={(e) => onChange(index, "vehicleType", e.target.value)}
            >
              <option value="">Select Vehicle Type</option>
              {VEHICLE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Name */}
          <div className="col-sm-4">
            <label className="form-label">Brand Name</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.brandName}
              onChange={(e) => onChange(index, "brandName", e.target.value)}
            />
          </div>

          {/* Model Name */}
          <div className="col-sm-4">
            <label className="form-label">Model Name</label>
            <input
              type="text"
              className="form-control"
              value={vehicle.modelName}
              onChange={(e) => onChange(index, "modelName", e.target.value)}
            />
          </div>

          {/* Inventory */}
          <div className="col-sm-4">
            <label className="form-label">Inventory</label>
            <input
              type="number"
              className="form-control"
              value={vehicle.inventory}
              onChange={(e) => onChange(index, "inventory", e.target.value)}
            />
          </div>

          {/* Passenger Capacity */}
          <div className="col-sm-4">
            <label className="form-label">Passenger Capacity</label>
            <input
              type="number"
              className="form-control"
              value={vehicle.seatLimit}
              onChange={(e) => onChange(index, "seatLimit", e.target.value)}
            />
          </div>

          {/* Luggage Capacity */}
          <div className="col-sm-4">
            <label className="form-label">Luggage Capacity</label>
            <input
              type="number"
              className="form-control"
              value={vehicle.luggageCapacity}
              onChange={(e) =>
                onChange(index, "luggageCapacity", e.target.value)
              }
            />
          </div>

          {/* Status Switch */}
          <div className="col-sm-4 d-flex align-items-end">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id={`vehicleStatus-${index}`}
                checked={vehicle.status}
                onChange={(e) => onChange(index, "status", e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor={`vehicleStatus-${index}`}
              >
                Active
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    {showRemove && (
      <div className="text-center">
        <button
          onClick={() => onRemove(index)}
          className="btn btn-danger btn-border"
        >
          Remove
        </button>
      </div>
    )}
  </div>
);



export default AddVehicle;
