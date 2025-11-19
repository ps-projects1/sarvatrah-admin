import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Duration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const _id = localStorage.getItem("_id");
  const [duration, setDuration] = useState({
    days: "",
    hours: "",
    minutes: "",
  });
  const [experienceId, setExperienceId] = useState(_id);
  useEffect(() => {
    if (_id) {
      setExperienceId(_id);
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
        const { duration } = responseJson;
        if (!duration) {
          return;
        }
        const durationInString = duration.split(":");
        console.log(durationInString, "durationInString");
        setDuration({
          days: durationInString[0],
          hours: durationInString[1],
          minutes: durationInString[2],
        });
      })();
    } else if (!experienceId && experienceId.length === 0) {
      alert("please add titel and categories");
      navigate("/titel");
    }
  }, []);
  const submit = async () => {
    if (
      !duration.days ||
      !duration.hours ||
      !duration.minutes ||
      !duration.days.trim() ||
      !duration.hours.trim() ||
      !duration.minutes.trim()
    ) {
      alert("Please fill in all the fields");
      return;
    }
    const durationInString = `${duration.days}:${duration.hours}:${duration.minutes}`;
    const query = new URLSearchParams({
      duration: durationInString,
    });

    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}?${query.toString()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ duration: durationInString }),
      }
    );
    const responseJson = await response.json();
    if (!response.ok) {
      alert(responseJson.message);
      return;
    }
    navigate("/location", {
      state: {
        ...responseJson,
      },
    });
  };
  const goBack = () => {
    navigate("/titel");
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
          What is the total duration of your experience?
        </h2>
        <p style={{ padding: "5px" }}>
          Inform your travellers about the duration of your experience so they
          can plan their time accordingly
        </p>
      </div>

      <div style={{ width: "30%", display: "flex", gap: "20px" }}>
        <TextField
          id="outlined-number"
          label="Days"
          type="number"
          placeholder="days"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) =>
            setDuration((prev) => ({ ...prev, days: e.target.value }))
          }
          value={duration.days}
        />
        <TextField
          id="outlined-number"
          label="Hours"
          type="number"
          placeholder="hh"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) =>
            setDuration((prev) => ({ ...prev, hours: e.target.value }))
          }
          value={duration.hours}
        />
        <TextField
          id="outlined-number"
          label="Minutes"
          type="number"
          placeholder="mm"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(e) =>
            setDuration((prev) => ({ ...prev, minutes: e.target.value }))
          }
          value={duration.minutes}
        />
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

export default Duration;
