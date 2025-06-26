import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Table,
  FormControlLabel,
  Modal,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  Switch,
} from "@mui/material";
import React, { useState, useEffect } from "react";

function createData(id, categories, times, setDefault, buttons) {
  return { id, categories, times, setDefault, buttons };
}

const rows = [
  createData(
    "Standard rate | #15925032",
    "2 pricing categories",
    "All start times",
    "Set as default",
    "Edit/ Remove/ Clone"
  ),
];

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

const Rates = () => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
              Add rate
            </Typography>
          </div>
          <div style={{ marginTop: "10px" }}>
            <div style={{ padding: "10px" }}>
              <h6>Title</h6>
              <div>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  size="small"
                  variant="outlined"
                />
              </div>
            </div>

            <div style={{ padding: "10px" }}>
              <h6 style={{ margin: 0 }}>Passenger price is per person</h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                If you disable this the pricing will be per booking for this
                rate. Tiered pricing will not be enabled if pricing is per
                booking.
              </span>
              <div>
                <FormControlLabel control={<Switch />} />
              </div>
            </div>
            <div style={{ padding: "10px" }}>
              <h6 style={{ margin: 0 }}>
                Pricing categories available for this rate
              </h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                Select the pricing categories that can be used for this rate.
              </span>
              <div>
                <FormControlLabel
                  control={<Switch />}
                  label="All pricing categories"
                />
              </div>
            </div>
            <div style={{ padding: "10px" }}>
              <h6 style={{ margin: 0 }}>Start times that offer this rate</h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                Select the start times that offer this rate.
              </span>
              <div>
                <FormControlLabel
                  control={<Switch />}
                  label="All start times"
                />
              </div>
            </div>

            <div style={{ padding: "10px", display: "flex", gap: "20px" }}>
              <div>
                <h6 style={{ margin: 0 }}>Min. passengers per booking</h6>
                <span
                  style={{
                    fontStyle: "italic",
                    paddingBottom: "5px",
                    fontSize: "12px",
                  }}
                >
                  This is useful if you want to have a group rate.
                </span>
                <div>
                  <TextField
                    style={{ width: "150px" }}
                    id="outlined-number"
                    // label="Hours"
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
              <div>
                <h6 style={{ margin: 0 }}>Max. passengers per booking</h6>
                <span
                  style={{
                    fontStyle: "italic",
                    paddingBottom: "5px",
                    fontSize: "12px",
                  }}
                >
                  Leave this field empty if there is no maximum.
                </span>
                <div>
                  <TextField
                    style={{ width: "150px" }}
                    id="outlined-number"
                    // label="Hours"
                    type="number"
                    size="small"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ padding: "10px" }}>
              <h6>Cancellation policy</h6>
              <div>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={policy}
                  sx={{ width: "100%" }}
                  size="small"
                  renderInput={(params) => <TextField {...params} />}
                />
              </div>
            </div>
            <div style={{ padding: "10px" }}>
              <h6 style={{ margin: 0 }}>Description</h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                The title and description may be displayed to the end customer
                to describe the rate.
              </span>
              <div>
                <TextField
                  placeholder="Description......."
                  multiline
                  rows={2}
                  maxRows={5}
                  sx={{ width: "100%" }}
                />
              </div>
            </div>
            <div style={{ padding: "10px" }}>
              <h6 style={{ margin: 0 }}>Rate code</h6>
              <span
                style={{
                  fontStyle: "italic",
                  paddingBottom: "5px",
                  fontSize: "12px",
                }}
              >
                Short code that identifies the rate (optional).
              </span>
              <div>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  size="small"
                  variant="outlined"
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
            <Button variant="contained">Continue</Button>
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
            Would you like to offer multiple rates for your experience?
          </h2>
          <p style={{ padding: "5px", textAlign: "center" }}>
            Rates allow you to price your options separately. For example
            setting additional price for lunch or pick-up
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
              {/* <TableHead>
                                <TableRow>
                                    <TableCell sx={{ width: '30px' }}>#</TableCell>
                                    <TableCell sx={{ width: '30px' }} align="center">Time</TableCell>
                                    <TableCell sx={{ width: '30px' }} align="center">Duration</TableCell>
                                    <TableCell sx={{ width: '30px' }} align="center">Linked Rates</TableCell>
                                    <TableCell sx={{ width: '30px' }} align="center"></TableCell>
                                </TableRow>
                            </TableHead> */}
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell align="center">{row.categories}</TableCell>
                    <TableCell align="center">{row.times}</TableCell>
                    <TableCell align="center">{row.setDefault}</TableCell>
                    <TableCell align="center">{row.buttons}</TableCell>
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
            + Add Rates
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
          <Button variant="outlined">Back</Button>
          <Button variant="contained">Continue</Button>
        </div>
      </div>
    </>
  );
};

export default Rates;

const policy = [
  { label: "Cancellation Policy" },
  { label: "Non refundable" },
  { label: "New can policy" },
];
