import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Country, State, City } from "country-state-city";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  PageContainer,
  HeaderSection,
  FormContainer,
  FooterButtons,
  FieldGroup,
  SectionTitle,
} from "./SharedStyles";

const LocationDetails = () => {
  const navigate = useNavigate();
  const [locationdata, setLocation] = useState({
    location: "",
    city: "",
    state: "",
    country: "",
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId);
  
  useEffect(() => {
    if (experienceId) {
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
        const responseJson = await response.json();
        console.log(responseJson, "responseJson");
        if (!responseJson.location) {
          return;
        }
        setLocation(responseJson.location);
        setSelectedCountry(responseJson.location.country);
        setSelectedState(responseJson.location.state);
      })();
    } else if (!experienceId) {
      alert("Please fill in all the fields");
    }
  }, [experienceId]);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    setLocation((prevState) => ({
      ...prevState,
      country: selectedCountry,
      state: "",
      city: "",
    }));
  };

  const handleStateChange = () => {
    // Optional: handle state change logic here if needed
  };
  
  const submit = async () => {
    const query = new URLSearchParams({
      location: locationdata,
    });
    if (
      !locationdata ||
      (!locationdata.location && !locationdata.location === "") ||
      (!locationdata.city && !locationdata.city === "") ||
      (!locationdata.state && !locationdata.state === "") ||
      (!locationdata.country && !locationdata.country === "")
    ) {
      alert("Please enter the location details");
      return;
    }
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}?${query.toString()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ location: locationdata }),
      }
    );
    const responseJson = await response.json();
    if (!response.ok) {
      alert(responseJson.message);
      return;
    }
    navigate("/activity/categories", { // Updated path
      state: {
        ...responseJson,
      },
    });
  };

  const goBack = () => {
    navigate("/activity/duration"); // Updated path
  };
  
  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>What is the location of your experience?</h2>
        <p>
          Inform travellers about the city or town where your experience takes
          place. This will help with filtering and searching online
        </p>
      </HeaderSection>

      <FormContainer>
        <div className="form-section">
          <SectionTitle>Location Link</SectionTitle>
          <TextField
            fullWidth
            id="outlined-basic"
            label="Google Maps or Location Link"
            variant="outlined"
            placeholder="https://maps.google.com/..."
            value={locationdata.location}
            onChange={(e) =>
              setLocation((prev) => ({ ...prev, location: e.target.value }))
            }
          />
        </div>

        <div className="form-section">
          <SectionTitle>Address Details</SectionTitle>
          <FieldGroup>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="country-label">Country</InputLabel>
              <Select
                labelId="country-label"
                id="country-select"
                value={locationdata.country}
                onChange={(e) => {
                  setSelectedCountry(e?.target?.value);
                  setLocation((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }));
                  handleCountryChange(e);
                }}
                label="Country"
              >
                {Country.getAllCountries().map((country) => (
                  <MenuItem key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </FieldGroup>

          <FieldGroup>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="state-label">State / Region</InputLabel>
              <Select
                labelId="state-label"
                id="state-select"
                value={locationdata.state}
                onChange={(e) => {
                  setSelectedState(e?.target?.value);
                  handleStateChange();
                  setLocation((prev) => ({
                    ...prev,
                    state: e.target.value,
                  }));
                }}
                label="State / Region"
                disabled={!selectedCountry}
              >
                {State?.getStatesOfCountry(selectedCountry)?.map((state) => (
                  <MenuItem key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl variant="outlined" fullWidth>
              <InputLabel id="city-label">City</InputLabel>
              <Select
                labelId="city-label"
                id="city-select"
                value={locationdata.city ? locationdata.city : ""}
                onChange={(e) => {
                  setLocation((prev) => ({
                    ...prev,
                    city: e.target.value,
                  }));
                }}
                label="City"
                disabled={!selectedState}
              >
                {City?.getCitiesOfState(selectedCountry, selectedState)?.map(
                  (city) => (
                    <MenuItem key={city.name} value={city.name}>
                      {city.name}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </FieldGroup>
        </div>
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

export default LocationDetails;