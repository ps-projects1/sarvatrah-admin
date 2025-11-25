import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Autocomplete,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { State } from "country-state-city";
import toast from "react-hot-toast";

const CityForm = ({ cityData, onSubmit, mode = "add", onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    state: "",
    description: "",
    active: true,
  });

  useEffect(() => {
    if (cityData && mode === "edit") {
      setFormData({
        name: cityData.name || "",
        state: cityData.state || "",
        description: cityData.description || "",
        active: cityData.active !== undefined ? cityData.active : true,
      });
    }
  }, [cityData, mode]);

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

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.state) {
      toast.error("Please fill all required fields");
      return;
    }

    const submitData = {
      ...formData,
    };

    if (mode === "edit" && cityData) {
      submitData._id = cityData._id;
    }

    await onSubmit(submitData);
  };

  return (
    <Box component="form" onSubmit={handleSubmitForm}>
      <Typography variant="h5" mb={3}>
        {mode === "add" ? "Add City" : "Edit City"}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          fullWidth
          required
          label="City Name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          placeholder="Enter city name"
        />

        <Autocomplete
          fullWidth
          required
          options={stateOptions}
          value={
            formData.state
              ? stateOptions.find((s) => s.label === formData.state) || null
              : null
          }
          onChange={(e, selectedOption) =>
            handleInputChange("state", selectedOption?.label || "")
          }
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="State" placeholder="Select state" />
          )}
        />

        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Enter description (optional)"
          multiline
          rows={3}
        />

        <FormControlLabel
          control={
            <Switch
              checked={formData.active}
              onChange={(e) => handleInputChange("active", e.target.checked)}
            />
          }
          label={formData.active ? "Active" : "Inactive"}
        />

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
          {onCancel && (
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="contained" color="primary">
            {mode === "add" ? "Add City" : "Update City"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CityForm;