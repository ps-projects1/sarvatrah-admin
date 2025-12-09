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
  IconButton,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import {
  PageContainer,
  HeaderSection,
  FooterButtons,
  modalStyle,
  modalHeader,
  modalBody,
  modalFooter,
  InfoBox,
  SectionTitle,
} from "./SharedStyles";

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
  const [travellerFacility, setTravellerFacility] = useState("meet_on_location");

  // Redirect if no experience ID
  useEffect(() => {
    if (!experienceId) {
      alert("No activity found. Please start from the beginning.");
      navigate("/addactivity");
    }
  }, [experienceId, navigate]);

  // Load meeting points and traveller facility option
  useEffect(() => {
    if (!experienceId) {
      console.log("=== MEETINGPOINT: No experience ID found ===");
      return;
    }

    console.log("=== MEETINGPOINT LOADING ===");
    console.log("Experience ID:", experienceId);

    (async function () {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`
      );
      const data = await res.json();

      console.log("Full response data:", data);
      console.log("traveller_facilty value:", data?.traveller_facilty);

      if (data?.meeting_point?.length > 0) {
        setRows(data.meeting_point);
        console.log("Loaded meeting points:", data.meeting_point.length);
      }

      // Get the traveller facility selection
      if (data?.traveller_facilty) {
        console.log("Setting travellerFacility to:", data.traveller_facilty);
        setTravellerFacility(data.traveller_facilty);
      } else {
        console.log("⚠️ No traveller_facilty found in response! Using default: meet_on_location");
      }
    })();
  }, [experienceId]);

  // Open modal
  const handleOpen = () => {
    console.log("=== OPENING MODAL ===");
    console.log("Current travellerFacility state:", travellerFacility);
    setOpen(true);
  };

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

  const getModeLabel = () => {
    if (travellerFacility === "meet_on_location") return "Meeting Only";
    if (travellerFacility === "pick_up_only") return "Meeting + Pickup";
    return "Meeting + Pickup + Drop";
  };

  const getModeColor = () => {
    if (travellerFacility === "meet_on_location") return "primary";
    if (travellerFacility === "pick_up_only") return "secondary";
    return "success";
  };

  return (
    <>
      {/* Modal */}
      <Modal open={open} disableEscapeKeyDown>
        <Box sx={modalStyle}>
          <Box sx={modalHeader}>
            <Typography variant="h6" fontWeight={600}>
              {editingIndex >= 0 ? "Edit Meeting Point" : "Add Meeting Point"}
            </Typography>
            <IconButton onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={modalBody}>
            <InfoBox>
              <Typography>
                <strong>Mode:</strong> {getModeLabel()}
              </Typography>
            </InfoBox>

            <Box mb={3}>
              <SectionTitle>Basic Information</SectionTitle>
              <FormField label="Title" value={form.titel} onChange={(v) => setForm({ ...form, titel: v })} />
              <FormField label="Address" value={form.address} onChange={(v) => setForm({ ...form, address: v })} />
            </Box>

            <Box mb={3}>
              <SectionTitle>Location Links</SectionTitle>
              <FormField label="Meeting Point Link" value={form.link} onChange={(v) => setForm({ ...form, link: v })} />
              {(travellerFacility === "pick_up_only" || travellerFacility === "meet_on_location_or_pickup") && (
                <FormField label="Pickup Link" value={form.pickup} onChange={(v) => setForm({ ...form, pickup: v })} />
              )}
              {travellerFacility === "meet_on_location_or_pickup" && (
                <FormField label="Drop Link" value={form.drop} onChange={(v) => setForm({ ...form, drop: v })} />
              )}
            </Box>

            <Box>
              <SectionTitle>Address Details</SectionTitle>
              <FormField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
              <FormField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <FormField label="Postal Code" value={form.pin_code} onChange={(v) => setForm({ ...form, pin_code: v })} />
            </Box>
          </Box>

          <Box sx={modalFooter}>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </Box>
        </Box>
      </Modal>

      {/* Main UI */}
      <PageContainer maxWidth="lg">
        <HeaderSection>
          <h2>
            {travellerFacility === "meet_on_location"
              ? "Meeting Points"
              : travellerFacility === "pick_up_only"
              ? "Meeting & Pickup Points"
              : "Meeting, Pickup & Drop Points"}
          </h2>
          <p>
            {travellerFacility === "meet_on_location"
              ? "Add meeting points where travellers will meet you"
              : travellerFacility === "pick_up_only"
              ? "Add meeting points and pickup locations"
              : "Add meeting points, pickup and drop locations"}
          </p>
          <Box mt={2}>
            <Chip label={getModeLabel()} color={getModeColor()} />
          </Box>
        </HeaderSection>

        <TableContainer component={Paper} elevation={2} sx={{ mb: 4, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "background.default" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Address</TableCell>
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No meeting points added yet. Click "Add Start Point" to begin.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{row.titel}</TableCell>
                    <TableCell>{row.address}</TableCell>
                    <TableCell align="center">
                      <Button variant="outlined" size="small" onClick={() => handleEdit(i)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(i)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box display="flex" justifyContent="center" mb={4}>
          <Button variant="contained" size="large" onClick={handleOpen}>
            + Add Start Point
          </Button>
        </Box>

        <FooterButtons>
          <Button variant="outlined" onClick={() => navigate("/activity/pricingCategories")}>
            Back
          </Button>
          <Button variant="contained" onClick={submit}>
            Continue
          </Button>
        </FooterButtons>

        {saved && (
          <Box textAlign="center" mt={3}>
            <Button variant="text" color="primary" onClick={() => navigate("/addactivity")}>
              ← Back to Add Activity
            </Button>
          </Box>
        )}
      </PageContainer>
    </>
  );
};

// Input Field Component
const FormField = ({ label, value, onChange }) => (
  <Box mb={2}>
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
    />
  </Box>
);

export default MeetingPoint;
