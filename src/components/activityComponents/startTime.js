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
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
function createData(id, time, duration, linkedRates, buttons) {
  return { id, time, duration, linkedRates, buttons };
}

const style = {
  marginTop: "10px",
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: "20px",
  "@media(max-height: 890px)": {
    top: "0",
    transform: "translate(-50%, 0%)",
  },
};

const StartTime = () => {
  const navigate = useNavigate();
  const localID = localStorage.getItem("_id");
  const [experienceId] = useState(localID ? localID : null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    time: "",
    duration: "",
    internalLabel: "",
    externalLabel: "",
    linkedRates: "",
  });
  const [totalData, setTotalData] = useState(1);
  const [editingId, setEditingId] = useState(-1);
  const timePickerRef = useRef(null);

  //"2825752", "12:00 PM", "1 hour", "Standard rate", "Edit/Delete"
  const [rows, setRows] = useState([]);
  const goBack = () => {
    navigate("/capacity");
  };
  useEffect(() => {
    if (experienceId && experienceId.length > 0) {
      (async () => {
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
        const { start_time } = await response.json();
        if (start_time && start_time.length > 0) {
          const modifiedRows = start_time.map((row) => ({
            ...row,
            time: row.start_time,
          }));
          setRows(modifiedRows);
          setTotalData(start_time.length);
        }
      })();
      return;
    }


  }, [experienceId]);
  const createStartTime = async () => {
    if (editingId !== -1) {
      rows[editingId] = {
        id: rows[editingId].id,
        time: formData.time,
        duration: formData.duration,
        linkedRates: formData.linkedRates,
        buttons: "Edit/Delete",
      };
      setEditingId(-1);
      setRows([...rows]);
      setFormData({
        time: "",
        duration: "",
        internalLabel: "",
        externalLabel: "",
        linkedRates: "",
      });
      handleClose();
      return;
    }
    setTotalData((prev) => prev + 1);
    createData(
      totalData,
      formData.time,
      formData.duration,
      formData.linkedRates,
      "Edit/Delete"
    );
    setRows((rows) => [
      ...rows,
      {
        id: totalData,
        time: formData.time,
        duration: formData.duration,
        linkedRates: formData.linkedRates,
        internalLabel: formData.internalLabel,
        externalLabel: formData.externalLabel,
      },
    ]);
    handleClose();
  };
  const handleDelete = (id) => {
    setRows((rows) => rows.filter((row) => row.id !== id));
    setTotalData((prev) => prev - 1);
  };
  const handleEdit = (id) => {
    setFormData({
      time: rows[id]?.time,
      duration: rows[id]?.duration,
      linkedRates: rows[id]?.linkedRates,
    });
    handleOpen();
  };
  const submit = async () => {
    if (rows.length === 0) {
      alert("Please add start time");
      return;
    }
    console.log(rows);
    const updatedRows = rows.map((row) => {
      return {
        start_time: row.time,
        duration: row.duration,
        internal_label: row.internalLabel,
        external_label: row.externalLabel,
        product_code: row.linkedRates,
      };
    });
    const data = {
      availability_detail: [...updatedRows],
    };
    const response = await fetch(
`${process.env.REACT_APP_API_BASE_URL}/experience/updateTiming/${experienceId}`
,      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const data2 = await response.json();
    navigate("/calendar", {
      state: {
        ...data2,
      },
    });
  };
  const onKeyDown = (e) => {
    // Prevent keyboard input in the TimePicker
    if (timePickerRef.current?.contains(e.target)) {
      e.preventDefault();
    }
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
              Add start time
            </Typography>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ padding: "10px" }} onKeyDown={onKeyDown}>
              <h6>Start time / departure</h6>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["TimePicker"]}>
                  <TimePicker
                    inputReadOnly
                    onChange={(e) => {
                      console.log("time");
                      console.log(e?.format("HH:mm"));
                      setFormData({ ...formData, time: e?.format("HH:mm") });
                    }}
                    size="small"
                    ref={timePickerRef}
                    ampm={false}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Duration</h6>
              <div style={{ display: "flex" }}>
                <div>
                  <TextField
                    style={{ width: "100px", paddingRight: "10px" }}
                    id="outlined-number"
                    // label="Hours"
                    type="number"
                    size="small"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        duration: `${e.target.value}:${
                          formData.duration.split(":")[1]
                            ? formData.duration.split(":")[1]
                            : "00"
                        }`,
                      });
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <div style={{ fontStyle: "italic" }}>Hours</div>
                </div>
                <div>
                  <TextField
                    style={{ width: "100px", paddingRight: "10px" }}
                    id="outlined-number"
                    // label="Minutes"
                    type="number"
                    size="small"
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        duration: `${
                          formData.duration.split(":")[0]
                            ? formData.duration.split(":")[0]
                            : "00"
                        }:${e.target.value}`,
                      });
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <div style={{ fontStyle: "italic" }}>Minutes</div>
                </div>
              </div>
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Internal label (Only visible for me)</h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                This internal label can be helpful when you have multiple start
                times at the same time. Only your company will be able to see
                this
              </span>
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setFormData({ ...formData, internalLabel: e.target.value });
                }}
              />
            </div>
            <div style={{ padding: "10px" }}>
              <h6>External Label (Visible to customers)</h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                This internal label can be helpful when you have multiple start
                times at the same time. Only your company will be able to see
                this
              </span>
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setFormData({ ...formData, externalLabel: e.target.value });
                }}
              />
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Product code</h6>
              {/* <span style={{ fontStyle: 'italic', paddingBottom: '5px', fontSize: '15px' }}>This internal label can be helpful when you have multiple start times at the same time. Only your company will be able to see this</span> */}
              <TextField
                fullWidth
                id="outlined-basic"
                variant="outlined"
                size="small"
                onChange={(e) => {
                  setFormData({ ...formData, linkedRates: e.target.value });
                }}
              />
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
            <Button variant="contained" onClick={createStartTime}>
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
                  <TableCell sx={{ width: "30px" }}>#</TableCell>
                  <TableCell sx={{ width: "30px" }} align="center">
                    Time
                  </TableCell>
                  <TableCell sx={{ width: "30px" }} align="center">
                    Duration
                  </TableCell>
                  <TableCell sx={{ width: "30px" }} align="center">
                    Linked Rates
                  </TableCell>
                  <TableCell sx={{ width: "30px" }} align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.time}</TableCell>
                    <TableCell align="center">{row.duration}</TableCell>
                    <TableCell align="center">{row.linkedRates}</TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          handleDelete(row.id);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingId(row.id);
                          handleEdit(row.id);
                        }}
                      >
                        Edit
                      </Button>
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
            + Add Start Time
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

export default StartTime;
