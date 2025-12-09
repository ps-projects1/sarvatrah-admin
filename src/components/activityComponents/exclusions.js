import {
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  PageContainer,
  HeaderSection,
  FormContainer,
  FooterButtons,
  SectionTitle,
} from "./SharedStyles";

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

const Exclusions = () => {
  const navigate = useNavigate();
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId ? localId : "");
  
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
        const { exclusions } = responseJson;
        if (!exclusions) {
          return;
        }
        setShortDescription(exclusions.short_des);
        setDescription(exclusions.detail_dec);
      })();
      return;
    }
    if (!experienceId) {
      alert("Please fill in all the fields");
      return;
    }
  }, [experienceId]);
  
  const goBack = () => {
    navigate("/activity/inclusions"); // Updated path
  };
  
  const handleSubmit = async () => {
    if (!shortDescription.length > 0 && !description.length > 0) {
      alert("Please fill in all the fields");
      return;
    }
    const data = {
      exclusions: { short_des: shortDescription, detail_dec: description },
    };
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const responseJson = await res.json();
    if (!res.ok) {
      alert(responseJson.message);
      return;
    }
    navigate("/activity/photos", { // Updated path
      state: {
        ...responseJson,
      },
    });
  };
  
  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>What is NOT included in your experience?</h2>
        <p>
          Is there anything your travellers may need that is not included in
          your offering? Example: Food, Equipment or Additional fees
        </p>
      </HeaderSection>

      <FormContainer>
        <div className="form-section">
          <SectionTitle>Exclusions Summary</SectionTitle>
          <span className="form-hint">
            Is there something that's not included but can be purchased on the
            day of travel?
          </span>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder="e.g., Personal expenses, Travel insurance, Tips..."
            value={shortDescription || ""}
            onChange={(e) => {
              console.log(e);
              setShortDescription(e?.target?.value);
            }}
            multiline
            rows={2}
          />
        </div>

        <div className="form-section" style={{ marginBottom: "80px" }}>
          <SectionTitle>Detailed Exclusions</SectionTitle>
          <span className="form-hint">
            If you need to add more details about what is excluded, you can use
            the text field below
          </span>
          <ReactQuill
            style={{
              height: "200px",
              marginBottom: "60px",
              border: "1px solid #ddd",
              borderRadius: "8px"
            }}
            modules={modules}
            formats={formats}
            value={description || ""}
            onChange={(e) => {
              setDescription(e);
            }}
            placeholder="Provide detailed information about exclusions..."
          />
        </div>
      </FormContainer>

      <FooterButtons>
        <Button variant="outlined" onClick={goBack}>
          Back
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Continue
        </Button>
      </FooterButtons>
    </PageContainer>
  );
};

export default Exclusions;