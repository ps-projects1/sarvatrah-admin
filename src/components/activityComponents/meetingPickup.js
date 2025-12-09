import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  HeaderSection,
  FormContainer,
  FooterButtons,
  OptionBox,
  OptionContent,
} from "./SharedStyles";

const MeetingPickup = () => {
  const navigate = useNavigate();
  const experienceId = localStorage.getItem("_id");

  const [meetingOption, setMeetingOption] = useState("meet_on_location");

  // Redirect if no experience ID
  useEffect(() => {
    if (!experienceId) {
      alert("No activity found. Please start from the beginning.");
      navigate("/addactivity");
      return;
    }
  }, [experienceId, navigate]);

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
    console.log("=== MEETINGPICKUP SUBMIT ===");
    console.log("Experience ID:", experienceId);
    console.log("Selected meeting option:", meetingOption);

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ traveller_facilty: meetingOption }),
      }
    );

    const data = await res.json();
    console.log("Response from server:", data);

    if (data) {
      console.log("Navigating to meeting point page...");
      navigate("/activity/meetingPoint");
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>Can travellers be picked up?</h2>
        <p>Or should travellers meet you at your location?</p>
      </HeaderSection>

      <FormContainer>
        <FormControl fullWidth>
          <RadioGroup
            value={meetingOption}
            onChange={(e) => setMeetingOption(e.target.value)}
          >
            <OptionBox selected={meetingOption === "meet_on_location"}>
              <FormControlLabel
                value="meet_on_location"
                control={<Radio />}
                sx={{ margin: 0 }}
              />
              <OptionContent>
                <h5>Meet on Location</h5>
                <span>Travellers must reach the meeting point themselves.</span>
              </OptionContent>
            </OptionBox>

            <OptionBox selected={meetingOption === "pick_up_only"}>
              <FormControlLabel
                value="pick_up_only"
                control={<Radio />}
                sx={{ margin: 0 }}
              />
              <OptionContent>
                <h5>Pick-Up Only</h5>
                <span>Travellers will be picked up from selected pickup points.</span>
              </OptionContent>
            </OptionBox>

            <OptionBox selected={meetingOption === "meet_on_location_or_pickup"}>
              <FormControlLabel
                value="meet_on_location_or_pickup"
                control={<Radio />}
                sx={{ margin: 0 }}
              />
              <OptionContent>
                <h5>Pick-Up & Drop</h5>
                <span>Travellers get pickup and drop services.</span>
              </OptionContent>
            </OptionBox>
          </RadioGroup>
        </FormControl>
      </FormContainer>

      <FooterButtons>
        <Button variant="outlined" onClick={goBack}>
          Back
        </Button>
        <Button variant="contained" onClick={submit}>
          Continue
        </Button>
      </FooterButtons>
    </PageContainer>
  );
};

export default MeetingPickup;
