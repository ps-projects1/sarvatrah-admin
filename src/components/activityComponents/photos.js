import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {  Button, Grid, IconButton, Paper, Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  PageContainer,
  HeaderSection,
  FooterButtons,
  CardContainer,
} from "./SharedStyles";

const Photos = () => {
  const navigate = useNavigate();
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId ? localId : "");
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState([]);
  const [showBackdrop, setShowBackDrop] = useState(null);
  
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
        const { img_link } = responseJson;
        if (!img_link || !img_link.length) {
          return;
        }
        setPhotos(img_link);
      })();
      return;
    }
    if (!experienceId) {
      alert("please add titel and categories");
      navigate("/activity/titel"); // Updated path
    }
  }, [experienceId,navigate]);
  
  const submit = async () => {
    if (photos.length === 0) {
      alert("please add photos");
      return;
    }
  
    const formData = new FormData();
    photoFile.forEach((photo, index) => {
      formData.append(`img_link`, photo);
    });
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,
        {
          method: "PUT",
          body: formData,
        }
      );
  
      const responseJson = await response.json();
  
      if (!response.ok) {
        alert(responseJson.error);
        return;
      }
  
      navigate("/activity/videos", { // Updated path
        state: {
          ...responseJson,
        },
      });
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };
  
  const goBack = () => {
    navigate("/activity/exclusions"); // Updated path
  };
  

  const deletePhoto = (index) => {
    setPhotos((prevPhotos) => {
      return [...prevPhotos.slice(0, index), ...prevPhotos.slice(index + 1)];
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    const newPhotos = [];
  
    const processFile = async (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
  
        reader.onload = () => {
          const temp = {
            filename: file.name,
            path: reader.result,
            mimetype: file.type,
          };
          newPhotos.push(temp);
          resolve();
        };
  
        reader.onerror = reject;
  
        reader.readAsDataURL(file);
      });
    };
  
    const processAllFiles = async () => {
      for (const file of files) {
        await processFile(file);
      }
  
      // Update state after processing all files
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setPhotoFile([...files]);
    };
  
    processAllFiles();
  };
  


  return (
    <PageContainer maxWidth="lg">
      <HeaderSection>
        <h2>A photo is worth a thousand words!</h2>
        <p>
          We recommend that you add at least 5 high quality photos to your
          experience with various angles and views
        </p>
      </HeaderSection>

      <Box width="100%" maxWidth="800px" mb={4}>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 3,
            minHeight: "220px",
            justifyContent: "center",
            bgcolor: "background.default",
            transition: "all 0.2s",
            "&:hover": {
              borderColor: "primary.main",
              bgcolor: "primary.light",
              opacity: 0.05,
            }
          }}
        >
          <input
            type="file"
            style={{ display: "none" }}
            id="file-upload-input"
            accept="image/*"
            onChange={handleImageChange}
            multiple
          />
          <label
            htmlFor="file-upload-input"
            style={{
              height: "100%",
              width: "100%",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
            <Box>
              <h4 style={{ margin: "8px 0" }}>Drag photos here to upload</h4>
              <span style={{ color: "#666", fontSize: "0.875rem" }}>
                Supported file types: .png, .jpg, .jpeg
              </span>
            </Box>
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />}>
              Browse Your Computer
            </Button>
          </label>
        </Paper>
      </Box>

      {photos && photos.length > 0 && (
        <Box width="100%" maxWidth="800px" mb={4}>
          <h3 style={{ marginBottom: "16px" }}>Uploaded Photos ({photos.length})</h3>
          <Grid container spacing={2}>
            {photos.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  position="relative"
                  borderRadius={2}
                  overflow="hidden"
                  sx={{
                    "&:hover .delete-overlay": {
                      opacity: 1,
                    }
                  }}
                  onMouseEnter={() => setShowBackDrop(index)}
                  onMouseLeave={() => setShowBackDrop(null)}
                >
                  {showBackdrop === index && (
                    <Box
                      className="delete-overlay"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bgcolor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                        zIndex: 1,
                      }}
                    >
                      <IconButton
                        onClick={() => deletePhoto(index)}
                        sx={{
                          color: "white",
                          bgcolor: "error.main",
                          "&:hover": {
                            bgcolor: "error.dark",
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                  <img
                    src={item?.path}
                    alt={`Upload ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

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

export default Photos;