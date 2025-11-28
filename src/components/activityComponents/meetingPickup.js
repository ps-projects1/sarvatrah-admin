import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MeetingPickup = () => {
  const navigate = useNavigate();
  const experienceId = localStorage.getItem("_id");

  const [meetingOption, setMeetingOption] = useState("meet_on_location");

  useEffect(() => {
    if (!experienceId) return;

    (async function () {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`
      );
      const data = await res.json();

      if (data?.traveller_facilty) {
        setMeetingOption(data.traveller_facilty);
      }
    })();
  }, [experienceId]);

  const goBack = () => navigate("/activity/pricingCategories");

  const submit = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traveller_facilty: meetingOption }),
      }
    );

    const data = await res.json();
    if (data) navigate("/activity/meetingPoint");
  };

  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <h2 style={{ fontWeight: "bold" }}>Can travellers be picked up?</h2>
        <p>Or should travellers meet you at your location?</p>
      </div>

      <div style={{ width: "70%" }}>
        <FormControl fullWidth>
          <RadioGroup
            value={meetingOption}
            onChange={(e) => setMeetingOption(e.target.value)}
          >
            <OptionBox>
              <FormControlLabel
                value="meet_on_location"
                control={<Radio />}
              />
              <OptionText
                title="Meet on Location"
                desc="Travellers must reach the meeting point themselves."
              />
            </OptionBox>

            <OptionBox>
              <FormControlLabel
                value="pick_up_only"
                control={<Radio />}
              />
              <OptionText
                title="Pick-Up Only"
                desc="Travellers will be picked up from selected pickup points."
              />
            </OptionBox>

            <OptionBox>
              <FormControlLabel
                value="meet_on_location_or_pickup"
                control={<Radio />}
              />
              <OptionText
                title="Pick-Up & Drop"
                desc="Travellers get pickup and drop services."
              />
            </OptionBox>

          </RadioGroup>
        </FormControl>
      </div>

      <FooterButtons back={goBack} submit={submit} />
    </div>
  );
};

// Reusable Components
const OptionBox = ({ children }) => (
  <div
    style={{
      border: "1px solid #DEE3EA",
      borderRadius: 8,
      padding: 40,
      display: "flex",
      alignItems: "center",
      marginTop: 12,
      gap: 10,
    }}
  >
    {children}
  </div>
);

const OptionText = ({ title, desc }) => (
  <div>
    <h5>{title}</h5>
    <span>{desc}</span>
  </div>
);

const FooterButtons = ({ back, submit }) => (
  <div
    style={{
      width: "70%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: 100,
    }}
  >
    <Button variant="outlined" onClick={back}>Back</Button>
    <Button variant="contained" onClick={submit}>Continue</Button>
  </div>
);

export default MeetingPickup;
