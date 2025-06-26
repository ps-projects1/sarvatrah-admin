import React, { useEffect, useRef } from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import Box from "@mui/material/Box";
import { useState } from "react";
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

const AddHotels = () => {
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
    description: "",
    images: [],
  });

  const [selectedState, setSelectedState] = useState("");

  const [cityOptions, setCityOptions] = useState([]);

  useEffect(() => {
    if (selectedState) {
      let temp = City?.getCitiesOfState("IN", selectedState)?.map((item) => {
        return {
          label: item?.name,
        };
      });
      setCityOptions(temp);
    }
  }, [selectedState]);

  const stateOptions = State.getStatesOfCountry("IN")?.map((item) => {
    return {
      code: item?.isoCode,
      label: item?.name,
    };
  });

  console.log(stateOptions, "country", formData?.city);

  const fileInputRef = useRef(null);

  const [roomList, setRoomList] = useState([]);
  const [endDate, setEndDate] = useState([]);
  const [startDate, setStartDate] = useState([]);

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

  const roomTypeOptions = [...roomType];
  const amenitiesOptions = [...amenities];

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleAutocompleteChange = (key, selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: selectedOption.label || "",
    }));
  };

  const handleImageChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      images: [...event.target.files],
    }));
  };

  const handleSubmit = async () => {
    try {
      const formDataWithImages = new FormData();
      // Append each image file individually but maintain the key as 'files'
      formData?.images?.forEach((image) => {
        formDataWithImages.append("files", image);
      });

      // Append other form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          // Images are already appended separately
          formDataWithImages.append(key, value);
        }
      });

      const updatedFormData = JSON.stringify(roomList);
      formDataWithImages.append(`rooms`, updatedFormData);

      const response = await fetch(`http://localhost:3232/inventries/hotel`, {
        method: "POST",
        body: formDataWithImages,
      });
      if (response.ok) {
        setFormData({
          hotelType: "",
          hotelName: "",
          address: "",
          state: "",
          city: "",
          pincode: "",
          phoneNumber: "",
          email: "",
          contactPerson: "",
          description: "",
        });
        setRoomList([]);
        fileInputRef.current.value = null;
        setEndDate("");
        setStartDate("");
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
        toast.success("Hotel added successfully");
      } else {
        console.error("Failed to add hotel");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div className="card-header align-items-center d-flex">
          <h1 className="card-title  flex-grow-1 ">Add Hotels</h1>
        </div>
        <div className="card-body">
          <div className="live-preview">
            <div className="row g-3">
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Hotel Type
                </label>
                <Autocomplete
                  value={{
                    label: formData?.hotelType,
                    value: formData?.hotelType,
                  }}
                  id="country-select-demo"
                  sx={{ width: "100%" }}
                  size="small"
                  options={hotelType}
                  autoHighlight
                  required
                  getOptionLabel={(option) => option.label}
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
                      placeholder="Hotel Type"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                    />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("hotelType", selectedOption)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Hotel Name
                </label>
                <input
                  required
                  type="name"
                  className="form-control"
                  placeholder="Hotel Name"
                  aria-label="hotel-name"
                  value={formData?.hotelName}
                  onChange={(e) =>
                    handleInputChange("hotelName", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Address
                </label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData?.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                ></textarea>
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Select State
                </label>
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: "100%" }}
                  size="small"
                  options={stateOptions}
                  value={{ label: formData?.state, value: formData?.state }}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
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
                      placeholder="Choose a state"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                    />
                  )}
                  onChange={(e, selectedOption) => {
                    setSelectedState(selectedOption?.code);
                    handleAutocompleteChange("state", selectedOption);
                  }}
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Select City
                </label>
                <Autocomplete
                  id="country-select-demo"
                  sx={{ width: "100%" }}
                  size="small"
                  options={cityOptions}
                  value={{ value: formData?.city, label: formData?.city }}
                  autoHighlight
                  getOptionLabel={(option) => option.label}
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
                      placeholder="Choose a City"
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password", // disable autocomplete and autofill
                      }}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                    />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("city", selectedOption)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Pincode
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Pincode"
                  aria-label="pincode"
                  value={formData?.pincode}
                  onChange={(e) => handleInputChange("pincode", e.target.value)}
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Contact Number
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Contact Number"
                  aria-label="contact-number"
                  value={formData?.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email Address"
                  aria-label="email-address"
                  value={formData?.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData?.contactPerson}
                  className="form-control"
                  placeholder="Contact Person"
                  aria-label="contact-person"
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                />
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  value={formData?.description}
                  id=""
                  rows="3"
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                ></textarea>
              </div>
              <div className="col-sm-4">
                <label for="firstNameinput" className="form-label">
                  Images
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="form-control"
                  id="imagesInput"
                  multiple
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
          <div className="mt-5">
            {formData && roomList?.length >= 1 ? (
              <div>
                <label style={{ fontSize: "20px" }}>Added Room List</label>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Sr. No</StyledTableCell>
                        <StyledTableCell align="right">
                          Room Type
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Duration
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          Inventory
                        </StyledTableCell>
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
                        <StyledTableCell align="right">
                          Amenities
                        </StyledTableCell>
                        <StyledTableCell align="right">Actions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {roomList?.map((row, index) => (
                        <StyledTableRow key={index}>
                          <StyledTableCell component="th" scope="row">
                            {index + 1}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.roomType}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.duration?.startDate +
                              " to " +
                              row?.duration?.endDate}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.inventory}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.occupancyRates[0]}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.occupancyRates[1]}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.occupancyRates[2]}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.child?.childWithBedPrice}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.child?.childWithoutBedPrice}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            {row?.amenities?.join(", ")}
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <IconButton
                              color="error"
                              onClick={() => {
                                const temp = [...roomList];
                                temp.splice(index, 1);
                                setRoomList(temp);
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
            ) : null}
          </div>
        </div>

        <div>
          <div style={{ marginBottom: "20px" }}>
            <div
              className="card-header align-items-center d-flex"
              style={{ borderTop: "1px solid #e9ebec" }}
            >
              <h1
                className="card-title  flex-grow-1 "
                style={{ marginBottom: "0px" }}
              >
                Room Details
              </h1>
            </div>
            <div className="card-body">
              <div className="live-preview">
                <div className="row g-3">
                  <div className="col-sm-4">
                    <label htmlFor={`roomTypeInput`} className="form-label">
                      Room Type
                    </label>
                    <Autocomplete
                      id={`roomTypeInput`}
                      sx={{ width: "100%" }}
                      size="small"
                      options={roomTypeOptions}
                      autoHighlight
                      value={
                        rooms?.roomType
                          ? { label: rooms.roomType, value: rooms.roomType }
                          : ""
                      }
                      onChange={(e, newValue) => {
                        let roomType = newValue?.label;
                        setRooms({ ...rooms, roomType });
                      }}
                      required
                      getOptionLabel={(option) => (option ? option.label : "")}
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
                    <label htmlFor={`inventoryInput`} className="form-label">
                      Inventory
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Inventory"
                      aria-label="contact-person"
                      value={rooms.inventory === 0 ? "" : rooms.inventory}
                      onChange={(e) =>
                        setRooms({
                          ...rooms,
                          inventory: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`occupancy1Input`} className="form-label">
                      Occupancy-1
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Rate"
                      aria-label="contact-person"
                      value={
                        rooms.occupancyRates[0] === 0
                          ? ""
                          : rooms.occupancyRates[0]
                      }
                      onChange={(e) => {
                        setRooms((prevRooms) => ({
                          ...prevRooms,
                          occupancyRates: [
                            parseInt(e.target.value), // update the first element
                            ...prevRooms.occupancyRates.slice(1), // keep the rest of the elements unchanged
                          ],
                        }));
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`occupancy2Input`} className="form-label">
                      Occupancy-2
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Rate"
                      aria-label="contact-person"
                      value={
                        rooms.occupancyRates[1] === 0
                          ? ""
                          : rooms.occupancyRates[1]
                      }
                      onChange={(e) => {
                        setRooms((prevRooms) => ({
                          ...prevRooms,
                          occupancyRates: [
                            prevRooms.occupancyRates[0], // keep the first element unchanged
                            parseInt(e.target.value), // update the second element
                            ...prevRooms.occupancyRates.slice(2), // keep the rest of the elements unchanged
                          ],
                        }));
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`occupancy3Input`} className="form-label">
                      Occupancy-3
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Rate"
                      aria-label="contact-person"
                      value={
                        rooms.occupancyRates[2] === 0
                          ? ""
                          : rooms.occupancyRates[2]
                      }
                      onChange={(e) => {
                        setRooms((prevRooms) => ({
                          ...prevRooms,
                          occupancyRates: [
                            ...prevRooms.occupancyRates.slice(0, -1), // keep all elements except the last one unchanged
                            parseInt(e.target.value), // update the last element
                          ],
                        }));
                      }}
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`childWithBedInput`} className="form-label">
                      Child-WithBedPrice
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Rate"
                      aria-label="contact-person"
                      value={
                        rooms?.child?.childWithBedPrice === 0
                          ? ""
                          : rooms?.child?.childWithBedPrice
                      }
                      onChange={(e) =>
                        setRooms({
                          ...rooms,
                          child: {
                            ...rooms?.child,
                            childWithBedPrice: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label
                      htmlFor={`childWithoutBedInput`}
                      className="form-label"
                    >
                      Child-WithoutBedPrice
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rate"
                      aria-label="contact-person"
                      value={
                        rooms?.child?.childWithoutBedPrice === 0
                          ? ""
                          : rooms?.child?.childWithoutBedPrice
                      }
                      onChange={(e) =>
                        setRooms({
                          ...rooms,
                          child: {
                            ...rooms?.child,
                            childWithoutBedPrice: parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                  <div className="col-sm-4">
                    <label htmlFor={`amenitiesInput`} className="form-label">
                      Amenities
                    </label>
                    <Autocomplete
                      multiple
                      id={`amenitiesInput`}
                      size="small"
                      options={amenitiesOptions}
                      getOptionLabel={(option) => (option ? option.label : "")}
                      value={
                        rooms?.amenities?.length
                          ? rooms?.amenities.map((item) => {
                              return {
                                label: item,
                                value: item,
                              };
                            })
                          : []
                      }
                      onChange={(e, newValue) => {
                        console.log(newValue, e, "hello world");
                        let amenities = newValue?.map((item) => item?.label);
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
                  <label htmlFor={`roomTypeInput`} className="form-label">
                    Duration
                  </label>
                  <div className="col-sm-4 mt-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="start-date"
                        value={startDate}
                        onChange={(newValue) => {
                          setStartDate(newValue);
                          const formattedDate =
                            dayjs(newValue).format("YYYY-MM-DD");
                          setRooms((prevRooms) => ({
                            ...prevRooms,
                            duration: {
                              ...prevRooms.duration, // Spread existing duration properties
                              startDate: formattedDate, // Update only the endDate
                            },
                          }));
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                  <div className="col-sm-4 mt-1">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="end-date"
                        value={endDate}
                        onChange={(newValue) => {
                          setEndDate(newValue);
                          const formattedDate =
                            dayjs(newValue).format("YYYY-MM-DD");
                          setRooms((prevRooms) => ({
                            ...prevRooms,
                            duration: {
                              ...prevRooms.duration, // Spread existing duration properties
                              endDate: formattedDate, // Update only the endDate
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

          <div
            style={{
              display: "flex",
              alignItems: "end",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => {
                setRoomList([...roomList, rooms]);
                console.log(JSON.stringify(roomList), "json data");
              }}
              className="form-label btn btn-primary btn-border"
              style={{ marginBottom: "0px" }}
            >
              Add Room
            </button>
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
          <button class="btn btn-primary btn-border" onClick={handleSubmit}>
            submit
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};
export default AddHotels;

const amenities = [
  { label: "TV" },
  { label: "AC" },
  { label: "FREEZ" },
  { label: "WIFI" },
];
const roomType = [
  { label: "Standard", value: "Standard" },
  { label: "Deluxe", value: "Deluxe" },
  { label: "Super Deluxe", value: "Super Deluxe" },
];

const hotelType = [
  { label: "5 star" },
  { label: "4 star" },
  { label: "3 star" },
  { label: "2 star" },
];
const countries = [
  { code: "AD", label: "Andorra", phone: "376" },
  {
    code: "AE",
    label: "United Arab Emirates",
    phone: "971",
  },
  { code: "AF", label: "Afghanistan", phone: "93" },
  {
    code: "AG",
    label: "Antigua and Barbuda",
    phone: "1-268",
  },
  { code: "AI", label: "Anguilla", phone: "1-264" },
  { code: "AL", label: "Albania", phone: "355" },
  { code: "AM", label: "Armenia", phone: "374" },
  { code: "AO", label: "Angola", phone: "244" },
  { code: "AQ", label: "Antarctica", phone: "672" },
  { code: "AR", label: "Argentina", phone: "54" },
  { code: "AS", label: "American Samoa", phone: "1-684" },
  { code: "AT", label: "Austria", phone: "43" },
  {
    code: "AU",
    label: "Australia",
    phone: "61",
    suggested: true,
  },
];
