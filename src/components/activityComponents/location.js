import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CSC, { Country, State, City, IState } from "country-state-city";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const LocationDetails = () => {
  const state = useLocation();
  const navigate = useNavigate();
  const [locationdata, setLocation] = useState({
    location: "",
    city: "",
    state: "",
    country: "",
  });
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const localId = localStorage.getItem("_id");
  const [experienceId, setExperienceId] = useState(localId);
  useEffect(() => {
    if (experienceId) {
      (async function () {
        const response = await fetch(
          `http://localhost:3232/experience/${experienceId}`,
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
        setSelectedCity(responseJson.location.city);
      })();
      return;
    }
    if (!experienceId) {
      alert("Please fill in all the fields");
      return;
    }
  }, []);

  const handleCountryChange = (event) => {
    const selectedCountry = event.target.value;
    // const country = Country.getCountryByShort(selectedCountry);
    const states = State.getStatesOfCountry(selectedCountry.isoCode);
    setStates(states);
    setLocation((prevState) => ({
      ...prevState,
      country: selectedCountry,
      state: "",
      city: "",
    }));
  };

  const handleStateChange = (event) => {
    const selectedStates = event.target.value;
    const countryIsoCode = Country.getCountryByCode(selectedCountry);
    const stateCode = State.getStateByCode(selectedState);
    const state = State.getStateByCodeAndCountry(
      event.target.value,
      countryIsoCode
    );
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
      `http://localhost:3232/experience/${experienceId}?${query.toString()}`,
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
    navigate("/categories", {
      state: {
        ...responseJson,
      },
    });
  };

  const goBack = () => {
    navigate("/duration");
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
          What is the location of your experience?
        </h2>
        <p style={{ padding: "5px" }}>
          Inform travellers about the city or town where your experience takes
          place. This will help with filtering and searching online
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <TextField
          fullWidth
          id="outlined-basic"
          label="location link"
          variant="outlined"
          value={locationdata.location}
          onChange={(e) =>
            setLocation((prev) => ({ ...prev, location: e.target.value }))
          }
        />
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
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
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="state-label">State</InputLabel>
            <Select
              labelId="state-label"
              id="state-select"
              value={locationdata.state}
              onChange={(e) => {
                setSelectedState(e?.target?.value);
                const countryIsoCode =
                  Country.getCountryByCode(selectedCountry);
                const selectedStateCode = State.getStateByCodeAndCountry(
                  selectedState,
                  countryIsoCode?.isoCode
                );
                handleStateChange(e);
                setLocation((prev) => ({
                  ...prev,
                  state: e.target.value,
                }));
              }}
              label="State"
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
                setSelectedCity(e?.target?.value);
                setLocation((prev) => ({
                  ...prev,
                  city: e.target.value,
                }));
              }}
              label="City"
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
        </div>
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

export default LocationDetails;
