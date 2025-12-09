import { Button, TextField } from "@mui/material";
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

const Description = () => {
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
        console.log(responseJson, "responseJson");
        const { description } = responseJson;
        if (!description) {
          return;
        }
        setDescription(description.detail_dec);
        setShortDescription(description.short_des);
      })();
    }
    if (!experienceId) {
      alert("please add titel and categories");
      navigate("/activity/titel"); // Updated path
      return;
    }
  }, [experienceId, navigate]);
  
  const submit = async () => {
    if (!shortDescription) {
      alert("Please enter the short description");
      return;
    }
    if (!description) {
      alert("Please enter the description");
      return;
    }
    const data = {
      description: { short_des: shortDescription, detail_dec: description },
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
      alert(responseJson.message);
      return;
    }
    navigate("/activity/inclusions", { // Updated path
      state: {
        ...responseJson,
      },
    });
  };
  
  const goBack = () => {
    navigate("/activity/categories"); // Updated path
  };

  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>Tell your travellers what the experience is all about</h2>
        <p>
          Describe your experience in detail, using exciting and engaging
          language to capture the essence of the experience
        </p>
      </HeaderSection>

      <FormContainer>
        <div className="form-section">
          <SectionTitle>Short Description</SectionTitle>
          <span className="form-hint">
            Brief overview of the experience - this will be displayed on product
            cards in search results
          </span>
          <TextField
            fullWidth
            id="outlined-basic"
            variant="outlined"
            placeholder="Write a compelling summary that captures attention..."
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            multiline
            rows={2}
            helperText={`${shortDescription.length} characters`}
          />
        </div>

        <div className="form-section" style={{ marginBottom: "80px" }}>
          <SectionTitle>Detailed Description</SectionTitle>
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
            placeholder="Provide a detailed description of your experience..."
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

export default Description;