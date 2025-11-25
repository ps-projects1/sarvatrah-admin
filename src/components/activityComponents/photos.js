import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {  Button, Grid, IconButton, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

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
      navigate("/titel");
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
  
      navigate("/videos", {
        state: {
          ...responseJson,
        },
      });
    } catch (error) {
      alert('An error occurred: ' + error.message);
    }
  };
  
  const goBack = () => {
    navigate("/exclusions");
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
          A photo is worth a thousand words!
        </h2>
        <p style={{ padding: "5px" }}>
          We recommend that you add at least 5 high quality photos to your
          experience with various angles and views
        </p>
      </div>

      <div style={{ width: "70%" }}>
        <Paper
          elevation={7}
          style={{
            padding: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            border: "2px dashed #0000003D",
            borderRadius: "12px",
            height: "200px",
            boxShadow: "none",
            justifyContet: "center",
          }}
          // onDrop={handleDrop}
          // onDragOver={preventDefault}
        >
          <input
            type="file"
            // onChange={handleFileChange}
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
            }}
          >
            <h4>Drag photos here to upload</h4>
            <span>Supported file types are: .png, .jpg, .jpeg</span>
            {/* <span>Maximum file size is 17 MB</span> */}
            <IconButton component="span" size="large">
              {/* <Image src={FileUploadIcon} alt="Image" /> */}
              <CloudUploadIcon /> Browse Your Computer
            </IconButton>
          </label>
        </Paper>
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

      <Grid container sx={{ mt: 5 }} spacing={2}>
        {photos && photos.length > 0
          ? photos?.map((item, index) => (
              <Grid
                item
                xs={4}
                key={index}
                sx={{ mr: 1 }}
                onMouseEnter={() => setShowBackDrop(index)}
                onMouseLeave={() => setShowBackDrop(null)}
              >
                <div style={{ position: "relative" }}>
                  {showBackdrop === index && (
                    <div className="showBackdrop">
                      <DeleteIcon
                        sx={{ color: "white", cursor: "pointer" }}
                        onClick={() => deletePhoto(index)}
                      />
                      {/* <EditIcon sx={{ color: "white", cursor: "pointer" }} /> */}
                    </div>
                  )}
                  <img
                    src={item?.path}
                    height="100%"
                    alt="Uploaded content"
                    width="100%"
                    style={{ maxHeight: "300px" }}
                  />
                </div>
              </Grid>
            ))
          : null}
      </Grid>
    </div>
  );
};

export default Photos;
