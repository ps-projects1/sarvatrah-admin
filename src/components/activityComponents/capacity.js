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

const Capacity = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const localId = localStorage.getItem("_id");
  const [experienceId, setExperienceId] = useState(localId ? localId : "");
  const [capacity, setCapacity] = useState("");
  const goBack = () => {
    navigate("/bookingCutoff");
  };
  useEffect(() => {
    if (experienceId && experienceId.length > 0) {
      (async function () {
        const response = await fetch(
          "http://localhost:3232/experience/" + experienceId,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        const { capacity } = responseJson;
        if (!capacity) {
          return;
        }
        setCapacity(capacity);
      })();
    }
    if (!experienceId && experienceId.length === 0) {
      alert("please add titel and categories");
      navigate("/titel");
      return;
    }
  }, []);

  const submit = async () => {
    if (capacity.length === 0) {
      alert("please fill in all the fields");
      return;
    }
    const data = {
      capacity,
    };
    const response = await fetch(
      "http://localhost:3232/experience/" + experienceId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    navigate("/startTime", {
      state: {
        ...data,
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
          What is your experience's capacity?
        </h2>
        <p style={{ padding: "5px" }}>
          Do you have a maximum number of travellers per departure, or do you
          review and approve each booking individually?
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <FormControl style={{ width: "100%" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="radio-buttons-group"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
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
                value="sale"
                control={
                  <Radio
                    value={"sale"}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                }
              />
              <div>
                <h5>Free sale (unlimited)</h5>
                <span>
                  There is no limit. Confirm as many bookings as possible.
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
                value="limited"
                control={
                  <Radio
                    value={"limited"}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                }
              />
              <div>
                <h5>Limited number</h5>
                <span>
                  I have limited capacity. Bookings should only be confirmed as
                  long as there are seats remaining.
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
                value="on_request"
                control={
                  <Radio
                    value={"on_request"}
                    onChange={(e) => setCapacity(e.target.value)}
                  />
                }
              />
              <div>
                <h5>On request (not recommended)</h5>
                <span>
                  Bookings cannot be confirmed immediately. The customer waits
                  until I manually confirm or reject their booking request.
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

export default Capacity;
