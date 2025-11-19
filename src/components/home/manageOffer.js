import React from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";

const ManageOffer = () => {
  const [vehicles, setVehicles] = useState([
    {
      vehicleType: null,
      brandName: "",
      modelName: "",
      inventory: "",
      status: "",
      seatLimit: "",
      luggageCapacity: "",
      images: null,
    },
  ]);

  const handleInputChange = (index, key, value) => {
    const updatedVehicles = [...vehicles];
    // Convert 'true'/'false' strings to boolean
    const processedValue =
      value === "true" ? true : value === "false" ? false : value;
    updatedVehicles[index][key] = processedValue;
    setVehicles(updatedVehicles);
  };

  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      {
        vehicleType: null,
        brandName: "",
        modelName: "",
        inventory: "",
        status: "",
        seatLimit: "",
        luggageCapacity: "",
      },
    ]);
  };

  const removeVehicle = (index) => {
    if (vehicles.length > 1) {
      const updatedVehicles = [...vehicles];
      updatedVehicles.splice(index, 1);
      setVehicles(updatedVehicles);
    }
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const imagesArray = Array.from(files); // Convert FileList to an array

    setVehicles((prevData) => ({
      ...prevData,
      images: imagesArray,
    }));
  };

  const handleSubmit = async () => {
    try {
      const promises = vehicles.map(async (vehicle, index) => {
        // const formData = new FormData();

        const processedVehicleType = vehicle.vehicleType
          ? vehicle.vehicleType.label || vehicle.vehicleType
          : null;

        const queryString = Object.entries({
          ...vehicle,
          vehicleType: processedVehicleType,
          status: vehicle.status ? "true" : "false", // Convert boolean to 'true'/'false' string
        })
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          )
          .join("&");

        const url = `${process.env.REACT_APP_API_BASE_URL}/inventries/vehicle?${queryString}`;

        const response = await fetch(url, {
          method: "POST",
        });

        return response;
      });

      const responses = await Promise.all(promises);

      const allResponsesSuccessful = responses.every((response) => response.ok);

      if (allResponsesSuccessful) {
        console.log("Vehicles added successfully");
      } else {
        console.error("Failed to add some vehicles");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title  flex-grow-1 ">Manage Offer</h1>
        </div>
        <div>
          {vehicles.map((vehicle, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
              <div className="card-body">
                <div className="live-preview">
                  <div className="row g-3">
                    <div className="col-sm-4">
                      <label
                        htmlFor={`vehicleTypeInput-${index}`}
                        className="form-label"
                      >
                        Offer Type
                      </label>
                      <Autocomplete
                        id={`vehicleTypeInput-${index}`}
                        sx={{ width: "100%" }}
                        size="small"
                        options={[
                          { label: "Indian Package" },
                          { label: "International Package" },
                          { label: "HImachal" },
                          // { label: 'SUV 6 Seater' },
                          // { label: 'SUV 7 Seater' },
                          // { label: 'Tempo Traveller 12 Seater' },
                          // { label: 'Tempo Traveller 16 Seater' }
                        ]}
                        autoHighlight
                        value={vehicle.vehicleType}
                        onChange={(e, newValue) =>
                          handleInputChange(index, "vehicleType", newValue)
                        }
                        required
                        getOptionLabel={(option) =>
                          option ? option.label : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option && value && option.label === value.label
                        }
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            {option.label}
                          </Box>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder="Offer Type"
                            inputProps={{
                              ...params.inputProps,
                              autoComplete: "new-password",
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="col-sm-4">
                      <label
                        htmlFor={`modelNameInput-${index}`}
                        className="form-label"
                      >
                        Offer Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Offer Name"
                        aria-label="model-name"
                        value={vehicle.modelName}
                        onChange={(e) =>
                          handleInputChange(index, "modelName", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-sm-4">
                      <label
                        htmlFor={`brandNameInput-${index}`}
                        className="form-label"
                      >
                        percentage (%)
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="percentage (%)"
                        aria-label="brand-name"
                        value={vehicle.brandName}
                        onChange={(e) =>
                          handleInputChange(index, "brandName", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-sm-4">
                      <label for="firstNameinput" className="form-label">
                        Offer Images
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        id="imagesInput"
                        // multiple
                        onChange={handleImageChange}
                      />
                    </div>
                    {/* <div className="col-sm-4">
                                            <label htmlFor={`inventoryInput-${index}`} className="form-label">Inventory</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Inventory"
                                                aria-label="inventory"
                                                value={vehicle.inventory}
                                                onChange={(e) => handleInputChange(index, 'inventory', e.target.value)}
                                            />
                                        </div> */}

                    {/* <div className="col-sm-4">
                                            <label htmlFor={`seatLimitInput-${index}`} className="form-label">Passenger Capacity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Passenger Capacity"
                                                aria-label="passenger-capacity"
                                                value={vehicle.seatLimit}
                                                onChange={(e) => handleInputChange(index, 'seatLimit', e.target.value)}
                                            />
                                        </div> */}
                    {/* <div className="col-sm-4">
                                            <label htmlFor={`luggageCapacityInput-${index}`} className="form-label">Luggage Capacity</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Luggage Capacity"
                                                aria-label="luggage-capacity"
                                                value={vehicle.luggageCapacity}
                                                onChange={(e) => handleInputChange(index, 'luggageCapacity', e.target.value)}
                                            />
                                        </div> */}
                    <div className="col-sm-4">
                      <label
                        htmlFor={`statusInput-${index}`}
                        className="form-label"
                      >
                        Status
                      </label>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={vehicle.status}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "status",
                                e.target.checked
                              )
                            }
                          />
                        }
                        // value={vehicle.status}
                        onChange={(e) =>
                          handleInputChange(index, "status", e.target.value)
                        }
                        size="large"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                                {vehicles.length > 1 && (
                                    <button onClick={() => removeVehicle(index)} className="form-label btn btn-danger btn-border" style={{ marginBottom: '0px' }}>
                                        Remove Driver
                                    </button>
                                )}
                            </div> */}
            </div>
          ))}
          {/* <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                        <button onClick={addVehicle} className="form-label btn btn-primary btn-border" style={{ marginBottom: '0px' }}>
                            Add Driver
                        </button>
                    </div> */}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
            padding: "15px",
            borderTop: "1px solid #f1f1f1",
          }}
        >
          <button className="btn btn-primary btn-border" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManageOffer;
