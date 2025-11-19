import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const BookingCutoff = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState(bookingCutoff[0]);
  const [showTimeSection, setShowTimeSection] = useState(false);
  const [timingOptions, setTimingOptions] = useState("date");
  const [dateTime, setDateTime] = useState("");
  const [date, setDate] = useState();
  const localId = localStorage.getItem("_id");
  const [experienceId, setExperienceId] = useState(localId ? localId : "");

  useEffect(() => {
    if (!experienceId && experienceId.length === 0) {
      alert("please add titel and categories");
      navigate("/titel");
      return;
    }
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
      const { predefinedTimeAllowances, allow_custom_availability } =
        responseJson;
      if (predefinedTimeAllowances) {
        setSelectedOption(
          bookingCutoff.find((item) => item.value === predefinedTimeAllowances)
        );
        setShowTimeSection(predefinedTimeAllowances === "date");
      }
      if (allow_custom_availability) {
        setTimingOptions(allow_custom_availability.typeOf);
      }
      if (
        responseJson.customTimeAllowance &&
        responseJson.customTimeAllowance.value
      ) {
        setDateTime(responseJson.customTimeAllowance.value);
      }
    })();
  }, []);
  const handleRadioChange = (event) => {
    console.log(event.target.value);
    setSelectedOption(event.target.value);
    setShowTimeSection(event.target.value === "date");
  };
  const goBack = () => {
    navigate("/openingHours");
  };
  const submit = async () => {
    if (showTimeSection && selectedOption.value === "custom") {
      const value = timingOptions === "date" ? date : dateTime;
      const data = {
        predefinedTimeAllowances: selectedOption.value,
        allow_custom_availability: true,
        customTimeAllowance: {
          typeOf: timingOptions,
          value: value,
        },
      };
      const response = await fetch(
     `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      navigate("/capacity", {
        state: {
          ...result,
        },
      });
      console.log(result);
    } else {
      const data = {
        predefinedTimeAllowances: selectedOption.value,
      };
      console.log(data);
      const response = await fetch(
       `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,

        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const result = await response.json();
      console.log(result);
      navigate("/capacity", {
        state: {
          ...result,
        },
      });
    }
    //customTimeAllowance
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
          How close to the departure can travellers book?
        </h2>
        <p style={{ padding: "5px", textAlign: "center" }}>
          To increase your chances of getting a booking, we recommend allowing
          travellers to book as close as possible to the start time of your
          experience. However, make sure to allow enough time for yourself to
          prepare for the experience
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <div style={{ padding: "20px" }}>
          <h5>
            How close to the experience start time can you take your final
            booking?
          </h5>
          <span style={{ fontStyle: "italic", paddingBottom: "5px" }}>
            The closer to the start time you leave it the more bookings you will
            get.
          </span>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={bookingCutoff}
            // sx={{ width: 300 }}
            value={selectedOption?.label || ""}
            onChange={(event, newValue) => {
              console.log(newValue);
              setSelectedOption(newValue);
              if (newValue?.value === "custom") {
                setShowTimeSection(true);
              }
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </div>
        {selectedOption?.value === "custom" && (
          <div style={{ marginTop: "30px" }}>
            <FormControl style={{ width: "100%" }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={timingOptions}
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
                    control={
                      <Radio
                        value={"date_time"}
                        onChange={(e) => {
                          setTimingOptions("date_time");
                        }}
                      />
                    }
                  />
                  <div>
                    <h5>Date and Time</h5>
                    <span>
                      Customers select both date and time when booking this
                      product
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
                    control={
                      <Radio
                        value={"date"}
                        onChange={(e) => {
                          setTimingOptions("date");
                        }}
                      />
                    }
                  />
                  <div>
                    <h5>Just date, no time</h5>
                    <span>
                      Customers must select a date when booking, but no need to
                      specify time within the day
                    </span>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
            {timingOptions === "date_time" ? (
              <div style={{ marginTop: "30px" }}>
                {" "}
                <TextField
                  style={{ width: "100px", paddingRight: "10px" }}
                  id="outlined-number"
                  label="Weeks"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setDateTime(
                      `${dateTime.split(":")[0]}${e.target.value}:${
                        dateTime.split(":")[1] ? dateTime.split(":")[1] : "00"
                      }:${
                        dateTime.split(":")[2] ? dateTime.split(":")[2] : "00"
                      }:${
                        dateTime.split(":")[3] ? dateTime.split(":")[3] : "00"
                      }`
                    );
                  }}
                />
                <TextField
                  style={{ width: "100px", paddingRight: "10px" }}
                  id="outlined-number"
                  label="Days"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setDateTime(
                      `${dateTime.split(":")[0]}:${dateTime.split(":")[0]}${
                        e.target.value
                      }:${dateTime.split(":")[2] ? dateTime.split(":")[2] : 0}
                      :${dateTime.split(":")[2]}:${dateTime.split(":")[3]}`
                    );
                  }}
                />
                <TextField
                  style={{ width: "100px", paddingRight: "10px" }}
                  id="outlined-number"
                  label="Hours"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setDateTime(
                      `${
                        dateTime.split(":")[0] ? dateTime.split(":")[0] : "00"
                      }:${
                        dateTime.split(":")[1] ? dateTime.split(":")[1] : "00"
                      }${e.target.value}:${
                        dateTime.split(":")[2] ? dateTime.split(":")[2] : "00"
                      }`
                    );
                  }}
                />
                <TextField
                  style={{ width: "100px", paddingRight: "10px" }}
                  id="outlined-number"
                  label="Minutes"
                  type="number"
                  size="small"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={(e) => {
                    setDateTime(
                      `${
                        dateTime.split(":")[0] ? dateTime.split(":")[0] : "00"
                      }:${
                        dateTime.split(":")[1] ? dateTime.split(":")[1] : "00"
                      }${
                        dateTime.split(":")[2] ? dateTime.split(":")[2] : "00"
                      }${e.target.value}`
                    );
                  }}
                />
              </div>
            ) : null}
            {timingOptions === "date" ? (
              <div>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["TimePicker"]}>
                    <TimePicker
                      onChange={(e) => {
                        console.log(e);
                        setDate(e);
                      }}
                      size="small"
                      label="Time"
                      ampm={false}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </div>
            ) : null}
          </div>
        )}
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

export default BookingCutoff;

const bookingCutoff = [
  {
    label: "I take booking right up until the start of the activity",
    value: "rightUpUntilStart",
  },
  {
    label: "15 minutes before start time",
    value: "min15Before",
  },
  {
    label: "30 minutes before start time",
    value: "min30Before",
  },
  { label: "1 hour before start time", value: "hour1Before" },
  { label: "2 hour before start time", value: "hour2Before" },
  { label: "3 hour before start time", value: "hour3Before" },
  { label: "4 hour before start time", value: "hour4Before" },
  { label: "8 hour before start time", value: "hour8Before" },
  { label: "1 day before start time", value: "day1Before" },
  { label: "2 day before start time", value: "day2Before" },
  { label: "3 day before start time", value: "day3Before" },
  { label: "4 day before start time", value: "day4Before" },
  { label: "5 day before start time", value: "day5Before" },
  { label: "6 day before start time", value: "day6Before" },
  { label: "1 week before start time", value: "week1Before" },
  { label: "2 week before start time", value: "week2Before" },
  { label: "4 week before start time", value: "week4Before" },
  { label: "8 week before start time", value: "week8Before" },
  {
    label: "I want to define my own booking cutoff",
    value: "custom",
  },
];
const bookingCutoffMap = {
  rightUpUntilStart: "I take booking right up until the start of the activity",
  min15Before: "15 minutes before start time",
  min30Before: "30 minutes before start time",
  hour1Before: "1 hour before start time",
  hour2Before: "2 hours before start time",
  hour3Before: "3 hours before start time",
  hour4Before: "4 hours before start time",
  hour8Before: "8 hours before start time",
  day1Before: "1 day before start time",
  day2Before: "2 days before start time",
  day3Before: "3 days before start time",
  day4Before: "4 days before start time",
  day5Before: "5 days before start time",
  day6Before: "6 days before start time",
  week1Before: "1 week before start time",
  week2Before: "2 weeks before start time",
  week4Before: "4 weeks before start time",
  week8Before: "8 weeks before start time",
  custom: "I want to define my own booking cutoff",
};
