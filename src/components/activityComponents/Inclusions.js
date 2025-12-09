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

const Inclusions = () => {
  const navigate = useNavigate();
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId ? localId : "");
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
      navigate("/activity/titel"); // Updated path
    }
  }, [experienceId, navigate]);
  
  const goBack = () => {
    navigate("/activity/description"); // Updated path
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
    navigate("/activity/exclusions", { // Updated path
      state: {
        ...responseJson,
      },
    });
  };

  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>What is included in your experience?</h2>
        <p>
          Let travellers know what is provided to help them understand what
          they're paying for. Include items such as food and drinks, special
          equipment, and admission fees
        </p>
      </HeaderSection>

      <FormContainer>
        <div className="form-section">
          <SectionTitle>Inclusions Summary</SectionTitle>
          <span className="form-hint">
            Use the inclusions to highlight any fees, equipment, or other items
            that are included in your pricing
          </span>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder="e.g., Free parking, Equipment rental, Entrance fees..."
            value={short_description}
            onChange={(e) => setShortDescription(e.target.value)}
            multiline
            rows={2}
          />
        </div>

        <div className="form-section" style={{ marginBottom: "80px" }}>
          <SectionTitle>Detailed Inclusions</SectionTitle>
          <span className="form-hint">
            If you need to add more details about what is included, you can use
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
            value={description}
            onChange={(e) => setDescription(e)}
            placeholder="Provide detailed information about inclusions..."
          />
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

export default Inclusions;