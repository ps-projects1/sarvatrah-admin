import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const DayItinerary = ({
  day,
  dayIndex,
  newActivity,
  TRANSPORT_TYPES,
  MEAL_OPTIONS,
  ACTIVITY_TYPES,
  states,
  cities,
  setSelectedStateId,
  handleDayItineraryChange,
  handleTransportChange,
  handleAddMeal,
  handleRemoveMeal,
  handleAddPlaceToVisit,
  handleRemovePlaceToVisit,
  handleRemoveActivity,
  handleActivityChange,
  handleAddActivity,
}) => {
  return (
    <div className="mb-4 p-3 border rounded">
      <h5>Day {day.dayNo}</h5>

      {/* Title & Subtitle */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label">State</label>
          <Autocomplete
            options={states}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(opt, val) => opt._id === val._id}
            value={day.state || null}
            onChange={(e, selectedOption) => {
              handleDayItineraryChange(dayIndex, "state", selectedOption);
              setSelectedStateId(selectedOption?._id || null);
              handleDayItineraryChange(dayIndex, "city", null); // reset city
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder="Select State" />
            )}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">City</label>
          <Autocomplete
            options={cities}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(opt, val) => opt._id === val._id}
            value={day.city || null}
            onChange={(e, selectedOption) =>
              handleDayItineraryChange(dayIndex, "city", selectedOption)
            }
            renderInput={(params) => (
              <TextField {...params} placeholder="Select City" />
            )}
            disabled={!day.state}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            value={day.title || ""}
            onChange={(e) =>
              handleDayItineraryChange(dayIndex, "title", e.target.value)
            }
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Subtitle</label>
          <input
            type="text"
            className="form-control"
            value={day.subtitle || ""}
            onChange={(e) =>
              handleDayItineraryChange(dayIndex, "subtitle", e.target.value)
            }
          />
        </div>
        <div className="col-md-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={day.description || ""}
            onChange={(e) =>
              handleDayItineraryChange(dayIndex, "description", e.target.value)
            }
          />
        </div>
        <div className="col-md-6">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={`stay-${dayIndex}`}
              checked={day.stay || false}
              onChange={(e) =>
                handleDayItineraryChange(dayIndex, "stay", e.target.checked)
              }
            />
            <label className="form-check-label" htmlFor={`stay-${dayIndex}`}>
              Stay Included
            </label>
          </div>
        </div>
        <div className="col-md-6">
          <label className="form-label">Notes</label>
          <input
            type="text"
            className="form-control"
            value={day.notes || ""}
            onChange={(e) =>
              handleDayItineraryChange(dayIndex, "notes", e.target.value)
            }
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
              value={
                TRANSPORT_TYPES.find(
                  (opt) => opt.value === day.transport.type
                ) || null
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField {...params} placeholder="Select Transport Type" />
              )}
              onChange={(e, selectedOption) =>
                handleTransportChange(
                  dayIndex,
                  "type",
                  selectedOption?.value || ""
                )
              }
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Transport Details</label>
            <input
              type="text"
              className="form-control"
              value={day.transport.details || ""}
              onChange={(e) =>
                handleTransportChange(dayIndex, "details", e.target.value)
              }
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
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Activities</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            {day.activities.map((activity, activityIndex) => (
              <div key={activityIndex} className="card mb-2">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6>{activity.title}</h6>
                      <p>{activity.description}</p>
                      <small className="text-muted">Type: {activity.type}</small>
                      {activity.duration && (
                        <small className="text-muted ms-2">
                          Duration: {activity.duration}
                        </small>
                      )}
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

            {/* Add New Activity */}
            <div className="mt-3">
              <h6>Add New Activity</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label">Activity Type</label>
                  <Autocomplete
                    options={ACTIVITY_TYPES}
                    value={
                      ACTIVITY_TYPES.find(
                        (opt) => opt.value === newActivity.type
                      ) || null
                    }
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
                    onChange={(e) =>
                      handleActivityChange("duration", e.target.value)
                    }
                  />
                </div>

                <div className="col-md-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    value={newActivity.description || ""}
                    onChange={(e) =>
                      handleActivityChange("description", e.target.value)
                    }
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
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default DayItinerary;
