import React, { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};

// Default form values
const defaultForm = () => ({
  titel: "",
  address: "",
  link: "",
  pickup: "",
  drop: "",
  country: "",
  city: "",
  pin_code: "",
});

// Component
const MeetingPoint = () => {
  const navigate = useNavigate();
  const experienceId = localStorage.getItem("_id");

  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(defaultForm());
  const [saved, setSaved] = useState(false); // NEW → To show "Back to Add Activity"

  // Load meeting points
  useEffect(() => {
    if (!experienceId) return;

    (async function () {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`
      );
      const data = await res.json();

      if (data?.meeting_point?.length > 0) {
        setRows(data.meeting_point);
      }
    })();
  }, [experienceId]);

  // Open modal
  const handleOpen = () => setOpen(true);

  // Close modal & reset
  const handleClose = () => {
    setEditingIndex(-1);
    setForm(defaultForm());
    setOpen(false);
  };

  // Save / update row inside table
  const handleSave = () => {
    if (editingIndex >= 0) {
      const updated = [...rows];
      updated[editingIndex] = form;
      setRows(updated);
    } else {
      setRows((prev) => [...prev, form]);
    }

    handleClose();
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setForm(rows[index]);
    handleOpen();
  };

  const handleDelete = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Submit to backend
  const submit = async () => {
    if (rows.length === 0) {
      alert("Please add at least one meeting point");
      return;
    }

    const formattedRows = rows.map(({ _id, ...rest }) => rest);
    const removeIds = rows.filter((r) => r._id).map((r) => r._id);

    const body = {
      meeting_point: formattedRows,
      removeIds,
    };

    const res = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/meetingPoint/${experienceId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const result = await res.json();

    if (result) {
      setSaved(true); // Show "Back to Add Activity"
      localStorage.removeItem("_id");
    }
  };

  return (
    <>
      {/* Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6">Add / Edit Meeting Point</Typography>

          <FormField label="Title" value={form.titel} onChange={(v) => setForm({ ...form, titel: v })} />
          <FormField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
          <FormField label="Meeting Point Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
          <FormField label="Pickup Link" value={form.pickup} onChange={(v) => setForm({ ...form, pickup: v })} />
          <FormField label="Drop Link" value={form.drop} onChange={(v) => setForm({ ...form, drop: v })} />
          <FormField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          <FormField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <FormField label="Postal Code" value={form.pin_code} onChange={(v) => setForm({ ...form, pin_code: v })} />

          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Modal>

      {/* Main UI */}
      <div style={{ padding: 20, textAlign: "center" }}>
        <h2>Meeting Points</h2>
        <p>Add multiple meeting / pickup / drop points</p>

        {/* Table */}
        <TableContainer component={Paper} style={{ margin: "20px auto", width: "80%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i}>
                  <TableCell>{row.titel}</TableCell>
                  <TableCell>{row.address}</TableCell>
                  <TableCell align="center">
                    <Button onClick={() => handleEdit(i)}>Edit</Button>
                    <Button onClick={() => handleDelete(i)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add button */}
        <Button variant="contained" onClick={handleOpen}>+ Add Start Point</Button>

        {/* Footer */}
        <div style={{ marginTop: 60, width: "80%", textAlign: "center" }}>
          <Button variant="contained" onClick={submit} style={{ width: 200 }}>
            Continue
          </Button>

          {saved && (
            <div style={{ marginTop: 20 }}>
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/activity/addactivity")}
              >
                ← Back to Add Activity
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Input Field Component
const FormField = ({ label, value, onChange }) => (
  <div style={{ marginTop: 12 }}>
    <Typography variant="subtitle2" gutterBottom>{label}</Typography>
    <TextField fullWidth size="small" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default MeetingPoint;
