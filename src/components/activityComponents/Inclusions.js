import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export const modules = {
  toolbar: [
    [{ size: [] }],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "bullet" }, { list: "ordered" }],
    ["link", "image", "code-block", "blockquote"],
  ],
  clipboard: {
    matchVisual: false,
  },
};
export const formats = [
  "size",
  "align",
  "color",
  "background",
  "bold",
  "italic",
  "underline",
  "strike",
  "bullet",
  "list",
  "link",
  "image",
  "code-block",
  "blockquote",
];

const Inclusions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const localId = localStorage.getItem("_id");
  const [experienceId, setExperienceId] = useState(localId ? localId : "");
  const [short_description, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
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
        const { inclusions } = responseJson;
        if (!inclusions) {
          return;
        }
        setShortDescription(inclusions.short_des);
        setDescription(inclusions.detail_dec);
      })();
      return;
    }
    if (!experienceId) {
      alert("please add titel and categories");
      navigate("/titel");
    }
  }, []);
  const goBack = () => {
    navigate("/description"); // Change "/location" to the desired location path
  };
  const submit = async () => {
    if (!short_description) {
      alert("Please enter the short description");
      return;
    }
    if (!description) {
      alert("Please enter the description");
      return;
    }
    const data = {
      inclusions: { short_des: short_description, detail_dec: description },
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
    navigate("/exclusions", {
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
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontWeight: "bold", padding: "5px" }}>
          What is included in your experience?
        </h2>
        <p style={{ padding: "5px", textAlign: "center" }}>
          Let travellers know what is provided to help them understand what
          they're paying for. Include items such as food and drinks, special
          equipment, and admission fees
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <div style={{ padding: "20px" }}>
          <h5>Inclusions</h5>
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              paddingBottom: "5px",
              fontSize: "smaller",
            }}
          >
            Use the inclusions to highlight any fees, equipment, or other items
            that are included in your pricing.
          </span>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            size="small"
            value={short_description}
            onChange={(e) => setShortDescription(e.target.value)}
          />
        </div>
        <div style={{ padding: "20px" }}>
          <span style={{ fontStyle: "italic", paddingBottom: "5px" }}>
            If you need to add more details about what is included, you can use
            the text field below.
          </span>
          <ReactQuill
            style={{ height: "150px" }}
            modules={modules}
            formats={formats}
            value={description}
            onChange={(e) => setDescription(e)}
            // value={editorValue}
            // {...restProps}
            // onChange={handleEditorChange}
          />
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

export default Inclusions;
