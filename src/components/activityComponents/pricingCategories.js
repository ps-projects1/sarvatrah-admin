import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
const style = {
  marginTop: "10px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: "20px",
  "@media(max-height: 890px)": {
    top: "0",
    transform: "translate(-50%, 0%)",
  },
};

const PricingCategories = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { _id } = location.state ? location.state : {};
  const localID = localStorage.getItem("_id");
  const [experienceId] = useState(localID || "");
  const [open, setOpen] = React.useState(false);

  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [rows, setRows] = useState();
  const [temp_Id, setTemp_Id] = useState(1);

  const [formData, setFormData] = useState({
    _id: temp_Id,
    categories: "",
    occupancy: 0,
    isAgeRestricted: false,
    min_age: null,
    max_age: null,
  });
  const handleOpen = () => {
    setTemp_Id((temp_Id) => temp_Id + 1);

    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  

  useEffect(() => {
    if (experienceId && experienceId?.length > 0) {
      (async function () {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`
,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const responseJson = await response.json();
        const { pricing } = responseJson;
        if (!pricing && pricing?.length === 0) {
          return;
        }
        setRows(pricing);
      })();
      return;
    }
    if (!_id && !localID) {
      navigate("/titel");
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const goBack = () => {
    navigate("/calendar");
  };
  //travelling_facility
  const handleSwitchChange = () => {
    setFormData({
      _id: temp_Id,
      categories: categories[0],
      occupancy: 0,
      isAgeRestricted: !isSwitchOn,
      min_age: !isSwitchOn ? 13 : null,
      max_age: !isSwitchOn ? 50 : null,
    });
    setIsSwitchOn((prev) => !prev);
  };
  const handleNext = () => {
    setRows([...rows, formData]);
    setTemp_Id((temp_Id) => temp_Id + 1);
    setFormData({
      _id: temp_Id,
      categories: categories[0],
      occupancy: 0,
      isAgeRestricted: false,
      min_age: null,
      max_age: null,
    });
    handleClose();
  };

  
  const submit = async () => {
    if (rows.length === 0) {
      alert("Please add atleast one pricing category");
      return;
    }
    const pricingRows = rows.map((row) => {
      return {
        ticket_category: row.categories?.value,
        occupancy: row.occupancy,
        min_age: row.min_age,
        max_age: row.max_age,
        price: row.price,
      };
    });
    const data = {
      pricing: pricingRows,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/pricing/${experienceId}`
,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const data2 = await response.json();
    console.log(data2);
    navigate("/meetingPickup", { state: { ...data2 } });
  };

  
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ overflowY: "scroll" }}
      >
        <Box sx={style}>
          <div style={{ borderBottom: "1px solid", padding: "10px" }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create Pricing Category
            </Typography>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div
              style={{
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h6>Ticket Category</h6>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={categories}
                  sx={{ width: "263px" }}
                  size="small"
                  value={
                    categories.find(
                      (option) => option.label === formData.categories.label
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      categories: newValue,
                    });
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
              <div>
                <h6>Occupancy</h6>
                <TextField
                  style={{ width: "263px" }}
                  id="outlined-number"
                  // label="Hours"
                  type="number"
                  size="small"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      occupancy: e.target.value,
                    });
                  }}
                  value={formData?.occupancy}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </div>
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <h6 style={{ marginBottom: 0 }}>Age restrictions</h6>
                <div>
                  <Switch checked={isSwitchOn} onChange={handleSwitchChange} />
                </div>
              </div>
              {isSwitchOn && (
                <div style={{ padding: "10px" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div>
                      <TextField
                        style={{ width: "263px" }}
                        id="outlined-number"
                        label="MIN"
                        type="number"
                        value={formData?.min_age}
                        size="small"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            min_age: e.target.value,
                          });
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div>
                      <TextField
                        style={{ width: "263px" }}
                        id="outlined-number"
                        label="MAX"
                        type="number"
                        value={formData?.max_age}
                        size="small"
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            max_age: parseFloat(e.target.value),
                          });
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "40px",
            }}
          >
            <Button onClick={handleClose} variant="outlined">
              Back
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Continue
            </Button>
          </div>
        </Box>
      </Modal>
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
            Establish your pricing categories
          </h2>
          ``
          <p style={{ padding: "5px", textAlign: "center" }}>
            You can define different types of travellers, such as adults,
            children, and groups. This will allow you to charge different prices
            for each pricing category, so that you can tailor your pricing to
            the specific needs of your travellers
          </p>
        </div>

        <div style={{ width: "70%" }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid",
              }}
            >
              <h5>Selected pricing categories</h5>
              <h5>
                <Button onClick={handleOpen} variant="outlined">
                  +Add Pricing Category
                </Button>
              </h5>
            </div>
            <div
              style={{
                padding: "10px",
                border: "1px solid",
                borderRadius: "7px",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              {rows?.map((row, index) => (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid",
                    padding: "10px",
                  }}
                  key={index}
                >
                  <FormGroup>
                    <FormControlLabel
                      style={{ margin: 0 }}
                      control={<Checkbox />}
                      label={
                        row?.categories?.label
                          ? row?.categories?.label
                          : row?.ticket_category
                      }
                      onChange={(e) => {
                        console.log(e, "test");
                      }}
                    />
                  </FormGroup>
                  <TextField
                    id="outlined-basic"
                    label="Price"
                    variant="outlined"
                    size="small"
                    value={row?.price || ""}
                    onChange={(e) => {
                      setRows(
                        rows?.map((r) => {
                          console.log(r, "test");
                          return r._id === row._id
                            ? { ...r, price: parseFloat(e.target.value) }
                            : r;
                        })
                      );
                    }}
                  ></TextField>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              {/* <Button variant="contained" onClick={handlePricingSubmit}>
                Submit
              </Button> */}
            </div>
          </div>

       
        </div>

        <div></div>

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
    </>
  );
};

export default PricingCategories;

const categories = [
  { label: "Adult", value: "adult" },
  { label: "Child", value: "child" },
  { label: "Teenager", value: "teenager" },
  { label: "Infant", value: "infant" },
  { label: "Senior", value: "senior" },
  { label: "Student", value: "student" },
  { label: "Military", value: "military" },
  { label: "Group", value: "group" },
  { label: "Other", value: "other" },
];
// enum: [
//   "adult",
//   "child",
//   "teenager",
//   "infant",
//   "senior",
//   "student",
//   "military",
//   "group",
//   "other",
// ],
