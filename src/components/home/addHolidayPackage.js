import React, { useEffect, useState, useCallback } from "react";
import "../../assets/css/app.min.css";
import "../../assets/css/bootstrap.min.css";
import {
  Box,
  TextField,
  Autocomplete,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import { Toaster, toast } from "react-hot-toast";

// Constants
const SELECT_TYPE = [{ label: "Holiday" }, { label: "Pilgrimage" }];
const ITINERARY_TYPES = [
  { label: "Vehicle", value: "vehicle" },
  { label: "Hotel", value: "Hotel" },
  { label: "Activities", value: "activities" },
];
const PACKAGE_TYPES = [
  { label: "India" },
  { label: "International" },
  { label: "Himachal Holiday" },
];
const CANCELLATION_TYPES = [
  { label: "Refundable", value: "Refundable" },
  { label: "Non-Refundable", value: "Non-Refundable" },
];
const ROOM_LIMIT_OPTIONS = Array.from({ length: 6 }, (_, i) => ({
  label: i + 1,
  value: i + 1,
}));

const initialPackageData = {
  packageName: "",
  roomLimit: 0,
  priceMarkup: 0,
  selectType: "",
  uniqueId: "",
  packageType: "",
  destinationCity: [],
  startCity: "",
  images: null,
  highlights: "",
  status: false,
  createPilgrimage: false,
  displayHomepage: false,
  partialPayment: false,
  recommendedPackage: false,
  includes: "",
  excludes: "",
  paymentDueDays: 0,
  partialPaymentPercentage: 0,
  cancellationPolicyType: "",
  availableVehicles: [],
  inflatedPrice: 0,
};

const initialPackageDuration = {
  days: 0,
  nights: 0,
};

const initialDayItinerary = {
  type: "",
  iti_id: "",
  city: "",
  details: "",
  title: "",
  description: "",
};

const AddHolidayPackage = () => {
  const [packageData, setPackageData] = useState(initialPackageData);
  const [packageDuration, setPackageDuration] = useState(
    initialPackageDuration
  );
  const [availableVehicle, setAvailableVehicle] = useState({});
  const [destinationCityOptions, setDestinationCityOptions] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleDataOptions, setVehicleDataOptions] = useState([]);
  const [vehicleDataITOptions, setVehicleDataITOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [hotelDataOptions, setHotelDataOptions] = useState([]);
  const [hotelData, setHotelData] = useState([]);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [newActivities, setNewActivities] = useState({});

  // Initialize days when package duration changes
  useEffect(() => {
    if (packageDuration.days > 0) {
      const daysArray = Array.from(
        { length: packageDuration.days },
        (_, i) => ({
          dayNo: i + 1,
          activities: [],
        })
      );
      setItineraryDays(daysArray);
      // Initialize empty activities for each day
      const initialActivities = {};
      for (let i = 0; i < packageDuration.days; i++) {
        initialActivities[i] = { ...initialDayItinerary };
      }
      setNewActivities(initialActivities);
    } else {
      setItineraryDays([]);
      setNewActivities({});
    }
  }, [packageDuration.days]);

  // API Calls
  const fetchVehicles = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3232/inventries/vehicle");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setVehicleData(data?.vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  }, []);

  const fetchCities = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3232/inventries/getCity");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const cityOptions = data?.data?.map((item) => ({
        label: item,
        value: item,
      }));
      setDestinationOptions(cityOptions);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  }, []);

  const fetchHotels = useCallback(async () => {
    if (!selectedCity) return;
    try {
      const response = await fetch(
        `http://localhost:3232/inventries/getHotelList?city=${selectedCity}`,
        { headers: { "Content-Type": "application/json" } }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const hotelOptions = data?.data?.map((item) => ({
        label: item?.hotelName,
        value: item?.hotelName,
      }));
      setHotelData(data?.data);
      setHotelDataOptions(hotelOptions);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchCities();
    fetchVehicles();
  }, [fetchCities, fetchVehicles]);

  useEffect(() => {
    if (packageData.destinationCity?.length) {
      const cityOptions = packageData.destinationCity.map((item) => ({
        label: item,
        value: item,
      }));
      setDestinationCityOptions(cityOptions);
    }
  }, [packageData.destinationCity]);

  useEffect(() => {
    if (vehicleData?.length) {
      const vehicleOptions = vehicleData.map((item) => ({
        label: item?.vehicleType,
        value: item?.vehicleType,
        id: item?._id,
      }));
      setVehicleDataOptions(vehicleOptions);
    }
  }, [vehicleData]);

  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Handlers
  const handlePackageChange = (key, value) => {
    setPackageData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutocompleteChange = (key, selectedOption) => {
    setPackageData((prev) => ({
      ...prev,
      [key]: selectedOption?.label || "",
    }));
  };

  const handleImageChange = (event) => {
    setPackageData((prev) => ({
      ...prev,
      images: [...event.target.files],
    }));
  };

  const handleSwitchChange = (key) => {
    setPackageData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filterOptions = (options, state) => {
    const selectedValues = packageData.destinationCity || [];
    return options.filter((option) => !selectedValues.includes(option.label));
  };

  const handleAddAvailableVehicle = () => {
    if (!availableVehicle.vehicleType || !availableVehicle.price) return;

    const newVehicle = {
      ...availableVehicle,
      id: availableVehicle._id,
    };

    setPackageData((prev) => ({
      ...prev,
      availableVehicles: [...prev.availableVehicles, newVehicle],
    }));

    setVehicleDataITOptions((prev) => [
      ...prev,
      {
        label: availableVehicle.vehicleType,
        value: availableVehicle.vehicleType,
        id: availableVehicle._id,
      },
    ]);

    setAvailableVehicle({});
  };

  const handleRemoveAvailableVehicle = (index) => {
    setPackageData((prev) => ({
      ...prev,
      availableVehicles: prev.availableVehicles.filter((_, i) => i !== index),
    }));
    setVehicleDataITOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleActivityChange = (dayIndex, key, value) => {
    setNewActivities((prev) => ({
      ...prev,
      [dayIndex]: {
        ...(prev[dayIndex] || initialDayItinerary),
        [key]: value,
      },
    }));
  };

  const handleAddActivity = (dayIndex) => {
    const activity = newActivities[dayIndex];
    if (!activity?.type) return;

    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].activities = [
      ...updatedDays[dayIndex].activities,
      activity,
    ];
    setItineraryDays(updatedDays);

    // Clear this day's activity form
    setNewActivities((prev) => ({
      ...prev,
      [dayIndex]: { ...initialDayItinerary },
    }));
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (_, i) => i !== activityIndex
    );
    setItineraryDays(updatedDays);
  };

  const renderDayItinerary = (day, dayIndex) => {
    const currentActivity = newActivities[dayIndex] || initialDayItinerary;

    return (
      <div key={dayIndex} className="mb-4 p-3 border rounded">
        <h5>Day {day.dayNo}</h5>

        {/* Existing Activities */}
        {day.activities.map((activity, activityIndex) => (
          <div key={activityIndex} className="mb-2 p-2 bg-light rounded">
            <div className="d-flex justify-content-between">
              <div>
                <strong>{activity.type}:</strong> {activity.details}
                {activity.city && ` (${activity.city})`}
              </div>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemoveActivity(dayIndex, activityIndex)}
              >
                Remove
              </button>
            </div>
            {activity.title && <div>Title: {activity.title}</div>}
            {activity.description && (
              <div>Description: {activity.description}</div>
            )}
          </div>
        ))}

        {/* Add New Activity Form */}
        <div className="mt-3">
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Activity Type</label>
              <Autocomplete
                options={ITINERARY_TYPES}
                value={
                  currentActivity.type
                    ? {
                        label: currentActivity.type,
                        value: currentActivity.type,
                      }
                    : null
                }
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Type" />
                )}
                onChange={(e, selectedOption) =>
                  handleActivityChange(
                    dayIndex,
                    "type",
                    selectedOption?.label || ""
                  )
                }
              />
            </div>

            {currentActivity.type === "Vehicle" && (
              <div className="col-md-4">
                <label className="form-label">Vehicle</label>
                <Autocomplete
                  options={vehicleDataITOptions}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Vehicle" />
                  )}
                  onChange={(e, selectedOption) => {
                    const vehicle = vehicleData.find(
                      (item) => item.vehicleType === selectedOption?.label
                    );
                    if (vehicle) {
                      handleActivityChange(dayIndex, "iti_id", vehicle._id);
                      handleActivityChange(
                        dayIndex,
                        "details",
                        selectedOption?.label
                      );
                    }
                  }}
                />
              </div>
            )}

            {currentActivity.type === "Hotel" && (
              <>
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <Autocomplete
                    options={destinationCityOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select City" />
                    )}
                    onChange={(e, selectedOption) => {
                      handleActivityChange(
                        dayIndex,
                        "city",
                        selectedOption?.label || ""
                      );
                      setSelectedCity(selectedOption?.label || "");
                    }}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Hotel</label>
                  <Autocomplete
                    options={hotelDataOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Hotel" />
                    )}
                    onChange={(e, selectedOption) => {
                      const hotel = hotelData.find(
                        (item) => item.hotelName === selectedOption?.label
                      );
                      if (hotel) {
                        handleActivityChange(dayIndex, "iti_id", hotel._id);
                        handleActivityChange(
                          dayIndex,
                          "details",
                          selectedOption?.label
                        );
                      }
                    }}
                  />
                </div>
              </>
            )}

            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={currentActivity.title || ""}
                onChange={(e) =>
                  handleActivityChange(dayIndex, "title", e.target.value)
                }
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                value={currentActivity.description || ""}
                onChange={(e) =>
                  handleActivityChange(dayIndex, "description", e.target.value)
                }
              />
            </div>

            <div className="col-md-12">
              <button
                className="btn btn-primary"
                onClick={() => handleAddActivity(dayIndex)}
                disabled={!currentActivity.type}
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append images
      packageData.images?.forEach((image) => {
        formData.append("files", image);
      });

      // Structure itinerary data to match backend expectations
      const formattedItinerary = itineraryDays.map((day) => ({
        dayNo: day.dayNo,
        dayItinerary: day.activities,
      }));

      // Append other data
      Object.entries(packageData).forEach(([key, value]) => {
        if (key !== "images") {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : value
          );
        }
      });

      formData.append("itinerary", JSON.stringify(formattedItinerary));
      formData.append("packageDuration", JSON.stringify(packageDuration));

      const response = await fetch(
        "http://localhost:3232/holidays/createPackage",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        // Reset form
        setPackageData(initialPackageData);
        setPackageDuration(initialPackageDuration);
        setItineraryDays([]);
        setAvailableVehicle({});
        setVehicleDataITOptions([]);
        setNewActivities({});

        toast.success("Holiday Package Created");
      } else {
        throw new Error("Failed to create package");
      }
    } catch (error) {
      console.error("Error submitting package:", error);
      toast.error("Failed to create package");
    }
  };

  return (
    <div className="col-lg-12">
      <div className="card" style={{ margin: "15px", padding: "15px" }}>
        <div>
          <div
            className="card-header align-items-center d-flex"
            style={{ borderTop: "1px solid #e9ebec" }}
          >
            <h1
              className="card-title flex-grow-1"
              style={{ marginBottom: "0px" }}
            >
              Package details
            </h1>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-sm-4">
                <label className="form-label">Select Type</label>
                <Autocomplete
                  options={SELECT_TYPE}
                  value={
                    packageData.selectType
                      ? {
                          label: packageData.selectType,
                          value: packageData.selectType,
                        }
                      : null
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Type" />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("selectType", selectedOption)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Unique Id</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.uniqueId}
                  onChange={(e) =>
                    handlePackageChange("uniqueId", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Package Type</label>
                <Autocomplete
                  options={PACKAGE_TYPES}
                  value={
                    packageData.packageType
                      ? {
                          label: packageData.packageType,
                          value: packageData.packageType,
                        }
                      : null
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Package Type" />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("packageType", selectedOption)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Package Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.packageName}
                  onChange={(e) =>
                    handlePackageChange("packageName", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Destination Cities</label>
                <Autocomplete
                  multiple
                  options={destinationOptions}
                  value={packageData.destinationCity.map((city) => ({
                    label: city,
                    value: city,
                  }))}
                  getOptionLabel={(option) => option.label}
                  filterOptions={filterOptions}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Destination Cities" />
                  )}
                  onChange={(e, newValue) => {
                    const destinations = newValue.map((item) => item.label);
                    handlePackageChange("destinationCity", destinations);
                  }}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Start City</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.startCity}
                  onChange={(e) =>
                    handlePackageChange("startCity", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">No of Days</label>
                <input
                  type="number"
                  className="form-control"
                  value={packageDuration.days || ""}
                  onChange={(e) => {
                    const days = e.target.value ? parseInt(e.target.value) : 0;
                    setPackageDuration({
                      days,
                      nights: days > 0 ? days - 1 : 0,
                    });
                  }}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">No of Nights</label>
                <input
                  type="number"
                  className="form-control"
                  disabled
                  value={packageDuration.nights || 0}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Banner Image</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Highlight</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.highlights}
                  onChange={(e) =>
                    handlePackageChange("highlights", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Includes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.includes}
                  onChange={(e) =>
                    handlePackageChange("includes", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Excludes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.excludes}
                  onChange={(e) =>
                    handlePackageChange("excludes", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Status</label>
                <FormControlLabel
                  control={
                    <Switch
                      checked={packageData.status}
                      onChange={() => handleSwitchChange("status")}
                    />
                  }
                  label={packageData.status ? "Active" : "Inactive"}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Create Pilgrimage</label>
                <FormControlLabel
                  control={
                    <Switch
                      checked={packageData.createPilgrimage}
                      onChange={() => handleSwitchChange("createPilgrimage")}
                    />
                  }
                  label={packageData.createPilgrimage ? "Yes" : "No"}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Display Homepage</label>
                <FormControlLabel
                  control={
                    <Switch
                      checked={packageData.displayHomepage}
                      onChange={() => handleSwitchChange("displayHomepage")}
                    />
                  }
                  label={packageData.displayHomepage ? "Yes" : "No"}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Partial Payment</label>
                <FormControlLabel
                  control={
                    <Switch
                      checked={packageData.partialPayment}
                      onChange={() => handleSwitchChange("partialPayment")}
                    />
                  }
                  label={packageData.partialPayment ? "Yes" : "No"}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Recommended Package</label>
                <FormControlLabel
                  control={
                    <Switch
                      checked={packageData.recommendedPackage}
                      onChange={() => handleSwitchChange("recommendedPackage")}
                    />
                  }
                  label={packageData.recommendedPackage ? "Yes" : "No"}
                />
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="row g-3">
              <div className="col-sm-4">
                <label className="form-label">Room limits</label>
                <Autocomplete
                  options={ROOM_LIMIT_OPTIONS}
                  value={
                    packageData.roomLimit
                      ? {
                          label: packageData.roomLimit,
                          value: packageData.roomLimit,
                        }
                      : null
                  }
                  getOptionLabel={(option) => option.label.toString()}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Room Limit" />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("roomLimit", selectedOption)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Inflated Price (%)</label>
                <input
                  type="number"
                  max={100}
                  value={packageData.inflatedPrice || ""}
                  className="form-control"
                  onChange={(e) =>
                    handlePackageChange("inflatedPrice", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Price Markup (%)</label>
                <input
                  type="number"
                  max={100}
                  value={packageData.priceMarkup || ""}
                  className="form-control"
                  onChange={(e) =>
                    handlePackageChange("priceMarkup", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Payment Due (Days)</label>
                <input
                  type="number"
                  className="form-control"
                  value={packageData.paymentDueDays || ""}
                  onChange={(e) =>
                    handlePackageChange("paymentDueDays", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Partial Payment (%)</label>
                <input
                  type="number"
                  max={100}
                  value={packageData.partialPaymentPercentage || ""}
                  className="form-control"
                  onChange={(e) =>
                    handlePackageChange(
                      "partialPaymentPercentage",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Cancellation Policy Type</label>
                <Autocomplete
                  options={CANCELLATION_TYPES}
                  value={
                    packageData.cancellationPolicyType
                      ? {
                          label: packageData.cancellationPolicyType,
                          value: packageData.cancellationPolicyType,
                        }
                      : null
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Cancellation Policy Type"
                    />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange(
                      "cancellationPolicyType",
                      selectedOption
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="live-preview">
              {packageData.availableVehicles?.map((item, index) => (
                <div className="row g-3" key={index}>
                  <div className="col-sm-5">
                    <label className="form-label">Vehicle</label>
                    <Autocomplete
                      disabled
                      value={{
                        label: item.vehicleType,
                        value: item.vehicleType,
                      }}
                      options={vehicleDataOptions}
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                  <div className="col-sm-5">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      value={item.price}
                      disabled
                    />
                  </div>
                  <div className="col-sm-2 d-flex justify-content-start align-items-end">
                    <span
                      className="btn btn-danger text-center"
                      onClick={() => handleRemoveAvailableVehicle(index)}
                    >
                      Remove
                    </span>
                  </div>
                </div>
              ))}

              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">Select Vehicle</label>
                  <Autocomplete
                    options={vehicleDataOptions}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select Vehicle" />
                    )}
                    onChange={(e, selectedOption) => {
                      const vehicle = vehicleData.find(
                        (item) => item._id === selectedOption?.id
                      );
                      if (vehicle) {
                        setAvailableVehicle({
                          ...vehicle,
                          price: vehicle.rate || 0,
                        });
                      }
                    }}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={availableVehicle.price || ""}
                    onChange={(e) =>
                      setAvailableVehicle((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="col-sm-4">
                <button
                  className="btn btn-link"
                  onClick={handleAddAvailableVehicle}
                  disabled={
                    !availableVehicle.vehicleType || !availableVehicle.price
                  }
                >
                  Add Available Vehicle
                </button>
              </div>
            </div>
          </div>

          <div className="card-body">
            <h4 className="card-title">Itinerary</h4>
            {itineraryDays.length > 0 ? (
              itineraryDays.map((day, index) => renderDayItinerary(day, index))
            ) : (
              <div className="alert alert-info">
                Please enter the number of days to create itinerary
              </div>
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
          <button className="btn btn-primary btn-border" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AddHolidayPackage;
