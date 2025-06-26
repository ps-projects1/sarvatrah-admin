import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { City, State } from "country-state-city";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";

const EditHotel = ({ hotel, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    _id: hotel._id,
    hotelType: hotel.hotelType,
    hotelName: hotel.hotelName,
    address: hotel.address,
    state: hotel.state,
    city: hotel.city,
    pincode: hotel.pincode,
    phoneNumber: hotel.phoneNumber,
    email: hotel.email,
    contactPerson: hotel.contactPerson,
    description: hotel.description || "",
  });

  const [selectedState, setSelectedState] = useState(hotel.state);
  const [cityOptions, setCityOptions] = useState([]);
  const [roomList, setRoomList] = useState([...hotel.rooms]);

  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState("IN", selectedState)?.map(
        (item) => ({
          label: item.name,
        })
      );
      setCityOptions(cities);
    }
  }, [selectedState]);

  const stateOptions = State.getStatesOfCountry("IN")?.map((item) => ({
    code: item.isoCode,
    label: item.name,
  }));

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutocompleteChange = (key, selectedOption) => {
    setFormData((prev) => ({ ...prev, [key]: selectedOption?.label || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedHotel = {
      ...formData,
      rooms: roomList,
    };
    onSave(updatedHotel);
  };

  // Room management functions
  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...roomList];
    updatedRooms[index][field] = value;
    setRoomList(updatedRooms);
  };

  const handleAddRoom = () => {
    setRoomList([
      ...roomList,
      {
        roomType: "",
        inventory: 0,
        roomPrice: 0,
        amenities: [],
        child: {
          childWithBedPrice: 0,
          childWithoutBedPrice: 0,
        },
      },
    ]);
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = [...roomList];
    updatedRooms.splice(index, 1);
    setRoomList(updatedRooms);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom>
        Edit Hotel
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Autocomplete
            value={{ label: formData.hotelType }}
            options={[
              { label: "5 star" },
              { label: "4 star" },
              { label: "3 star" },
              { label: "2 star" },
            ]}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Hotel Type"
                fullWidth
                margin="normal"
              />
            )}
            onChange={(e, value) =>
              handleAutocompleteChange("hotelType", value)
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Hotel Name"
            fullWidth
            margin="normal"
            value={formData.hotelName}
            onChange={(e) => handleInputChange("hotelName", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Address"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            value={{ label: formData.state, code: selectedState }}
            options={stateOptions}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} label="State" fullWidth margin="normal" />
            )}
            onChange={(e, value) => {
              setSelectedState(value?.code || "");
              handleAutocompleteChange("state", value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            value={{ label: formData.city }}
            options={cityOptions}
            disabled={!selectedState}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} label="City" fullWidth margin="normal" />
            )}
            onChange={(e, value) => handleAutocompleteChange("city", value)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Pincode"
            fullWidth
            margin="normal"
            value={formData.pincode}
            onChange={(e) => handleInputChange("pincode", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Contact Person"
            fullWidth
            margin="normal"
            value={formData.contactPerson}
            onChange={(e) => handleInputChange("contactPerson", e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
          />
        </Grid>
      </Grid>

      {/* Room Management Section */}
      <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
        Room Details
      </Typography>

      {roomList.map((room, index) => (
        <Box
          key={index}
          sx={{ mb: 3, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Room {index + 1}</Typography>
            <IconButton onClick={() => handleRemoveRoom(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                label="Room Type"
                fullWidth
                value={room.roomType}
                onChange={(e) =>
                  handleRoomChange(index, "roomType", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Price"
                fullWidth
                type="number"
                value={room.roomPrice}
                onChange={(e) =>
                  handleRoomChange(index, "roomPrice", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Inventory"
                fullWidth
                type="number"
                value={room.inventry}
                onChange={(e) =>
                  handleRoomChange(index, "inventry", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Child With Bed Price"
                fullWidth
                type="number"
                value={room.child.childWithBedPrice}
                onChange={(e) =>
                  handleRoomChange(
                    index,
                    "child.childWithBedPrice",
                    e.target.value
                  )
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Child Without Bed Price"
                fullWidth
                type="number"
                value={room.child.childWithoutBedPrice}
                onChange={(e) =>
                  handleRoomChange(
                    index,
                    "child.childWithoutBedPrice",
                    e.target.value
                  )
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={[
                  { label: "TV" },
                  { label: "AC" },
                  { label: "FREEZ" },
                  { label: "WIFI" },
                ]}
                value={room.amenities.map((amenity) => ({ label: amenity }))}
                getOptionLabel={(option) => option.label}
                onChange={(e, values) => {
                  handleRoomChange(
                    index,
                    "amenities",
                    values.map((v) => v.label)
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Amenities" fullWidth />
                )}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button variant="outlined" onClick={handleAddRoom} sx={{ mb: 2 }}>
        Add Room
      </Button>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditHotel;
