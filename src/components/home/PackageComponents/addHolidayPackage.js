import React, { useEffect, useState } from "react";
import "../../../assets/css/app.min.css";
import "../../../assets/css/bootstrap.min.css";
import {
  TextField,
  Autocomplete,
  FormControlLabel,
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Toaster, toast } from "react-hot-toast";
import DayItinerary from "./DayItinerary";
import axios from "axios";

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

// Initial States
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
  refundablePercentage: 0,
  refundableDays: 0,
  availableVehicle: [],
  priceMarkup: 0,
  inflatedPercentage: 0,
  roomLimit: 1,
  inventry: 0,
  active: true,
};

const initialPackageDuration = {
  days: 1,
  nights: 0,
};

const initialDayItinerary = {
  dayNo: 0,
  title: "",
  subtitle: "",
  description: "",
  stay: false,
  mealsIncluded: [],
  transport: {
    type: "",
    details: "",
  },
  placesToVisit: [],
  activities: [],
  hotels: [],
  notes: "",
  sections: [],
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

const AddHolidayPackage = ({ editPackageData, onBack }) => {
  const [packageData, setPackageData] = useState(initialPackageData);
  const [packageDuration, setPackageDuration] = useState(
    initialPackageDuration
  );
  const [images, setImages] = useState([]);
  const [themeImage, setThemeImage] = useState(null);
  const [itineraryDays, setItineraryDays] = useState([]);
  const [newActivity, setNewActivity] = useState(initialActivity);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [destinationCities, setDestinationCities] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState(null);
  const [selectedDestinationStates, setSelectedDestinationStates] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);

  const [availableVehicle, setAvailableVehicle] = useState({
    vehicleType: "",
    price: 0,
    rate: 0,
    seatLimit: 0,
    vehicle_id: "",
    brandName: "",
    modelName: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch states
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/state/get-state`
).then((res) => {
      setStates(res.data.data || []);
    });
  }, []);

  // Fetch vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/vehicle/get-vehicles`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        if (response.data.status) {
          // Filter only active vehicles
          const activeVehicles = response.data.data.filter(v => v.active);
          setVehiclesList(activeVehicles);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to fetch vehicles");
      }
    };
    fetchVehicles();
  }, []);

  // When editing, populate all fields
useEffect(() => {
  if (editPackageData) {
    // 1️⃣ Set basic package data
    setPackageData({
      ...initialPackageData,
      ...editPackageData, 
      destinationCity: editPackageData.destinationCity || [],
      availableVehicle: editPackageData.availableVehicle || [],
      active: editPackageData.active,
      status: editPackageData.status,
      createPilgrimage: editPackageData.createPilgrimage,
      displayHomepage: editPackageData.displayHomepage,
      recommendedPackage: editPackageData.recommendedPackage,
      partialPayment: editPackageData.partialPayment
    });

    // 2️⃣ Set duration
    if (editPackageData.packageDuration) {
      setPackageDuration({
        days: editPackageData.packageDuration.days,
        nights: editPackageData.packageDuration.nights,
      });
    }

    // 3️⃣ Set itinerary
    if (Array.isArray(editPackageData.itinerary)) {
      setItineraryDays(editPackageData.itinerary);
    }

    // 4️⃣ Pre-fill destination states (now supports multiple)
    if (editPackageData.destinationStateIds && Array.isArray(editPackageData.destinationStateIds)) {
      setSelectedDestinationStates(editPackageData.destinationStateIds);
    } else if (editPackageData.destinationStateId) {
      // Backward compatibility for single state
      setSelectedDestinationStates([editPackageData.destinationStateId]);
    }

    // 5️⃣ Pre-fill image preview (themeImage stored URL)
    if (editPackageData.themeImg?.path) {
      setThemeImage(editPackageData.themeImg); 
    }
  }
}, [editPackageData]);



  // Fetch destination cities based on selected states (multiple)
  useEffect(() => {
    if (selectedDestinationStates.length > 0) {
      const fetchPromises = selectedDestinationStates.map(stateId =>
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/city/get-city?stateId=${stateId}`)
          .then(res => res.data.data || [])
          .catch(() => [])
      );

      Promise.all(fetchPromises).then(results => {
        // Flatten all cities from all states
        const allCities = results.flat();
        setDestinationCities(allCities);
      });
    } else {
      setDestinationCities([]);
    }
  }, [selectedDestinationStates]);

  // Fetch cities based on state
  useEffect(() => {
    if (selectedStateId) {
      axios
        .get(`${process.env.REACT_APP_API_BASE_URL}/city/get-city?stateId=${selectedStateId}`)
        .then((res) => {
          setCities(res.data.data || []);
        });
    } else {
      setCities([]);
    }
  }, [selectedStateId]);

  // Initialize days
useEffect(() => {
  if (!editPackageData) {
    // CREATE MODE → always regenerate days
    if (packageDuration.days > 0) {
      const newArr = Array.from(
        { length: packageDuration.days },
        (_, i) => ({
          ...initialDayItinerary,
          dayNo: i + 1,
        })
      );
      setItineraryDays(newArr);
    }
    return;
  }

  // EDIT MODE → do not wipe existing itinerary
  if (!editPackageData.itinerary) return;

  let existing = [...editPackageData.itinerary];
  const newDays = packageDuration.days;

  // If days increased → add new blank days
  while (existing.length < newDays) {
    existing.push({
      ...initialDayItinerary,
      dayNo: existing.length + 1,
    });
  }

  // If days decreased → remove extra days
  if (existing.length > newDays) {
    existing = existing.slice(0, newDays);
  }

  setItineraryDays(existing);
}, [packageDuration.days, editPackageData]);


  // Update nights
  useEffect(() => {
    if (packageDuration.days > 0) {
      setPackageDuration((prev) => ({
        ...prev,
        nights: packageDuration.days - 1,
      }));
    }
  }, [packageDuration.days]);

  // Change handlers
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
  };

  const handleRemovePlaceToVisit = (dayIndex, placeIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].placesToVisit = updatedDays[
      dayIndex
    ].placesToVisit.filter((_, i) => i !== placeIndex);
    setItineraryDays(updatedDays);
  };

  const handleAddMeal = (dayIndex, meal) => {
    if (!meal) return;
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].mealsIncluded.push(meal);
    setItineraryDays(updatedDays);
  };

  const handleRemoveMeal = (dayIndex, mealIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].mealsIncluded = updatedDays[
      dayIndex
    ].mealsIncluded.filter((_, i) => i !== mealIndex);
    setItineraryDays(updatedDays);
  };

  const handleActivityChange = (key, value) => {
    setNewActivity((prev) => ({ ...prev, [key]: value }));
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

  const handleAddSection = (dayIndex, sectionType) => {
    const updatedDays = [...itineraryDays];
    if (!updatedDays[dayIndex].sections) {
      updatedDays[dayIndex].sections = [];
    }
    updatedDays[dayIndex].sections.push({ type: sectionType });
    setItineraryDays(updatedDays);
  };

  const handleRemoveSection = (dayIndex, sectionIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].sections = updatedDays[dayIndex].sections.filter(
      (_, i) => i !== sectionIndex
    );
    setItineraryDays(updatedDays);
  };

  const handleAddHotel = (dayIndex, hotelData) => {
    const updatedDays = [...itineraryDays];
    if (!updatedDays[dayIndex].hotels) {
      updatedDays[dayIndex].hotels = [];
    }
    updatedDays[dayIndex].hotels.push(hotelData);
    setItineraryDays(updatedDays);
  };

  const handleRemoveHotel = (dayIndex, hotelIndex) => {
    const updatedDays = [...itineraryDays];
    updatedDays[dayIndex].hotels = updatedDays[dayIndex].hotels.filter(
      (_, i) => i !== hotelIndex
    );
    setItineraryDays(updatedDays);
  };

  const handleAddAvailableVehicle = () => {
    if (!availableVehicle.vehicleType || !availableVehicle.price) return;
    setPackageData((prev) => ({
      ...prev,
      availableVehicle: [...prev.availableVehicle, availableVehicle],
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
    setPackageData((prev) => ({
      ...prev,
      availableVehicle: prev.availableVehicle.filter((_, i) => i !== index),
    }));
  };

  // Submit
const handleSubmit = async () => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  try {
    const {
      objectType,
      packageName,
      selectType,
      uniqueId,
      packageType,
      destinationCity,
      highlights,
      createPilgrimage,
      displayHomepage,
      recommendedPackage,
      roomLimit,
      partialPayment,
      paymentDueDays,
      partialPaymentPercentage,
      cancellationPolicyType,
      include,
      exclude,
      priceMarkup,
      inflatedPercentage,
      active,
      startCity,
    } = packageData;

    const { days, nights } = packageDuration;

    const refundablePercentage = packageData.refundablePercentage || 0;
    const refundableDays = packageData.refundableDays || 0;

    // ---------------- VALIDATIONS ----------------
    if (!objectType) return toast.error("objectType is required");
    if (!packageName.trim()) return toast.error("Package Name is required");
    if (!days || days < 1 || days > 10)
      return toast.error("Days must be between 1–10");
    if (!selectType) return toast.error("Select Type is required");
    if (!uniqueId.trim()) return toast.error("Unique ID is required");
    if (!packageType) return toast.error("Package Type is required");
    if (!destinationCity.length)
      return toast.error("At least 1 destination is required");
    if (!highlights.trim()) return toast.error("Highlights are required");
    if (!startCity.trim()) return toast.error("Start City is required");

    // 🔥 Creation requires theme + images  
    // 🔥 Editing does NOT require uploading new images
    if (!editPackageData && !themeImage)
      return toast.error("Theme image is required");
    if (!editPackageData && images.length === 0)
      return toast.error("At least one additional image is required");

    if (!roomLimit || roomLimit < 1)
      return toast.error("Room Limit must be at least 1");
    if (
      partialPayment &&
      (partialPaymentPercentage <= 0 || partialPaymentPercentage > 100)
    )
      return toast.error("Partial Payment % must be 1–100");
    if (partialPayment && paymentDueDays < 0)
      return toast.error("Payment Due Days must be 0 or more");
    if (!cancellationPolicyType)
      return toast.error("Cancellation Policy is required");
    if (refundablePercentage < 0 || refundablePercentage > 100)
      return toast.error("Refundable Percentage must be 0–100");
    if (refundableDays < 0)
      return toast.error("Refundable Days must be 0 or more");
    if (!include.trim()) return toast.error("Includes are required");
    if (!exclude.trim()) return toast.error("Excludes are required");
    if (priceMarkup < 0 || priceMarkup > 100)
      return toast.error("Price Markup must be 0–100%");
    if (inflatedPercentage < 0 || inflatedPercentage > 100)
      return toast.error("Inflated % must be 0–100%");

    if (itineraryDays.length !== days)
      return toast.error("Itinerary days mismatch");

    for (let i = 0; i < itineraryDays.length; i++) {
      const d = itineraryDays[i];
      if (!d.title || !d.description)
        return toast.error(`Day ${i + 1} must have title & description`);
    }

    // ---------------- FORM DATA ----------------
    const formData = new FormData();

    formData.append("objectType", objectType);
    formData.append("packageName", packageName);
    formData.append("days", days);
    formData.append("nights", nights);
    formData.append("selectType", selectType);
    formData.append("uniqueId", uniqueId);
    formData.append("packageType", packageType);
    formData.append("destinationCity", JSON.stringify(destinationCity));
    formData.append("highlights", highlights);
    formData.append("createPilgrimage", createPilgrimage);
    formData.append("displayHomepage", displayHomepage);
    formData.append("recommendedPackage", recommendedPackage);
    formData.append("roomLimit", roomLimit);
    formData.append("partialPayment", partialPayment);
    formData.append("partialPaymentDueDays", paymentDueDays);
    formData.append("partialPaymentPercentage", partialPaymentPercentage);
    formData.append("cancellationPolicyType", cancellationPolicyType);
    formData.append("refundablePercentage", refundablePercentage);
    formData.append("refundableDays", refundableDays);
    formData.append("include", include);
    formData.append("exclude", exclude);
    formData.append("priceMarkup", priceMarkup);
    formData.append("inflatedPercentage", inflatedPercentage);
    formData.append("active", active);
    formData.append("startCity", startCity);
    formData.append(
      "availableVehicle",
      JSON.stringify(packageData.availableVehicle)
    );

    formData.append("itinerary", JSON.stringify(itineraryDays));

    // 🔥 Only append files if user selected new ones
    if (themeImage) formData.append("themeImage", themeImage);
    images.forEach((img) => formData.append("files", img));

    // ---------------- API CALL ----------------
    const user = JSON.parse(localStorage.getItem("user"));

    let apiUrl = "";
    let method = "";

    if (editPackageData?._id) {
      // EDIT
      formData.append("_id", editPackageData._id);
      apiUrl = `${process.env.REACT_APP_API_BASE_URL}/holidays/updatePackage`;
      method = "PUT";
    } else {
      // CREATE
      apiUrl = `${process.env.REACT_APP_API_BASE_URL}/holidays/createPackage`;
      method = "POST";
    }

    const response = await fetch(apiUrl, {
      method,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    toast.success(
      editPackageData ? "Package Updated!" : "Package Created Successfully!"
    );

    // RESET FORM ONLY AFTER CREATE
    if (!editPackageData) {
      setPackageData(initialPackageData);
      setPackageDuration(initialPackageDuration);
      setItineraryDays([]);
      setImages([]);
      setThemeImage(null);
    }

  } catch (err) {
    toast.error(err.message || "Failed");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="col-lg-12">
      <div className="card" style={{ padding: "15px" }}>
        <div>
          {/* Package Details Accordion */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Package Details</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="card-body">
            <div className="row g-3">
              <div className="col-sm-4">
                <label className="form-label">Package Type</label>
                <Autocomplete
                  options={PACKAGE_TYPES}
                  value={
                    PACKAGE_TYPES.find(
                      (opt) => opt.value === packageData.packageType
                    ) || null
                  }
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
                  value={
                    SELECT_TYPES.find(
                      (opt) => opt.value === packageData.selectType
                    ) || null
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
                <label className="form-label">Unique ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={packageData.uniqueId}
                  onChange={(e) =>
                    handlePackageChange("uniqueId", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-6">
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

              <div className="col-sm-6">
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

              <div className="col-sm-6">
                <label className="form-label">Destination States</label>
                <Autocomplete
                  multiple
                  options={states}
                  value={states.filter((s) => selectedDestinationStates.includes(s._id))}
                  getOptionLabel={(option) => option.name || ""}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Destination States"
                    />
                  )}
                  onChange={(e, selectedOptions) => {
                    const stateIds = selectedOptions.map(opt => opt._id);
                    setSelectedDestinationStates(stateIds);
                    // Clear destination cities when states change
                    handlePackageChange("destinationCity", []);
                  }}
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Destination Cities</label>
                <Autocomplete
                  multiple
                  disabled={selectedDestinationStates.length === 0}
                  options={destinationCities}
                  value={packageData.destinationCity}
                  getOptionLabel={(option) => option.name || option}
                  isOptionEqualToValue={(opt, val) => {
                    if (typeof val === 'string') return opt.name === val;
                    return opt._id === val._id;
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={
                        selectedDestinationStates.length > 0
                          ? "Select Destination Cities"
                          : "First select states"
                      }
                    />
                  )}
                  onChange={(e, newValue) => {
                    const destinations = newValue.map((item) =>
                      typeof item === 'string' ? item : item.name
                    );
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
                    setPackageDuration((prev) => ({
                      ...prev,
                      days,
                      nights: days > 0 ? days - 1 : 0,
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
                  onChange={(e) =>
                    handlePackageChange("roomLimit", parseInt(e.target.value))
                  }
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

              {/* <div className="col-sm-4">
                <label className="form-label">Inventory Count</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={packageData.inventry}
                  onChange={(e) =>
                    handlePackageChange("inventry", parseInt(e.target.value))
                  }
                />
              </div> */}

              <div className="col-sm-12">
                <label className="form-label">Highlights</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.highlights}
                  onChange={(e) =>
                    handlePackageChange("highlights", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Includes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.include}
                  onChange={(e) =>
                    handlePackageChange("include", e.target.value)
                  }
                />
              </div>

              <div className="col-sm-6">
                <label className="form-label">Excludes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={packageData.exclude}
                  onChange={(e) =>
                    handlePackageChange("exclude", e.target.value)
                  }
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
                  onChange={(e) =>
                    handlePackageChange(
                      "priceMarkup",
                      parseFloat(e.target.value)
                    )
                  }
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
                  onChange={(e) =>
                    handlePackageChange(
                      "inflatedPercentage",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="col-sm-3">
                <label className="form-label">Payment Due Days</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={packageData.paymentDueDays}
                  onChange={(e) =>
                    handlePackageChange(
                      "paymentDueDays",
                      parseInt(e.target.value)
                    )
                  }
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
                  onChange={(e) =>
                    handlePackageChange(
                      "partialPaymentPercentage",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div className="col-sm-4">
                <label className="form-label">Cancellation Policy</label>
                <Autocomplete
                  options={CANCELLATION_TYPES}
                  value={
                    CANCELLATION_TYPES.find(
                      (opt) => opt.value === packageData.cancellationPolicyType
                    ) || null
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Cancellation Policy"
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

              {packageData.cancellationPolicyType === "refundble" && (
                <>
                  <div className="col-sm-3">
                    <label className="form-label">
                      Refundable Percentage (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="form-control"
                      value={packageData.refundablePercentage}
                      onChange={(e) =>
                        handlePackageChange(
                          "refundablePercentage",
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div className="col-sm-3">
                    <label className="form-label">Refundable Days</label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={packageData.refundableDays}
                      onChange={(e) =>
                        handlePackageChange(
                          "refundableDays",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </>
              )}

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
                        onChange={() =>
                          handleSwitchChange("recommendedPackage")
                        }
                      />
                    }
                    label={packageData.recommendedPackage ? "Yes" : "No"}
                  />
                </div>
              </div>
            </div>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Available Vehicles Accordion */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Available Vehicles</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="card-body">
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

            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Select Vehicle</label>
                <Autocomplete
                  options={vehiclesList}
                  getOptionLabel={(option) =>
                    `${option.vehicleType} - ${option.brandName} ${option.modelName}`
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setAvailableVehicle({
                        vehicleType: newValue.vehicleType,
                        brandName: newValue.brandName,
                        modelName: newValue.modelName,
                        seatLimit: newValue.seatLimit,
                        vehicle_id: newValue._id,
                        price: 0,
                        rate: 0,
                      });
                    } else {
                      setAvailableVehicle({
                        vehicleType: "",
                        price: 0,
                        rate: 0,
                        seatLimit: 0,
                        vehicle_id: "",
                        brandName: "",
                        modelName: "",
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Choose vehicle" size="small" />
                  )}
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="form-control"
                  value={availableVehicle.brandName}
                  disabled
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Model</label>
                <input
                  type="text"
                  className="form-control"
                  value={availableVehicle.modelName}
                  disabled
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Seat Limit</label>
                <input
                  type="number"
                  className="form-control"
                  value={availableVehicle.seatLimit}
                  disabled
                />
              </div>
              <div className="col-md-2">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  value={availableVehicle.price}
                  onChange={(e) =>
                    setAvailableVehicle((prev) => ({
                      ...prev,
                      price: parseFloat(e.target.value),
                    }))
                  }
                  placeholder="Enter price"
                />
              </div>
              <div className="col-md-1">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleAddAvailableVehicle}
                  disabled={
                    !availableVehicle.vehicleType || !availableVehicle.price
                  }
                >
                  Add
                </button>
              </div>
            </div>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Itinerary Accordion */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Itinerary</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="card-body">
            {itineraryDays.length > 0 ? (
              itineraryDays.map((day, index) => (
                <DayItinerary
                  key={index}
                  day={day}
                  dayIndex={index}
                  states={states}
                  cities={cities}
                  selectedStateId={selectedStateId}
                  setSelectedStateId={setSelectedStateId}
                  handleDayItineraryChange={handleDayItineraryChange}
                  newActivity={newActivity}
                  TRANSPORT_TYPES={TRANSPORT_TYPES}
                  MEAL_OPTIONS={MEAL_OPTIONS}
                  ACTIVITY_TYPES={ACTIVITY_TYPES}
                  handleTransportChange={handleTransportChange}
                  handleAddMeal={handleAddMeal}
                  handleRemoveMeal={handleRemoveMeal}
                  handleAddPlaceToVisit={handleAddPlaceToVisit}
                  handleRemovePlaceToVisit={handleRemovePlaceToVisit}
                  handleRemoveActivity={handleRemoveActivity}
                  handleActivityChange={handleActivityChange}
                  handleAddActivity={handleAddActivity}
                  handleAddSection={handleAddSection}
                  handleRemoveSection={handleRemoveSection}
                  handleAddHotel={handleAddHotel}
                  handleRemoveHotel={handleRemoveHotel}
                />
              ))
            ) : (
              <div className="alert alert-info">
                Please enter the number of days to create itinerary
              </div>
            )}
              </div>
            </AccordionDetails>
          </Accordion>
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
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default AddHolidayPackage;
