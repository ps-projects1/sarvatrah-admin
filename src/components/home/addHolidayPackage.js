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
const PACKAGE_TYPES = [
  { label: "family", value: "family" },
  { label: "honeymoon", value: "honeymoon" },
  { label: "adventure", value: "adventure" },
  { label: "luxury", value: "luxury" },
  { label: "budget", value: "budget" },
  { label: "group", value: "group" },
  { label: "custom", value: "custom" },
];

const SELECT_TYPES = [
  { label: "domestic", value: "domestic" },
  { label: "international", value: "international" },
  { label: "both", value: "both" },
];

const ACTIVITY_TYPES = [
  { label: "Sightseeing", value: "Sightseeing" },
  { label: "Adventure", value: "Adventure" },
  { label: "Leisure", value: "Leisure" },
  { label: "Cultural", value: "Cultural" },
  { label: "Other", value: "Other" },
];

const TRANSPORT_TYPES = [
  { label: "Private Cab", value: "Private Cab" },
  { label: "Flight", value: "Flight" },
  { label: "Train", value: "Train" },
  { label: "Bus", value: "Bus" },
  { label: "Cruise", value: "Cruise" },
  { label: "Other", value: "Other" },
];

const MEAL_OPTIONS = [
  { label: "Breakfast", value: "Breakfast" },
  { label: "Lunch", value: "Lunch" },
  { label: "Dinner", value: "Dinner" },
  { label: "Snacks", value: "Snacks" },
  { label: "Other", value: "Other" },
];

const CANCELLATION_TYPES = [
  { label: "refundble", value: "refundble" },
  { label: "non-refundble", value: "non-refundble" },
];

const initialPackageData = {
  objectType: "holidays",
  packageName: "",
  selectType: "",
  uniqueId: "",
  packageType: "",
  destinationCity: [],
  startCity: "",
  highlights: "",
  status: false,
  createPilgrimage: false,
  displayHomepage: false,
  partialPayment: false,
  recommendedPackage: false,
  include: "",
  exclude: "",
  paymentDueDays: 0,
  partialPaymentPercentage: 0,
  cancellationPolicyType: "non-refundble",
  availableVehicle: [],
  priceMarkup: 0,
  inflatedPercentage: 0,
  roomLimit: 1,
  inventry: 0,
  active: true,
};

const initialPackageDuration = {
  days: 0,
  nights: 0,
};

const initialDayItinerary = {
  dayNo: 0,
  title: "",
  subtitle: "",
  description: "",
  stay: "",
  mealsIncluded: [],
  transport: {
    type: "",
    details: "",
  },
  placesToVisit: [],
  activities: [],
  notes: "",
};

const initialActivity = {
  type: "",
  title: "",
  description: "",
  duration: "",
  image: {
    filename: "",
    path: "",
    mimetype: "",
  },
};

const AddHolidayPackage = () => {
  const [packageData, setPackageData] = useState(initialPackageData);
  const [packageDuration, setPackageDuration] = useState(initialPackageDuration);
  const [images, setImages] = useState([]);
  const [themeImage, setThemeImage] = useState(null);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [newDayItinerary, setNewDayItinerary] = useState(initialDayItinerary);
  const [newActivity, setNewActivity] = useState(initialActivity);
  const [availableVehicle, setAvailableVehicle] = useState({
    vehicleType: "",
    price: 0,
    rate: 0,
    seatLimit: 0,
    vehicle_id: "",
    brandName: "",
    modelName: "",
  });

  // Initialize days when package duration changes
  useEffect(() => {
    if (packageDuration.days > 0) {
      const daysArray = Array.from({ length: packageDuration.days }, (_, i) => ({
        ...initialDayItinerary,
        dayNo: i + 1,
      }));
      setItineraryDays(daysArray);
    } else {
      setItineraryDays([]);
    }
  }, [packageDuration.days]);

  // Calculate nights automatically
  useEffect(() => {
    if (packageDuration.days > 0) {
      setPackageDuration(prev => ({
        ...prev,
        nights: packageDuration.days > 0 ? packageDuration.days - 1 : 0
      }));
    }
  }, [packageDuration.days]);

  // Fetch cities from API
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

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  // Handlers
  const handlePackageChange = (key, value) => {
    setPackageData((prev) => ({ ...prev, [key]: value }));
  };

  const handleAutocompleteChange = (key, selectedOption) => {
    setPackageData((prev) => ({
      ...prev,
      [key]: selectedOption?.value || "",
    }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleThemeImageChange = (e) => {
    setThemeImage(e.target.files[0]);
  };

  const handleSwitchChange = (key) => {
    setPackageData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleDayItineraryChange = (dayIndex, key, value) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex][key] = value;
    setItineraryDays(updatedDays);
  };

  const handleTransportChange = (dayIndex, key, value) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].transport[key] = value;
    setItineraryDays(updatedDays);
  };

  const handleAddPlaceToVisit = (dayIndex, place) => {
    if (!place) return;
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].placesToVisit.push(place);
    setItineraryDays(updatedDays);
    setNewDayItinerary(prev => ({ ...prev, placesToVisit: [] }));
  };

  const handleRemovePlaceToVisit = (dayIndex, placeIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].placesToVisit = updatedDays[dayIndex].placesToVisit.filter(
      (_, i) => i !== placeIndex
    );
    setItineraryDays(updatedDays);
  };

  const handleAddMeal = (dayIndex, meal) => {
    if (!meal) return;
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].mealsIncluded.push(meal);
    setItineraryDays(updatedDays);
    setNewDayItinerary(prev => ({ ...prev, mealsIncluded: [] }));
  };

  const handleRemoveMeal = (dayIndex, mealIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].mealsIncluded = updatedDays[dayIndex].mealsIncluded.filter(
      (_, i) => i !== mealIndex
    );
    setItineraryDays(updatedDays);
  };

  const handleActivityChange = (key, value) => {
    setNewActivity(prev => ({ ...prev, [key]: value }));
  };

  const handleAddActivity = (dayIndex) => {
    if (!newActivity.type) return;
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].activities.push({ ...newActivity });
    setItineraryDays(updatedDays);
    setNewActivity(initialActivity);
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].activities = updatedDays[dayIndex].activities.filter(
      (_, i) => i !== activityIndex
    );
    setItineraryDays(updatedDays);
  };

  const handleAddAvailableVehicle = () => {
    if (!availableVehicle.vehicleType || !availableVehicle.price) return;
    
    setPackageData(prev => ({
      ...prev,
      availableVehicle: [...prev.availableVehicle, availableVehicle]
    }));
    
    setAvailableVehicle({
      vehicleType: "",
      price: 0,
      rate: 0,
      seatLimit: 0,
      vehicle_id: "",
      brandName: "",
      modelName: "",
    });
  };

  const handleRemoveAvailableVehicle = (index) => {
    setPackageData(prev => ({
      ...prev,
      availableVehicle: prev.availableVehicle.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      // Append images
      images.forEach(image => {
        formData.append("images", image);
      });

      // Append theme image
      if (themeImage) {
        formData.append("themeImg", themeImage);
      }

      // Append package data
      formData.append("packageData", JSON.stringify({
        ...packageData,
        packageDuration
      }));

      // Append itinerary
      formData.append("itinerary", JSON.stringify(itineraryDays));

      const response = await fetch("http://localhost:3232/holidays/createPackage", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Reset form
        setPackageData(initialPackageData);
        setPackageDuration(initialPackageDuration);
        setItineraryDays([]);
        setImages([]);
        setThemeImage(null);
        
        toast.success("Holiday Package Created Successfully!");
      } else {
        throw new Error("Failed to create package");
      }
    } catch (error) {
      console.error("Error submitting package:", error);
      toast.error("Failed to create package");
    }
  };

  const renderDayItinerary = (day, dayIndex) => {
    return (
      <div key={dayIndex} className="mb-4 p-3 border rounded">
        <h5>Day {day.dayNo}</h5>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={day.title || ""}
              onChange={(e) => handleDayItineraryChange(dayIndex, "title", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Subtitle</label>
            <input
              type="text"
              className="form-control"
              value={day.subtitle || ""}
              onChange={(e) => handleDayItineraryChange(dayIndex, "subtitle", e.target.value)}
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              rows="3"
              value={day.description || ""}
              onChange={(e) => handleDayItineraryChange(dayIndex, "description", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Stay</label>
            <input
              type="text"
              className="form-control"
              value={day.stay || ""}
              onChange={(e) => handleDayItineraryChange(dayIndex, "stay", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Notes</label>
            <input
              type="text"
              className="form-control"
              value={day.notes || ""}
              onChange={(e) => handleDayItineraryChange(dayIndex, "notes", e.target.value)}
            />
          </div>
        </div>

        {/* Transport Section */}
        <div className="border p-3 mb-3">
          <h6>Transport</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Transport Type</label>
              <Autocomplete
                options={TRANSPORT_TYPES}
                value={TRANSPORT_TYPES.find(opt => opt.value === day.transport.type) || null}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Transport Type" />
                )}
                onChange={(e, selectedOption) =>
                  handleTransportChange(dayIndex, "type", selectedOption?.value || "")
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Transport Details</label>
              <input
                type="text"
                className="form-control"
                value={day.transport.details || ""}
                onChange={(e) => handleTransportChange(dayIndex, "details", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Meals Included Section */}
        <div className="border p-3 mb-3">
          <h6>Meals Included</h6>
          <div className="mb-2">
            {day.mealsIncluded.map((meal, mealIndex) => (
              <span key={mealIndex} className="badge bg-primary me-2">
                {meal}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => handleRemoveMeal(dayIndex, mealIndex)}
                  aria-label="Close"
                ></button>
              </span>
            ))}
          </div>
          <div className="row g-3">
            <div className="col-md-8">
              <Autocomplete
                options={MEAL_OPTIONS}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Select Meal" />
                )}
                onChange={(e, selectedOption) => {
                  if (selectedOption) {
                    handleAddMeal(dayIndex, selectedOption.value);
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Places to Visit Section */}
        <div className="border p-3 mb-3">
          <h6>Places to Visit</h6>
          <div className="mb-2">
            {day.placesToVisit.map((place, placeIndex) => (
              <span key={placeIndex} className="badge bg-success me-2">
                {place}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-2"
                  onClick={() => handleRemovePlaceToVisit(dayIndex, placeIndex)}
                  aria-label="Close"
                ></button>
              </span>
            ))}
          </div>
          <div className="row g-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control"
                placeholder="Add a place to visit"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value) {
                    handleAddPlaceToVisit(dayIndex, e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Activities Section */}
        <div className="border p-3">
          <h6>Activities</h6>
          {day.activities.map((activity, activityIndex) => (
            <div key={activityIndex} className="card mb-2">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h6>{activity.title}</h6>
                    <p>{activity.description}</p>
                    <small className="text-muted">Type: {activity.type}</small>
                    {activity.duration && <small className="text-muted ms-2">Duration: {activity.duration}</small>}
                  </div>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveActivity(dayIndex, activityIndex)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-3">
            <h6>Add New Activity</h6>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Activity Type</label>
                <Autocomplete
                  options={ACTIVITY_TYPES}
                  value={ACTIVITY_TYPES.find(opt => opt.value === newActivity.type) || null}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Activity Type" />
                  )}
                  onChange={(e, selectedOption) =>
                    handleActivityChange("type", selectedOption?.value || "")
                  }
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={newActivity.title || ""}
                  onChange={(e) => handleActivityChange("title", e.target.value)}
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-control"
                  value={newActivity.duration || ""}
                  onChange={(e) => handleActivityChange("duration", e.target.value)}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={newActivity.description || ""}
                  onChange={(e) => handleActivityChange("description", e.target.value)}
                />
              </div>

              <div className="col-md-12">
                <button
                  className="btn btn-primary"
                  onClick={() => handleAddActivity(dayIndex)}
                  disabled={!newActivity.type}
                >
                  Add Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
                <label className="form-label">Package Type</label>
                <Autocomplete
                  options={PACKAGE_TYPES}
                  value={PACKAGE_TYPES.find(opt => opt.value === packageData.packageType) || null}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Package Type" />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("packageType", selectedOption)
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Select Type</label>
                <Autocomplete
                  options={SELECT_TYPES}
                  value={SELECT_TYPES.find(opt => opt.value === packageData.selectType) || null}
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
                <label className="form-label">Unique ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.uniqueId}
                  onChange={(e) => handlePackageChange("uniqueId", e.target.value)}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Package Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.packageName}
                  onChange={(e) => handlePackageChange("packageName", e.target.value)}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Start City</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.startCity}
                  onChange={(e) => handlePackageChange("startCity", e.target.value)}
                />
              </div>

              <div className="col-sm-12">
                <label className="form-label">Destination Cities</label>
                <Autocomplete
                  multiple
                  options={destinationOptions}
                  value={packageData.destinationCity.map(city => ({ label: city, value: city }))}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Destination Cities" />
                  )}
                  onChange={(e, newValue) => {
                    const destinations = newValue.map(item => item.value);
                    handlePackageChange("destinationCity", destinations);
                  }}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">No of Days</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={packageDuration.days || ""}
                  onChange={(e) => {
                    const days = e.target.value ? parseInt(e.target.value) : 0;
                    setPackageDuration(prev => ({
                      ...prev,
                      days,
                      nights: days > 0 ? days - 1 : 0
                    }));
                  }}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">No of Nights</label>
                <input
                  type="number"
                  className="form-control"
                  value={packageDuration.nights || 0}
                  disabled
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Room Limit</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={packageData.roomLimit}
                  onChange={(e) => handlePackageChange("roomLimit", parseInt(e.target.value))}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Theme Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleThemeImageChange}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Additional Images</label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Inventory Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={packageData.inventry}
                  onChange={(e) => handlePackageChange("inventry", parseInt(e.target.value))}
                />
              </div>

              <div className="col-sm-12">
                <label className="form-label">Highlights</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.highlights}
                  onChange={(e) => handlePackageChange("highlights", e.target.value)}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Includes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.include}
                  onChange={(e) => handlePackageChange("include", e.target.value)}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Excludes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.exclude}
                  onChange={(e) => handlePackageChange("exclude", e.target.value)}
                />
              </div>

              <div className="col-sm-3">
                <label className="form-label">Price Markup (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={packageData.priceMarkup}
                  onChange={(e) => handlePackageChange("priceMarkup", parseFloat(e.target.value))}
                />
              </div>

              <div className="col-sm-3">
                <label className="form-label">Inflated Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={packageData.inflatedPercentage}
                  onChange={(e) => handlePackageChange("inflatedPercentage", parseFloat(e.target.value))}
                />
              </div>

              <div className="col-sm-3">
                <label className="form-label">Payment Due Days</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={packageData.paymentDueDays}
                  onChange={(e) => handlePackageChange("paymentDueDays", parseInt(e.target.value))}
                />
              </div>

              <div className="col-sm-3">
                <label className="form-label">Partial Payment (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="form-control"
                  value={packageData.partialPaymentPercentage}
                  onChange={(e) => handlePackageChange("partialPaymentPercentage", parseFloat(e.target.value))}
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Cancellation Policy</label>
                <Autocomplete
                  options={CANCELLATION_TYPES}
                  value={CANCELLATION_TYPES.find(opt => opt.value === packageData.cancellationPolicyType) || null}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Select Cancellation Policy" />
                  )}
                  onChange={(e, selectedOption) =>
                    handleAutocompleteChange("cancellationPolicyType", selectedOption)
                  }
                />
              </div>

              <div className="col-sm-2">
                <label className="form-label">Status</label>
                <div>
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
              </div>

              <div className="col-sm-2">
                <label className="form-label">Create Pilgrimage</label>
                <div>
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
              </div>

              <div className="col-sm-2">
                <label className="form-label">Display Homepage</label>
                <div>
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
              </div>

              <div className="col-sm-2">
                <label className="form-label">Partial Payment</label>
                <div>
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
              </div>

              <div className="col-sm-2">
                <label className="form-label">Recommended</label>
                <div>
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
          </div>

          {/* Available Vehicles Section */}
          <div className="card-body">
            <h4 className="card-title">Available Vehicles</h4>
            {packageData.availableVehicle.map((vehicle, index) => (
              <div key={index} className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label">Vehicle Type</label>
                  <input
                    type="text"
                    className="form-control"
                    value={vehicle.vehicleType}
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={vehicle.price}
                    disabled
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Seat Limit</label>
                  <input
                    type="number"
                    className="form-control"
                    value={vehicle.seatLimit}
                    disabled
                  />
                </div>
                <div className="col-md-2 d-flex align-items-end">
                  <button
                    className="btn btn-danger w-100"
                    onClick={() => handleRemoveAvailableVehicle(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Vehicle Type</label>
                <input
                  type="text"
                  className="form-control"
                  value={availableVehicle.vehicleType}
                  onChange={(e) => setAvailableVehicle(prev => ({
                    ...prev,
                    vehicleType: e.target.value
                  }))}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={availableVehicle.price}
                  onChange={(e) => setAvailableVehicle(prev => ({
                    ...prev,
                    price: parseFloat(e.target.value)
                  }))}
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Seat Limit</label>
                <input
                  type="number"
                  min="1"
                  className="form-control"
                  value={availableVehicle.seatLimit}
                  onChange={(e) => setAvailableVehicle(prev => ({
                    ...prev,
                    seatLimit: parseInt(e.target.value)
                  }))}
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAddAvailableVehicle}
                  disabled={!availableVehicle.vehicleType || !availableVehicle.price}
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>

          {/* Itinerary Section */}
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