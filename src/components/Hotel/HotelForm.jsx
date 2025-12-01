import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import { City, State } from "country-state-city";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const amenitiesOptions = [
  { label: "TV" },
  { label: "AC" },
  { label: "FREEZ" },
  { label: "WIFI" },
];

const roomTypeOptions = [
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Super Deluxe", value: "Super Deluxe" },
];

const hotelTypeOptions = [
  { label: "5 star" },
  { label: "4 star" },
  { label: "3 star" },
  { label: "2 star" },
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const HotelForm = ({ hotelData, onSubmit, mode = "add" }) => {
  const [formData, setFormData] = useState({
    hotelType: "",
    hotelName: "",
    address: "",
    state: "",
    city: "",
    pincode: "",
    phoneNumber: "",
    email: "",
    contactPerson: "",
    descriptions: "",
    active: false,
    images: [],
    existingImages: [],
  });

  const [errors, setErrors] = useState({});

  const [selectedState, setSelectedState] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const fileInputRef = useRef(null);
  const [roomList, setRoomList] = useState([]);
  const [endDate, setEndDate] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [removedImages, setRemovedImages] = useState([]);

  const [rooms, setRooms] = useState({
    roomType: null,
    inventory: 0,
    occupancyRates: [0, 0, 0],
    child: {
      childWithBedPrice: 0,
      childWithoutBedPrice: 0,
    },
    amenities: [],
    duration: {
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    if (hotelData && mode === "edit") {
      setFormData({
        hotelType: hotelData.hotelType || "",
        hotelName: hotelData.hotelName || "",
        address: hotelData.address || "",
        state: hotelData.state || "",
        city: hotelData.city || "",
        pincode: hotelData.pincode || "",
        phoneNumber: hotelData.phoneNumber || "",
        email: hotelData.email || "",
        contactPerson: hotelData.contactPerson || "",
        descriptions: hotelData.descriptions || "",
        images: [],
        existingImages: hotelData.imgs || [], // Note: changed from 'images' to 'imgs' to match backend
        active: hotelData.active || false, // Add active status if needed
      });

      if (hotelData.state) {
        setSelectedState(
          State.getStatesOfCountry("IN").find(
            (state) => state.name === hotelData.state
          )?.isoCode || ""
        );
      }

      if (hotelData.rooms) {
        setRoomList(hotelData.rooms);
      }

      if (hotelData.imgs) {
        setFormData((prev) => ({
          ...prev,
          existingImages: hotelData.imgs.map((img) =>
            img.path.replace("http://127.0.0.1:3232/", "")
          ),
        }));
      }
    }
  }, [hotelData, mode]);

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState("IN", selectedState)?.map(
        (item) => ({
          label: item?.name,
        })
      );
      setCityOptions(cities);
    }
  }, [selectedState]);

  const stateOptions = State.getStatesOfCountry("IN")?.map((item) => ({
    code: item?.isoCode,
    label: item?.name,
  }));

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleAutocompleteChange = (key, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: selectedOption?.label || "",
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    if (
      files.length +
        formData.images.length +
        formData.existingImages.length -
        removedImages.length >
      10
    ) {
      toast.error("You can upload a maximum of 10 images");
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleRemoveImage = (index, isExisting) => {
    if (isExisting) {
      const imageToRemove = formData.existingImages[index];
      setRemovedImages([...removedImages, imageToRemove]);
      setFormData((prevData) => {
        const newExistingImages = [...prevData.existingImages];
        newExistingImages.splice(index, 1);
        return {
          ...prevData,
          existingImages: newExistingImages,
        };
      });
    } else {
      setFormData((prevData) => {
        const newImages = [...prevData.images];
        newImages.splice(index, 1);
        return {
          ...prevData,
          images: newImages,
        };
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!formData.hotelType?.trim()) {
      newErrors.hotelType = "Hotel type is required";
    }
    if (!formData.hotelName?.trim()) {
      newErrors.hotelName = "Hotel name is required";
    }
    if (!formData.address?.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.state?.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.city?.trim()) {
      newErrors.city = "City is required";
    }

    // Pincode validation (6 digits)
    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // Phone number validation (10 digits)
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    }

    // Email validation
    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Room list validation
    if (roomList.length === 0) {
      newErrors.roomList = "At least one room is required";
    }

    // Images validation (only for add mode)
    if (mode === "add" && formData.images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitForm = async () => {
    try {
      // Validate form
      if (!validateForm()) {
        toast.error("Please fix all validation errors");
        return;
      }

      const formDataWithImages = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images" && key !== "existingImages" && key !== "active") {
          formDataWithImages.append(key, value);
        }
      });

      formDataWithImages.append("active", formData.active);

      // Append rooms data
      formDataWithImages.append("encryptedRooms", JSON.stringify(roomList));

      // Append new images
      formData.images.forEach((image) => {
        formDataWithImages.append("files", image);
      });

      // In edit mode, include the _id and handle removed images
      if (mode === "edit" && hotelData) {
        formDataWithImages.append("_id", hotelData._id);

        if (removedImages.length > 0) {
          formDataWithImages.append(
            "removedImages",
            JSON.stringify(removedImages)
          );
        }
      }

      await onSubmit(formDataWithImages);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "Failed to submit form");
    }
  };

  const handleAddRoom = () => {
    if (
      !rooms.roomType ||
      rooms.inventory <= 0 ||
      !rooms.duration.startDate ||
      !rooms.duration.endDate
    ) {
      toast.error("Please fill all required room fields");
      return;
    }

    setRoomList([...roomList, rooms]);
    if (errors.roomList) {
      setErrors({...errors, roomList: null});
    }
    setRooms({
      roomType: null,
      inventory: 0,
      occupancyRates: [0, 0, 0],
      child: {
        childWithBedPrice: 0,
        childWithoutBedPrice: 0,
      },
      amenities: [],
      duration: {
        startDate: "",
        endDate: "",
      },
    });
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title flex-grow-1">
            {mode === "add" ? "Add Hotel" : "Edit Hotel"}
          </h1>
        </div>
        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              <div className="col-sm-4">
                <label htmlFor="hotelTypeInput" className="form-label">
                  Hotel Type
                </label>
                <Autocomplete
                  value={
                    formData.hotelType
                      ? { label: formData.hotelType, value: formData.hotelType }
                      : null
                  }
                  id="hotelTypeInput"
                  sx={{ width: "100%" }}
                  size="small"
                  options={hotelTypeOptions}
                  autoHighlight
                  required
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Hotel Type"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("hotelType", selectedOption)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="hotelNameInput" className="form-label">
                  Hotel Name <span className="text-danger">*</span>
                </label>
                <input
                  required
                  type="text"
                  className={`form-control ${errors.hotelName ? 'is-invalid' : ''}`}
                  placeholder="Hotel Name"
                  id="hotelNameInput"
                  value={formData.hotelName}
                  onChange={(e) => {
                    handleInputChange("hotelName", e.target.value);
                    if (errors.hotelName) {
                      setErrors({...errors, hotelName: null});
                    }
                  }}
                />
                {errors.hotelName && (
                  <div className="invalid-feedback d-block">{errors.hotelName}</div>
                )}
              </div>
              <div className="col-sm-4">
                <label htmlFor="addressInput" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  id="addressInput"
                  rows="3"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                ></textarea>
              </div>
              <div className="col-sm-4">
                <label htmlFor="stateInput" className="form-label">
                  Select State
                </label>
                <Autocomplete
                  id="stateInput"
                  sx={{ width: "100%" }}
                  size="small"
                  options={stateOptions}
                  value={
                    formData.state
                      ? { label: formData.state, value: formData.state }
                      : null
                  }
                  autoHighlight
                  getOptionLabel={(option) => option.label}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose a state"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                  onChange={(e, selectedOption) => {
                    setSelectedState(selectedOption?.code || "");
                    handleAutocompleteChange("state", selectedOption);
                    handleInputChange("city", ""); // Reset city when state changes
                  }}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="cityInput" className="form-label">
                  Select City
                </label>
                <Autocomplete
                  id="cityInput"
                  sx={{ width: "100%" }}
                  size="small"
                  options={cityOptions}
                  freeSolo
                  autoHighlight
                  value={
                    formData.city
                      ? { label: formData.city, value: formData.city }
                      : null
                  }
                  getOptionLabel={(option) =>
                    typeof option === "string" ? option : option.label
                  }
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.label}
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Choose a City"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    let selectedCity = "";

                    if (typeof newValue === "string") {
                      selectedCity = newValue;
                    } else if (newValue && typeof newValue === "object") {
                      selectedCity = newValue.value || newValue.label || "";
                    }

                    setFormData((prev) => ({
                      ...prev,
                      city: selectedCity,
                    }));
                  }}
                  onInputChange={(event, inputValue, reason) => {
                    if (reason === "input") {
                      // ✅ Live update the input value
                      setFormData((prev) => ({
                        ...prev,
                        city: inputValue,
                      }));
                    }
                  }}
                  disabled={!selectedState}
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="pincodeInput" className="form-label">
                  Pincode <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  maxLength="6"
                  className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
                  id="pincodeInput"
                  placeholder="Pincode (6 digits)"
                  value={formData.pincode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange("pincode", value);
                    if (errors.pincode) {
                      setErrors({...errors, pincode: null});
                    }
                  }}
                />
                {errors.pincode && (
                  <div className="invalid-feedback d-block">{errors.pincode}</div>
                )}
              </div>
              <div className="col-sm-4">
                <label htmlFor="phoneNumberInput" className="form-label">
                  Contact Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  maxLength="10"
                  className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                  id="phoneNumberInput"
                  placeholder="Contact Number (10 digits)"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    handleInputChange("phoneNumber", value);
                    if (errors.phoneNumber) {
                      setErrors({...errors, phoneNumber: null});
                    }
                  }}
                />
                {errors.phoneNumber && (
                  <div className="invalid-feedback d-block">{errors.phoneNumber}</div>
                )}
              </div>
              <div className="col-sm-4">
                <label htmlFor="emailInput" className="form-label">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="emailInput"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) => {
                    handleInputChange("email", e.target.value);
                    if (errors.email) {
                      setErrors({...errors, email: null});
                    }
                  }}
                />
                {errors.email && (
                  <div className="invalid-feedback d-block">{errors.email}</div>
                )}
              </div>
              <div className="col-sm-4">
                <label htmlFor="contactPersonInput" className="form-label">
                  Contact Person
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="contactPersonInput"
                  placeholder="Contact Person"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label htmlFor="descriptionInput" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="descriptionInput"
                  rows="3"
                  value={formData.descriptions}
                  onChange={(e) =>
                    handleInputChange("descriptions", e.target.value)
                  }
                ></textarea>
              </div>

              <div className="col-sm-4">
                <label htmlFor="imagesInput" className="form-label">
                  Images (Max 10) {mode === "add" && <span className="text-danger">*</span>}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className={`form-control ${errors.images ? 'is-invalid' : ''}`}
                  id="imagesInput"
                  multiple
                  onChange={(e) => {
                    handleImageChange(e);
                    if (errors.images) {
                      setErrors({...errors, images: null});
                    }
                  }}
                  accept="image/*"
                />
                <small className="text-muted">
                  {10 -
                    (formData.images.length +
                      formData.existingImages.length -
                      removedImages.length)}{" "}
                  images remaining
                </small>
                {errors.images && (
                  <div className="invalid-feedback d-block">{errors.images}</div>
                )}
              </div>
              <div className="col-sm-4">
                <label htmlFor="activeInput" className="form-label">
                  Status
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="activeInput"
                    checked={formData.active}
                    onChange={(e) =>
                      handleInputChange("active", e.target.checked)
                    }
                  />
                  <label className="form-check-label" htmlFor="activeInput">
                    {formData.active ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
              <div className="col-12">
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {formData.existingImages.map((image, index) => (
                    <div
                      key={`existing-${index}`}
                      className="position-relative"
                    >
                      <img
                        src={
                          typeof image === "string"
                            ? `${process.env.REACT_APP_API_BASE_URL}/${image}`
                            : image.path
                        }
                        alt={`Hotel ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                        style={{ transform: "translate(50%, -50%)" }}
                        onClick={() => handleRemoveImage(index, true)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {formData.images.map((image, index) => (
                    <div key={`new-${index}`} className="position-relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                          marginRight: "10px",
                          marginBottom: "10px",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0"
                        style={{ transform: "translate(50%, -50%)" }}
                        onClick={() => handleRemoveImage(index, false)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {roomList.length > 0 && (
            <div className="mt-5">
              <label style={{ fontSize: "20px" }}>Added Room List</label>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>Sr. No</StyledTableCell>
                      <StyledTableCell align="right">Room Type</StyledTableCell>
                      <StyledTableCell align="right">Duration</StyledTableCell>
                      <StyledTableCell align="right">Inventory</StyledTableCell>
                      <StyledTableCell align="right">
                        Occupancy-1 rate
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Occupancy-2 rate
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        Occupancy-3 rate
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        child-with-bed rate
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        child-without bed rate
                      </StyledTableCell>
                      <StyledTableCell align="right">Amenities</StyledTableCell>
                      <StyledTableCell align="right">Actions</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roomList.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell component="th" scope="row">
                          {index + 1}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.roomType}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.duration.startDate} to {row.duration.endDate}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.inventory}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.occupancyRates[0]}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.occupancyRates[1]}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.occupancyRates[2]}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.child.childWithBedPrice}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.child.childWithoutBedPrice}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {row.amenities.join(", ")}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton
                            color="error"
                            onClick={() => {
                              const updatedRooms = [...roomList];
                              updatedRooms.splice(index, 1);
                              setRoomList(updatedRooms);
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>

        <div>
          <div style={{ marginBottom: "20px" }}>
            <div
              className="card-header align-items-center d-flex"
              style={{ borderTop: "1px solid #e9ebec" }}
            >
              <h1
                className="card-title flex-grow-1"
                style={{ marginBottom: "0px" }}
              >
                Room Details
              </h1>
            </div>
            <div className="card-body">
              <div className="live-preview">
                <div className="row g-3">
                  <div className="col-sm-4">
                    <label htmlFor="roomTypeInput" className="form-label">
                      Room Type
                    </label>
                    <Autocomplete
                      id="roomTypeInput"
                      sx={{ width: "100%" }}
                      size="small"
                      options={roomTypeOptions}
                      autoHighlight
                      value={
                        rooms.roomType
                          ? { label: rooms.roomType, value: rooms.roomType }
                          : null
                      }
                      onChange={(e, newValue) => {
                        setRooms({ ...rooms, roomType: newValue?.label || "" });
                      }}
                      required
                      getOptionLabel={(option) => option?.label || ""}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Room Type"
                          inputProps={{
                            ...params.inputProps,
                            autoComplete: "new-password",
                          }}
                        />
                      )}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="inventoryInput" className="form-label">
                      Inventory
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="inventoryInput"
                      placeholder="Inventory"
                      value={rooms.inventory === 0 ? "" : rooms.inventory}
                      onChange={(e) =>
                        setRooms({
                          ...rooms,
                          inventory: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="occupancy1Input" className="form-label">
                      Occupancy-1
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="occupancy1Input"
                      placeholder="Rate"
                      value={
                        rooms.occupancyRates[0] === 0
                          ? ""
                          : rooms.occupancyRates[0]
                      }
                      onChange={(e) => {
                        setRooms((prevRooms) => ({
                          ...prevRooms,
                          occupancyRates: [
                            parseInt(e.target.value) || 0,
                            ...prevRooms.occupancyRates.slice(1),
                          ],
                        }));
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="occupancy2Input" className="form-label">
                      Occupancy-2
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="occupancy2Input"
                      placeholder="Rate"
                      value={
                        rooms.occupancyRates[1] === 0
                          ? ""
                          : rooms.occupancyRates[1]
                      }
                      onChange={(e) => {
                        setRooms((prevRooms) => ({
                          ...prevRooms,
                          occupancyRates: [
                            prevRooms.occupancyRates[0],
                            parseInt(e.target.value) || 0,
                            ...prevRooms.occupancyRates.slice(2),
                          ],
                        }));
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="occupancy3Input" className="form-label">
                      Occupancy-3
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="occupancy3Input"
                      placeholder="Rate"
                      value={
                        rooms.occupancyRates[2] === 0
                          ? ""
                          : rooms.occupancyRates[2]
                      }
                      onChange={(e) => {
                        setRooms((prevRooms) => ({
                          ...prevRooms,
                          occupancyRates: [
                            ...prevRooms.occupancyRates.slice(0, 2),
                            parseInt(e.target.value) || 0,
                          ],
                        }));
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="childWithBedInput" className="form-label">
                      Child-WithBedPrice
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="childWithBedInput"
                      placeholder="Rate"
                      value={
                        rooms.child.childWithBedPrice === 0
                          ? ""
                          : rooms.child.childWithBedPrice
                      }
                      onChange={(e) =>
                        setRooms({
                          ...rooms,
                          child: {
                            ...rooms.child,
                            childWithBedPrice: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor="childWithoutBedInput"
                      className="form-label"
                    >
                      Child-WithoutBedPrice
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="childWithoutBedInput"
                      placeholder="Rate"
                      value={
                        rooms.child.childWithoutBedPrice === 0
                          ? ""
                          : rooms.child.childWithoutBedPrice
                      }
                      onChange={(e) =>
                        setRooms({
                          ...rooms,
                          child: {
                            ...rooms.child,
                            childWithoutBedPrice: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor="amenitiesInput" className="form-label">
                      Amenities
                    </label>
                    <Autocomplete
                      multiple
                      id="amenitiesInput"
                      size="small"
                      options={amenitiesOptions}
                      getOptionLabel={(option) => option.label}
                      value={
                        rooms.amenities.length
                          ? rooms.amenities.map((item) => ({
                              label: item,
                              value: item,
                            }))
                          : []
                      }
                      onChange={(e, newValue) => {
                        const amenities = newValue.map((item) => item.label);
                        setRooms({ ...rooms, amenities });
                      }}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField {...params} placeholder="Amenities" />
                      )}
                    />
                  </div>
                </div>
                <div className="row g-3 mt-1">
                  <label htmlFor="durationInput" className="form-label">
                    Duration
                  </label>
                  <div className="col-sm-4 mt-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start date"
                        value={startDate}
                        onChange={(newValue) => {
                          setStartDate(newValue);
                          const formattedDate =
                            dayjs(newValue).format("YYYY-MM-DD");
                          setRooms((prevRooms) => ({
                            ...prevRooms,
                            duration: {
                              ...prevRooms.duration,
                              startDate: formattedDate,
                            },
                          }));
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-sm-4 mt-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End date"
                        value={endDate}
                        minDate={startDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                          const formattedDate =
                            dayjs(newValue).format("YYYY-MM-DD");
                          setRooms((prevRooms) => ({
                            ...prevRooms,
                            duration: {
                              ...prevRooms.duration,
                              endDate: formattedDate,
                            },
                          }));
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex flex-column align-items-center mb-4">
            <button
              onClick={handleAddRoom}
              className="btn btn-primary btn-border"
            >
              Add Room
            </button>
            {errors.roomList && (
              <div className="text-danger mt-2">{errors.roomList}</div>
            )}
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
          <button
            className="btn btn-primary btn-border"
            onClick={handleSubmitForm}
          >
            {mode === "add" ? "Submit" : "Update"}
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default HotelForm;
