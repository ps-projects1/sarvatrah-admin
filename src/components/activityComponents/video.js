import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useLocation, useNavigate } from "react-router-dom";
const Videos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id } = location.state ? location.state : {};
  const [videoLinks, setVideoLinks] = useState([""]);
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
        const { video_link } = responseJson;
        if (!video_link && video_link.length === 0) {
          return;
        }
        setVideoLinks(video_link);
      })();
      return;
    }
    if (!experienceId && experienceId.length === 0) {
      alert("please add titel and categories");
      navigate("/titel");
      return;
    }
  }, []);
  const submit = async () => {
    if (videoLinks.length === 0) {
      alert("please add videos");
      return;
    }
    const data = {
      video_link: videoLinks,
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
    navigate("/timeDatePass", {
      state: {
        ...responseJson,
      },
    });
  };
  const goBack = () => {
    navigate("/photos");
  };
  const handleVideoLinkChange = (index, value) => {
    const newLinks = [...videoLinks];
    newLinks[index] = value;
    setVideoLinks(newLinks);
  };

  const addVideoLink = () => {
    setVideoLinks([...videoLinks, ""]);
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
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontWeight: "bold", padding: "5px" }}>
          Want to add videos to your experience?
        </h2>
        <p style={{ padding: "5px" }}>
          Show travellers even more details about your experience to give your
          travellers a better idea of what to expect
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <div style={{ padding: "20px" }}>
          <h5>Video links</h5>
          <span style={{ fontStyle: "italic", paddingBottom: "5px" }}>
            Paste in links from Youtube / Vimeo
          </span>
          {videoLinks.map((link, index) => (
            <TextField
              key={index}
              fullWidth
              id={`outlined-basic-${index}`}
              variant="outlined"
              size="small"
              value={link}
              onChange={(e) => handleVideoLinkChange(index, e.target.value)}
            />
          ))}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="outlined" onClick={addVideoLink}>
              Add onether one
            </Button>
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

export default Videos;
