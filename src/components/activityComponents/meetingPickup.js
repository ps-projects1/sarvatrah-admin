import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const MeetingPickup = () => {
  const [meetingOption, setMeetingOption] = useState("meet_on_location");
  const location = useLocation();
  const navigate = useNavigate();
  const localId = localStorage.getItem("_id");

  const [experienceId, setExperienceId] = useState(localId ? localId : "");
  useEffect(() => {
    if (experienceId && experienceId.length > 0) {
      (async function () {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,

          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const { traveller_facilty } = await response.json();
        if (!traveller_facilty) {
          setMeetingOption("meet_on_location");
        } else {
          setMeetingOption(traveller_facilty);
        }
      })();
      return;
    }
    if (!experienceId) {
      alert("Please fill in all the fields");
      return;
    }
  }, []);
  const goBack = () => {
    navigate("/pricingCategories");
  };
  const submit = async () => {
    const response = await fetch(
     `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,

      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          traveller_facilty: meetingOption,
        }),
      }
    );
    const data = await response.json();
    if (data) {
      navigate("/meetingPoint", {
        state: {
          ...data,
        },
      });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h2 style={{ fontWeight: "bold", padding: "5px" }}>
          Can travellers be picked up for the experience?
        </h2>
        <p style={{ padding: "5px", textAlign: "center" }}>
          ...or should the travellers meet you on location?
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <FormControl style={{ width: "100%" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={meetingOption}
            onChange={(e) => setMeetingOption(e.target.value)}
          >
            <div
              style={{
                border: "1px solid #DEE3EA",
                borderRadius: "7px",
                padding: "55px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <FormControlLabel
                value="dateTime"
                control={<Radio value="meet_on_location" />}
              />
              <div>
                <h5>Meet on location</h5>
                <span>
                  This experience has no pick-up service, customers have to make
                  their way to our meeting point.
                </span>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #DEE3EA",
                borderRadius: "7px",
                padding: "55px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <FormControlLabel
                value="date"
                control={<Radio value="pick_up_only" />}
              />
              <div>
                <h5>Pick-up only</h5>
                <span>
                  Customers must be picked up from selected pick-up locations.
                </span>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #DEE3EA",
                borderRadius: "7px",
                padding: "55px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <FormControlLabel
                value="pass"
                control={<Radio value="meet_on_location_or_pickup" />}
              />
              <div>
                <h5>Pick-up and Drop</h5>
                <span>
                  Customers should be picked up and dropped back to the given location 
                </span>
              </div>
            </div>
          </RadioGroup>
        </FormControl>
      </div>

      <div
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "space-between",
          marginTop: "150px",
        }}
      >
        <Button variant="outlined" onClick={goBack}>
          Back
        </Button>
        <Button variant="contained" onClick={submit}>
          Continue
        </Button>
      </div>
    </div>
  );
};

export default MeetingPickup;
