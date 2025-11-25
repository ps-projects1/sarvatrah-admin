import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const style = {
  marginTop: "10px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  boxShadow: 24,
  p: "20px",
  "@media(max-height: 890px)": {
    top: "0",
    transform: "translate(-50%, 0%)",
  },
};

const MeetingPoint = () => {
  const navigate = useNavigate();
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId ? localId : "");
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [formData, setFormData] = useState({
    titel: "",
    address: "",
    link: "",
    pickup:"",
    drop:"",
    country: "",
    city: "",
    pin_code: "",
  });
  const [rows, setRows] = useState([
    {
      titel: "mota-varaccha",
      address: "mota-varacha",
      country: "India",
      city: "Delhi",
      pin_code: "110001",
      link: "",
      pickup:"",
      drop:"",
    },
  ]);
  useEffect(() => {
    if (experienceId && experienceId.length > 0) {
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
        const { meeting_point } = await response.json();
        console.log(meeting_point);
        if (meeting_point && meeting_point.length > 0) {
          setRows(meeting_point);
        } else {
          setRows([
            {
              titel: "mota-varaccha",
              address: "mota-varacha",
              country: "India",
              city: "Delhi",
              pin_code: "110001",
            },
          ]);
        }
      })();
      return;
    }
    if (!experienceId) {
      alert("Please fill in all the fields");
      return;
    }
  }, [experienceId]);
  const goBack = () => {
    navigate("/meetingPickup");
  };
  const createMeetingPoint = async () => {
    if (editingIndex >= 0) {
      rows[editingIndex] = formData;
      setRows([...rows]);
      setEditingIndex(-1);
      setFormData({
        titel: "",
        address: "",
        country: "",
        city: "",
        pin_code: "",
      });
      handleClose();
      return;
    }
    setRows((rows) => [
      ...rows,
      {
        titel: formData.titel,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        pin_code: formData.pin_code,
        link: formData.link,
        pickup: formData.pickup,
        drop: formData.drop
      },
    ]);
    setFormData({
      titel: "",
      address: "",
      country: "",
      city: "",
      pin_code: "",
      link:"",
      pickup:"",
      drop:""
    });
    handleClose();
  };
  const submit = async () => {
    if (rows.length === 0) {
      alert("Please add atleast one meeting point");
      return;
    }
    const formatedRowWithoutId = rows.map((row) => {
      const { _id, ...rest } = row;
      return rest;
    });
    const removeIds = rows.filter((row) => row._id).map((row) => row._id);
    console.log(removeIds);
    const data = {
      meeting_point: formatedRowWithoutId,
      removeIds: removeIds,
    };
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/meetingPoint/${experienceId}`
,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    localStorage.removeItem("_id");
    console.log(result);
  };
  const handleDelete = (index) => {
    const newRows = [...rows];
    newRows.splice(index, 1);
    setRows(newRows);
  };
  const handleEdit = (index) => {
    setEditingIndex(index);
    const newRows = [...rows];
    const { titel, address, country, city, pin_code, link, pickup, drop } = newRows[index];
    setFormData({ titel, address, country, city, pin_code, link, pickup, drop });
    handleOpen();
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
              Add Start Point
            </Typography>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ padding: "10px" }}>
              <h6>Title</h6>
              {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={formData.titel}
                onChange={(e) =>
                  setFormData({ ...formData, titel: e.target.value })
                }
              />
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Address</h6>
              {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Meeting Point Map Link</h6>
              {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Pickup Location Map Link</h6>
              {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={formData.pickup}
                onChange={(e) =>
                  setFormData({ ...formData, pickup: e.target.value })
                }
              />
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Drop Location Map Link</h6>
              {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                value={formData.drop}
                onChange={(e) =>
                  setFormData({ ...formData, drop: e.target.value })
                }
              />
            </div>
            <div style={{ padding: "10px", display: "flex", gap: "15px" }}>
              <div style={{ width: "300px" }}>
                <h6>Country</h6>
                {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
                <TextField
                  fullWidth
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>
              <div style={{ width: "287px" }}>
                <h6>City</h6>
                {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
                <TextField
                  fullWidth
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <h6>Post code</h6>
                {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
                <TextField
                  fullWidth
                  id="outlined-basic"
                  variant="outlined"
                  size="small"
                  value={formData.pin_code}
                  onChange={(e) =>
                    setFormData({ ...formData, pin_code: e.target.value })
                  }
                />
              </div>
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
            <Button
              variant="contained"
              onClick={() => {
                createMeetingPoint();
              }}
            >
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
            When does the experience start?
          </h2>
          <p style={{ padding: "5px" }}>
            You can schedule multiple start times for each day. Later, you can
            select the specific dates on which you will offer your experience
          </p>
        </div>

        <div
          style={{
            width: "70%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "30px" }}>Title</TableCell>
                  <TableCell sx={{ width: "250px" }} align="left">
                    Address
                  </TableCell>
                  <TableCell sx={{ width: "30px" }} align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow
                    key={index}
                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.titel}
                    </TableCell>
                    <TableCell align="left">{row.address}</TableCell>
                    <TableCell align="center">
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(index)}>
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            onClick={handleOpen}
            style={{ marginTop: "10px" }}
            variant="contained"
          >
            + Add Start Point
          </Button>
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
    </>
  );
};

export default MeetingPoint;
