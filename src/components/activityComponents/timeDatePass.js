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
const TimeDatePass = () => {
  const [type, setType] = useState("date_time");
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
        const responseJson = await response.json();
        console.log(responseJson, "responseJson");
        if (
          !responseJson.availabilityType ||
          (responseJson.availabilityType &&
            responseJson.availabilityType.length === 0)
        ) {
          console.log("test");
          return;
        }
        setType(responseJson.availabilityType);
      })();

      return;
    }
    if (!experienceId && experienceId.length === 0) {
      alert("please add titel and categories");
      navigate("/titel");
      return;
    }
  }, []);
  const goBack = () => {
    navigate("/videos");
  };
  const submit = async () => {
    const data = {
      availabilityType: type,
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
    const responseJson = await response.json();
    if (!response.ok) {
      alert(responseJson.error);
      return;
    }
    navigate("/openingHours", {
      state: {
        ...responseJson,
      },
    });
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
          How is your experience scheduled?
        </h2>
        <p style={{ padding: "5px" }}>
          Is the experience scheduled by the hour, day, or is it flexible?
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <FormControl style={{ width: "100%" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            onChange={(e) => setType(e.target.value)}
            value={type}
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
                control={<Radio onChange={() => setType("date_time")} />}
              />
              <div>
                <h5>Date and Time</h5>
                <span>
                  Customers select both date and time when booking this product
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
                control={<Radio onChange={() => setType("date")} />}
              />
              <div>
                <h5>Just date, no time</h5>
                <span>
                  Customers must select a date when booking, but no need to
                  specify time within the day
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
                control={<Radio onChange={() => setType("pass")} />}
              />
              <div>
                <h5>Pass</h5>
                <span>
                  No date is selected when booking this product. It is more of a
                  pass than a date based ticket
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

export default TimeDatePass;

//   enum: ["date_time", "date", "pass"],
