import React, { useState } from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { FormControlLabel, Switch } from "@mui/material";

const ManageDriver = () => {
  const [vehicles, setVehicles] = useState([
    {
      vehicleType: null,
      brandName: "",
      modelName: "",
      inventory: "",
      status: false,
      seatLimit: "",
      luggageCapacity: "",
      images: [],
    },
  ]);

  // -------------------------
  // Update fields
  // -------------------------
  const handleInputChange = (index, key, value) => {
    const updated = [...vehicles];
    updated[index][key] = value;
    setVehicles(updated);
  };

  // -------------------------
  // Add new vehicle block
  // -------------------------
  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        vehicleType: null,
        brandName: "",
        modelName: "",
        inventory: "",
        status: false,
        seatLimit: "",
        luggageCapacity: "",
        images: [],
      },
    ]);
  };

  // -------------------------
  // Remove a vehicle block
  // -------------------------
  const removeVehicle = (index) => {
    if (vehicles.length > 1) {
      const updated = [...vehicles];
      updated.splice(index, 1);
      setVehicles(updated);
    }
  };

  // -------------------------
  // Handle Image Upload Per Vehicle
  // -------------------------
  const handleImageChange = (index, files) => {
    const updated = [...vehicles];
    updated[index].images = Array.from(files); // multiple images
    setVehicles(updated);
  };

  // -------------------------
  // SUBMIT ALL VEHICLES
  // -------------------------
  const handleSubmit = async () => {
    try {
      const promises = vehicles.map(async (vehicle) => {
        const formData = new FormData();

        formData.append(
          "vehicleType",
          vehicle.vehicleType ? vehicle.vehicleType.label : ""
        );
        formData.append("brandName", vehicle.brandName);
        formData.append("modelName", vehicle.modelName);
        formData.append("inventory", vehicle.inventory);
        formData.append("seatLimit", vehicle.seatLimit);
        formData.append("luggageCapacity", vehicle.luggageCapacity);
        formData.append("rate", "0");
        formData.append("active", vehicle.status);
        formData.append("city", ""); // add if needed
        formData.append("vehicleCategory", ""); // add if needed
        formData.append("facilties", JSON.stringify(vehicle.facilties || []));


        // ---- Append all images ----
        vehicle.images.forEach((img) => {
          formData.append("images", img);
        });

        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/inventries/vehicle`,
          {
            method: "POST",
            body: formData,
          }
        );

        return response;
      });

      const results = await Promise.all(promises);

      if (results.every((r) => r.ok)) {
        alert("Vehicles uploaded successfully");
      } else {
        alert("Some vehicles failed to upload");
      }
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">Manage Driver</h1>
        </div>

        {/* VEHICLE FORMS */}
        {vehicles.map((vehicle, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <div className="card-body">
              <div className="row g-3">
                {/* Vehicle Type */}
                <div className="col-sm-4">
                  <label className="form-label">Vehicle Type</label>
                  <Autocomplete
                    id={`vehicleTypeInput-${index}`}
                    sx={{ width: "100%" }}
                    size="small"
                    options={[
                      { label: "Sedan" },
                      { label: "Hatchback" },
                      { label: "MUV" },
                      { label: "SUV 6 Seater" },
                      { label: "SUV 7 Seater" },
                      { label: "Tempo Traveller 12 Seater" },
                      { label: "Tempo Traveller 16 Seater" },
                    ]}
                    value={vehicle.vehicleType}
                    onChange={(e, newValue) =>
                      handleInputChange(index, "vehicleType", newValue)
                    }
                    getOptionLabel={(option) =>
                      option ? option.label : ""
                    }
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Vehicle Type" />
                    )}
                  />
                </div>

                {/* Model Name */}
                <div className="col-sm-4">
                  <label className="form-label">Model Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicle.modelName}
                    onChange={(e) =>
                      handleInputChange(index, "modelName", e.target.value)
                    }
                  />
                </div>

                {/* Driver Name */}
                <div className="col-sm-4">
                  <label className="form-label">Driver Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicle.brandName}
                    onChange={(e) =>
                      handleInputChange(index, "brandName", e.target.value)
                    }
                  />
                </div>

                {/* Image Upload */}
                <div className="col-sm-4">
                  <label className="form-label">Images</label>
                  <input
                    type="file"
                    className="form-control"
                    multiple
                    onChange={(e) =>
                      handleImageChange(index, e.target.files)
                    }
                  />
                </div>

                {/* Status */}
                <div className="col-sm-4">
                  <label className="form-label">Status</label>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={vehicle.status}
                        onChange={(e) =>
                          handleInputChange(index, "status", e.target.checked)
                        }
                      />
                    }
                  />
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <div className="text-center mt-2">
              {vehicles.length > 1 && (
                <button
                  onClick={() => removeVehicle(index)}
                  className="btn btn-danger btn-border"
                >
                  Remove Driver
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add More Vehicles */}
        <div className="text-center my-3">
          <button onClick={addVehicle} className="btn btn-primary btn-border">
            Add Driver
          </button>
        </div>

        {/* Submit */}
        <div className="d-flex justify-content-end border-top p-3">
          <button className="btn btn-primary btn-border" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageDriver;
