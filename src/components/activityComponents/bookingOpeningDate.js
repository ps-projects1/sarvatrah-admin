import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Switch,
  TextField,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const BookingOpeningDate = () => {
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
          Booking opening date
        </h2>
        <p style={{ padding: "5px", textAlign: "center" }}>
          Do you have an event or an offer where ticket sales need to start at a
          specific time? Do you need to fix how early your travellers can book
          your experiences? If yes, then Booking opening date is the setting for
          you.
        </p>
      </div>

      {/* <h5>Enable operating hours</h5> */}
      <FormGroup>
        <FormControlLabel
          control={<Switch />}
          label="Enable booking opening date"
        />
      </FormGroup>
      <div style={{ width: "70%" }}>
        <FormControl style={{ width: "100%" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
          >
            <div
              style={{
                border: "1px solid #DEE3EA",
                borderRadius: "7px",
                padding: "30px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <FormControlLabel value="dateTime" control={<Radio />} />
              <div>
                <h5>Specific date time</h5>
                <span>Open for bookings on a specific date and time.</span>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #DEE3EA",
                borderRadius: "7px",
                padding: "30px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <FormControlLabel value="date" control={<Radio />} />
              <div>
                <h5>Days before travel relative to start date</h5>
                <span>Select how far in advance bookings should open.</span>
              </div>
            </div>
            <div
              style={{
                border: "1px solid #DEE3EA",
                borderRadius: "7px",
                padding: "30px",
                height: "100px",
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <FormControlLabel value="pass" control={<Radio />} />
              <div>
                <h5>Months before travel date relative to start date</h5>
                <span>Select how far in advance bookings should open.</span>
              </div>
            </div>
          </RadioGroup>
        </FormControl>

        <div style={{ marginTop: "20px" }}>
          <h5>Select date and time to open for bookings</h5>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker size="small" label="Date" />
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker size="small" label="Time" ampm={false} />
            </DemoContainer>
          </LocalizationProvider>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h5>Select the relative date and set time to open for bookings.</h5>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              style={{ width: "100px" }}
              id="outlined-number"
              type="number"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <h6 style={{ paddingLeft: "15px" }}>Days before start date</h6>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker size="small" label="Time" ampm={false} />
              </DemoContainer>
            </LocalizationProvider>
            <h6 style={{ paddingLeft: "15px" }}>
              At what time will it be possible to book?
            </h6>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h5>
            Select the relative month(s) and set time to open for bookings.
          </h5>
          <div style={{ display: "flex", alignItems: "center" }}>
            <TextField
              style={{ width: "100px" }}
              id="outlined-number"
              type="number"
              size="small"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <h6 style={{ paddingLeft: "15px" }}>Months before start date</h6>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["TimePicker"]}>
                <TimePicker size="small" label="Time" ampm={false} />
              </DemoContainer>
            </LocalizationProvider>
            <h6 style={{ paddingLeft: "15px" }}>
              At what time will it be possible to book?
            </h6>
          </div>
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
        <Button variant="outlined">Back</Button>
        <Button variant="contained">Continue</Button>
      </div>
    </div>
  );
};

export default BookingOpeningDate;
