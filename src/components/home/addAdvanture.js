import React from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
// import jwt from 'react-jwt';
import Cookies from "js-cookie";
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from "@mui/material";

const AddAdvanture = () => {
  const [formData, setFormData] = useState({
    packageName: "",
    packageDuration: "",
    availableVehicle: [{ vehicleType: "", price: "" }],
    groupSize: "",
    include: [],
    exclude: [],
    startLocation: "",
    advantureLocation: "",
    discount: "",
    price: "",
    overview: "",
    mapLink: "",
    unEligibility: { age: [], diseases: [] },
    availableSlot: "",
    availableLanguage: [],
    cancellationPolicy: "",
    highlight: "",
    image: null, // New field for a single image
    pickUpAndDrop: false,
    pickUpOnly: false,
    dropOnly: false,
    pickUpLocation: "",
    dropLocation: "",
    pickUpAndDropPrice: "",
    pickUpOnlyPrice: "",
    dropOnlyPrice: "",
    ageTypes: {
      adult: false,
      children: false,
      senior: false,
    },
    age: {
      adult: "",
      children: "",
      senior: "",
    },
  });

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCheckBoxChange = (key) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: !prevData[key],
      [`${key}Location`]: "",
      [`${key}Price`]: "",
    }));
  };

  const handleAgeCheckBoxChange = (type) => {
    setFormData((prevData) => {
      const updatedAgeTypes = {
        ...prevData.ageTypes,
        [type]: !prevData.ageTypes[type],
      };
      let defaultAge = "";

      // Set different default ages based on the checkbox type
      if (type === "adult") {
        defaultAge = "18";
      } else if (type === "children") {
        defaultAge = "10";
      } else if (type === "senior") {
        defaultAge = "60+";
      }

      return {
        ...prevData,
        ageTypes: updatedAgeTypes,
        age: {
          ...prevData.age,
          [type]: updatedAgeTypes[type] ? defaultAge : "",
        },
        unEligibility: {
          ...prevData.unEligibility,
          age: updatedAgeTypes[type] ? defaultAge : "",
        },
      };
    });
  };

  const handleAgeInputChange = (type, value) => {
    setFormData((prevData) => {
      const updatedUnEligibility = {
        ...prevData.unEligibility,
        age: value.trim(), // Set the value directly
      };

      return {
        ...prevData,
        age: {
          ...prevData.age,
          [type]: value.trim(),
        },
        unEligibility: updatedUnEligibility,
      };
    });
  };

  const handleAutocompleteChangeMultiple = (key, event, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value.map((option) => option.label) || [],
    }));
  };

  const handleNestedInputChange = (parentKey, index, childKey, value) => {
    setFormData((prevData) => {
      const updatedAvailableVehicle = [...prevData[parentKey]];
      updatedAvailableVehicle[index] = {
        ...updatedAvailableVehicle[index],
        [childKey]: value,
      };
      return {
        ...prevData,
        [parentKey]: updatedAvailableVehicle,
      };
    });
  };

  // const handleIncludeExcludeChange = (key, value) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [key]: value.map((item) => ({ label: item })), // Format the values to match Autocomplete structure
  //   }));
  // };

  // const handleImageChange = (event) => {
  //   const files = event.target.files;
  //   const imagesArray = Array.from(files);

  //   setFormData((prevData) => ({
  //     ...prevData,
  //     images: imagesArray,
  //   }));
  // };

  const handleAddVehicle = () => {
    setFormData((prevData) => ({
      ...prevData,
      availableVehicle: [
        ...prevData.availableVehicle,
        { vehicleType: "", price: "" },
      ],
    }));
  };

  const handleRemoveVehicle = (index) => {
    setFormData((prevData) => {
      const updatedVehicles = [...prevData.availableVehicle];
      updatedVehicles.splice(index, 1);
      return { ...prevData, availableVehicle: updatedVehicles };
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      image: file,
    }));
  };

  const handleThemeImagesChange = (event) => {
    const files = event.target.files;
    const themeImagesArray = Array.from(files);
    setFormData((prevData) => ({
      ...prevData,
      themeImages: themeImagesArray,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Constructing query parameters
      const queryParams = new URLSearchParams();
      Object.entries(formData).forEach(([key, value]) => {
        // Exclude image and themeImages from query parameters
        if (key !== "file" && key !== "subfile") {
          if (
            key === "availableVehicle" ||
            key === "unEligibility" ||
            key === "include" ||
            key === "exclude" ||
            key === "availableLanguage"
          ) {
            // Convert objects and arrays to JSON strings
            queryParams.append(key, JSON.stringify(value));
          } else {
            queryParams.append(key, value);
          }
        }
      });

      // Creating form data and appending the image
      const formDataWithImages = new FormData();
      formDataWithImages.append("file", formData.image);

      // Appending themeImages to form data
      // formData.themeImages.forEach((themeImage, index) => {
      //   formDataWithImages.append(`subfile[${index}]`, themeImage);
      // });

      const response = await fetch(
        `http://localhost:3232/advanture/?${queryParams.toString()}`,
        {
          method: "POST",
          headers: {
            // 'Cookie': `roomInfo=${token}`,
          },
          body: formDataWithImages,
        }
      );
      if (response.ok) {
        alert("Advanture added successfully");
      } else {
        console.error("Failed to add Advanture");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title  flex-grow-1 ">Add Adventure</h1>
        </div>

        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              <div className="col-sm-4">
                <label htmlFor="packageNameInput" className="form-label">
                  Package Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Package Name"
                  aria-label="package-name"
                  onChange={(e) =>
                    handleInputChange("packageName", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="packageDurationInput" className="form-label">
                  Package Duration
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Package Duration"
                  aria-label="package-duration"
                  onChange={(e) =>
                    handleInputChange("packageDuration", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label htmlFor="groupSizeInput" className="form-label">
                  Group Size
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Group Size"
                  aria-label="group-size"
                  onChange={(e) =>
                    handleInputChange("groupSize", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`includeInput`} className="form-label">
                  Include
                </label>
                <Autocomplete
                  multiple
                  id={`includeInput`}
                  size="small"
                  options={includeOptions} // You need to define this array
                  getOptionLabel={(option) => option.label}
                  value={formData.include.map((item) => ({ label: item }))}
                  onChange={(event, value) =>
                    handleAutocompleteChangeMultiple("include", event, value)
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Include" />
                  )}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`excludeInput`} className="form-label">
                  Exclude
                </label>
                <Autocomplete
                  multiple
                  id={`excludeInput`}
                  size="small"
                  options={excludeOptions} // You need to define this array
                  getOptionLabel={(option) => option.label}
                  value={formData.exclude.map((item) => ({ label: item }))}
                  onChange={(event, value) =>
                    handleAutocompleteChangeMultiple("exclude", event, value)
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Exclude" />
                  )}
                />
              </div>
              <div className="col-sm-4">
                <label
                  htmlFor={`availableLanguageInput`}
                  className="form-label"
                >
                  Available Languages
                </label>
                <Autocomplete
                  multiple
                  id={`availableLanguageInput`}
                  size="small"
                  options={languageOptions} // You need to define this array
                  getOptionLabel={(option) => option.label}
                  value={formData.availableLanguage.map((item) => ({
                    label: item,
                  }))}
                  onChange={(event, value) =>
                    handleAutocompleteChangeMultiple(
                      "availableLanguage",
                      event,
                      value
                    )
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Available Languages" />
                  )}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="startLocationInput" className="form-label">
                  Start Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Start Location"
                  aria-label="start-location"
                  onChange={(e) =>
                    handleInputChange("startLocation", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="advantureLocationInput" className="form-label">
                  Advanture Location
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Advanture Location"
                  aria-label="advanture-location"
                  onChange={(e) =>
                    handleInputChange("advantureLocation", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`discountInput`} className="form-label">
                  Discount
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Discount"
                  aria-label="discount"
                  onChange={(e) =>
                    handleInputChange("discount", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`priceInput`} className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Price"
                  aria-label="price"
                  onChange={(e) => handleInputChange("price", e.target.value)}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`overviewInput`} className="form-label">
                  Overview
                </label>
                <textarea
                  className="form-control"
                  rows="4"
                  onChange={(e) =>
                    handleInputChange("overview", e.target.value)
                  }
                ></textarea>
              </div>

              <div className="col-sm-4">
                <label htmlFor={`highlightInput`} className="form-label">
                  Highlight
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  onChange={(e) =>
                    handleInputChange("highlight", e.target.value)
                  }
                ></textarea>
              </div>
              <div className="col-sm-4">
                <label htmlFor={`mapLinkInput`} className="form-label">
                  Map Link
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Map Link"
                  onChange={(e) => handleInputChange("mapLink", e.target.value)}
                />
              </div>
              {/* <div className="col-sm-4">
                <label htmlFor={`ageInput`} className="form-label">Age Restrictions</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Age Restrictions (comma-separated)"
                  onChange={(e) => handleInputChange('unEligibility.age', e.target.value.split(','))}
                />
              </div> */}
              <div className="col-sm-4">
                <label htmlFor={`diseasesInput`} className="form-label">
                  Ineligible Diseases
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Ineligible Diseases (comma-separated)"
                  onChange={(e) =>
                    handleInputChange(
                      "unEligibility.diseases",
                      e.target.value.split(",")
                    )
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`availableSlotInput`} className="form-label">
                  Available Slots
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Available Slots"
                  onChange={(e) =>
                    handleInputChange("availableSlot", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor={`imageInput`} className="form-label">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="imageInput"
                  onChange={handleImageChange}
                />
              </div>
              {/* ... (Rest of the fields) */}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              <div className="col-sm-4">
                <label
                  htmlFor={`cancellationPolicyInput`}
                  className="form-label"
                >
                  Cancellation Policy
                </label>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="cancellationPolicy"
                    name="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={(e) =>
                      handleInputChange("cancellationPolicy", e.target.value)
                    }
                  >
                    <FormControlLabel
                      value="refundable"
                      control={<Radio size="small" />}
                      label="Refundable"
                    />
                    <FormControlLabel
                      value="non-refundable"
                      control={<Radio size="small" />}
                      label="Non-refundable"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              {/* ... (your existing JSX) */}
              <label htmlFor={`ageRestrictionsInput`} className="form-label">
                Age Restrictions
              </label>
              <div className="col-sm-4">
                <label
                  htmlFor="ageCheckBoxAdult"
                  className="form-label"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    style={{
                      marginRight: "10px",
                      width: "15px",
                      height: "15px",
                    }}
                    type="checkbox"
                    id="ageCheckBoxAdult"
                    checked={formData.ageTypes.adult}
                    onChange={() => handleAgeCheckBoxChange("adult")}
                  />
                  Adult
                </label>
                {formData.ageTypes.adult && (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Adult Age"
                    aria-label="adult-age"
                    value={formData.age.adult}
                    onChange={(e) =>
                      handleAgeInputChange("adult", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-sm-4">
                <label
                  htmlFor="ageCheckBoxChildren"
                  className="form-label"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    style={{
                      marginRight: "10px",
                      width: "15px",
                      height: "15px",
                    }}
                    type="checkbox"
                    id="ageCheckBoxChildren"
                    checked={formData.ageTypes.children}
                    onChange={() => handleAgeCheckBoxChange("children")}
                  />
                  Children
                </label>
                {formData.ageTypes.children && (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Children Age"
                    aria-label="children-age"
                    value={formData.age.children}
                    onChange={(e) =>
                      handleAgeInputChange("children", e.target.value)
                    }
                  />
                )}
              </div>

              <div className="col-sm-4">
                <label
                  htmlFor="ageCheckBoxSenior"
                  className="form-label"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <input
                    style={{
                      marginRight: "10px",
                      width: "15px",
                      height: "15px",
                    }}
                    type="checkbox"
                    id="ageCheckBoxSenior"
                    checked={formData.ageTypes.senior}
                    onChange={() => handleAgeCheckBoxChange("senior")}
                  />
                  Senior
                </label>
                {formData.ageTypes.senior && (
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Senior Age"
                    aria-label="senior-age"
                    value={formData.age.senior}
                    onChange={(e) =>
                      handleAgeInputChange("senior", e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              <div className="col-sm-4">
                <label htmlFor="pickUpAndDrop" className="form-label">
                  Pick Up & Drop
                </label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="checkbox"
                  id="pickUpAndDrop"
                  checked={formData.pickUpAndDrop}
                  onChange={() => handleCheckBoxChange("pickUpAndDrop")}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="pickUpOnly" className="form-label">
                  Pick Up Only
                </label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="checkbox"
                  id="pickUpOnly"
                  checked={formData.pickUpOnly}
                  onChange={() => handleCheckBoxChange("pickUpOnly")}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="dropOnly" className="form-label">
                  Drop Only
                </label>
                <input
                  style={{ width: "15px", height: "15px" }}
                  type="checkbox"
                  id="dropOnly"
                  checked={formData.dropOnly}
                  onChange={() => handleCheckBoxChange("dropOnly")}
                />
              </div>

              {formData.pickUpAndDrop && (
                <div className="col-sm-4">
                  <label htmlFor="pickUpLocationInput" className="form-label">
                    Pick Up Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pick Up Location"
                    aria-label="pick-up-location"
                    onChange={(e) =>
                      handleInputChange("pickUpLocation", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.pickUpAndDrop && (
                <div className="col-sm-4">
                  <label htmlFor="dropLocationInput" className="form-label">
                    Drop Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Drop Location"
                    aria-label="drop-location"
                    onChange={(e) =>
                      handleInputChange("dropLocation", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.pickUpAndDrop && (
                <div className="col-sm-4">
                  <label
                    htmlFor="pickUpAndDropPriceInput"
                    className="form-label"
                  >
                    Pick Up & Drop Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Pick Up & Drop Price"
                    aria-label="pick-up-and-drop-price"
                    value={formData.pickUpAndDropPrice}
                    onChange={(e) =>
                      handleInputChange("pickUpAndDropPrice", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.pickUpOnly && (
                <div className="col-sm-4">
                  <label htmlFor="pickUpLocationInput" className="form-label">
                    Pick Up Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Pick Up Location"
                    aria-label="pick-up-location"
                    onChange={(e) =>
                      handleInputChange("pickUpLocation", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.pickUpOnly && (
                <div className="col-sm-4">
                  <label htmlFor="pickUpOnlyPriceInput" className="form-label">
                    Pick Up Only Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Pick Up Only Price"
                    aria-label="pick-up-only-price"
                    value={formData.pickUpOnlyPrice}
                    onChange={(e) =>
                      handleInputChange("pickUpOnlyPrice", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.dropOnly && (
                <div className="col-sm-4">
                  <label htmlFor="dropLocationInput" className="form-label">
                    Drop Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Drop Location"
                    aria-label="drop-location"
                    onChange={(e) =>
                      handleInputChange("dropLocation", e.target.value)
                    }
                  />
                </div>
              )}

              {formData.dropOnly && (
                <div className="col-sm-4">
                  <label htmlFor="dropOnlyPriceInput" className="form-label">
                    Drop Only Price
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Drop Only Price"
                    aria-label="drop-only-price"
                    value={formData.dropOnlyPrice}
                    onChange={(e) =>
                      handleInputChange("dropOnlyPrice", e.target.value)
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              <div className="">
                <label htmlFor="availableVehicleInput" className="form-label">
                  Available Vehicle
                </label>
                {formData.availableVehicle.map((vehicle, index) => (
                  <div
                    key={index}
                    style={{ display: "flex", marginBottom: "10px" }}
                    className="row g-3"
                  >
                    <div className="col-sm-4">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Vehicle Type"
                        aria-label="vehicle-type"
                        value={vehicle.vehicleType}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "availableVehicle",
                            index,
                            "vehicleType",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-sm-4">
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Price"
                        aria-label="vehicle-price"
                        value={vehicle.price}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "availableVehicle",
                            index,
                            "price",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-sm-4">
                      {index < formData.availableVehicle.length - 1 && (
                        <button
                          className="btn btn-link"
                          onClick={() => handleRemoveVehicle(index)}
                        >
                          Remove Vehicle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <div className="col-sm-4">
                  <button className="btn btn-link" onClick={handleAddVehicle}>
                    Add Vehicle
                  </button>
                </div>
              </div>
            </div>
          </div>
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
export default AddAdvanture;

const includeOptions = [
  { label: "English Speaking Guide" },
  { label: "Transfer by private transport" },
  { label: "Mineral water during trip" },
  { label: "cc" },
  { label: "Lunch in local restaurant" },
  { label: "All taxes and service charges" },
];

const excludeOptions = [
  { label: "Camera fee at monuments" },
  { label: "Personal expenses" },
];

const languageOptions = [
  { label: "English" },
  { label: "Hindi" },
  { label: "Kannada" },
];
