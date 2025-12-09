import { Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  HeaderSection,
  FormContainer,
  FooterButtons,
  CardContainer,
} from "./SharedStyles";

const Titel = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();
  const _id = localStorage.getItem("_id");
  const [id] = useState(_id);
  console.log(id, "id");

  useEffect(() => {
    (async function () {
      try {
        if (id) {
          const response = await fetch(
            `${process.env.REACT_APP_API_BASE_URL}/experience/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const responseJson = await response.json();
          console.log(responseJson, "responseJson");
          setTitle(responseJson.title);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createExperience = async () => {
    if (!title) {
      alert("Please enter a title for your experience");
      return;
    }
    console.log(title);
    const data = {
      title: title,
    };
    console.log(data);
    const queryParams = new URLSearchParams({
      title: title,
    });
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience?${queryParams.toString()}`,
      {
        method: "POST",
      }
    );
    console.log(response, "response");
    if (!response.ok) {
      alert("Something went wrong");
      return;
    }
    const responseJson = await response.json();
    console.log(responseJson, "responseJson");
    localStorage.setItem("_id", responseJson._id);
    navigate("/activity/duration", {
      state: {
        title: title,
        _id: responseJson._id,
      },
    });
  };

  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>Give your experience a short but descriptive name</h2>
        <p>
          We recommend using simple language, keep it less than 80 characters,
          and mention what and where the experience is
        </p>
      </HeaderSection>

      <FormContainer>
        <CardContainer elevation={0}>
          <TextField
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            value={title}
            id="outlined-basic"
            label="Experience Title"
            variant="outlined"
            placeholder="e.g., Guided Tour of Historic Downtown Mumbai"
            helperText={`${title.length}/80 characters`}
            inputProps={{ maxLength: 80 }}
          />
        </CardContainer>
      </FormContainer>

      <FooterButtons>
        <Button variant="outlined" disabled>
          Back
        </Button>
        <Button variant="contained" onClick={createExperience}>
          Continue
        </Button>
      </FooterButtons>
    </PageContainer>
  );
};

export default Titel;
