import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import rrulePlugin from "@fullcalendar/rrule";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Stack,
  Paper,
  Tooltip,
  Checkbox,
  styled,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  Add as AddIcon,
  Event as EventIcon,
  Block as BlockIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";

// Styled Components
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  minHeight: '80vh',
}));

// Constants
const DAYS_ARRAY = [
  { label: "Sunday", value: "su" },
  { label: "Monday", value: "mo" },
  { label: "Tuesday", value: "tu" },
  { label: "Wednesday", value: "we" },
  { label: "Thursday", value: "th" },
  { label: "Friday", value: "fr" },
  { label: "Saturday", value: "sa" },
];

const MONTH_ARRAY = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const RECURRING_TYPES = {
  WEEKLY: "weekly",
  SPECIFIC_DATE: "specific_date",
  BETWEEN_TWO_DATES: "between_two_dates",
  MONTHLY_SELECTED_DAYS: "monthly_selected_days",
};

const CATEGORIES = [
  "Repeat weekly on selected days",
  "Repeat yearly during selected months",
  "happen between selected dates",
  "happen on a selected date",
];

const CATEGORIES_BLACKOUT = [
  "Happen between selected dates",
  "Happen on a selected date",
];

// Sub-form Components
const ParticipantFields = ({ values, setFieldValue }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Participants (PAX)
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        The experience will only be bookable if minimum participants is met.
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Minimum"
            type="number"
            value={values.participant?.minimum || 1}
            onChange={(e) => setFieldValue("participant.minimum", parseInt(e.target.value) || 1)}
          />
        </Grid>
        <Grid item xs={2} sx={{ textAlign: 'center' }}>
          <Typography>to</Typography>
        </Grid>
        <Grid item xs={5}>
          <TextField
            fullWidth
            label="Maximum"
            type="number"
            value={values.participant?.maximum || 20}
            onChange={(e) => setFieldValue("participant.maximum", parseInt(e.target.value) || 20)}
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const StartTimeSelection = ({ startTime, values, setFieldValue }) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Start Times
      </Typography>
      <FormGroup row>
        {startTime.map((time) => (
          <FormControlLabel
            key={time._id}
            control={
              <Checkbox
                checked={values.start_time?.includes(time._id)}
                onChange={(e) => {
                  const newStartTimes = e.target.checked
                    ? [...(values.start_time || []), time._id]
                    : (values.start_time || []).filter(id => id !== time._id);
                  setFieldValue("start_time", newStartTimes);
                }}
              />
            }
            label={time.start_time}
          />
        ))}
      </FormGroup>
    </CardContent>
  </Card>
);

const FormActions = ({ onCancel, loading = false }) => (
  <DialogActions>
    <Button onClick={onCancel} disabled={loading}>Cancel</Button>
    <Button type="submit" variant="contained" disabled={loading}>
      {loading ? "Saving..." : "Save Availability"}
    </Button>
  </DialogActions>
);

const WeeklyForm = ({ startTime, onSubmit, onCancel, loading }) => {
  const initialValues = {
    days: [],
    participant: { minimum: 1, maximum: 20 },
    start_time: startTime[0]?._id ? [startTime[0]._id] : [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        days: Yup.array().min(1, "Select at least one day"),
      })}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <FormLabel component="legend">Select Days</FormLabel>
            <FormGroup row>
              {DAYS_ARRAY.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={values.days.includes(day.value)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...values.days, day.value]
                          : values.days.filter(d => d !== day.value);
                        setFieldValue("days", newDays);
                      }}
                    />
                  }
                  label={day.label}
                />
              ))}
            </FormGroup>
          </FormControl>
          <ParticipantFields values={values} setFieldValue={setFieldValue} />
          <StartTimeSelection startTime={startTime} values={values} setFieldValue={setFieldValue} />
          <FormActions onCancel={onCancel} loading={loading} />
        </Form>
      )}
    </Formik>
  );
};

const MonthlyForm = ({ startTime, onSubmit, onCancel, loading }) => {
  const initialValues = {
    months: [],
    days: [],
    participant: { minimum: 1, maximum: 20 },
    start_time: startTime[0]?._id ? [startTime[0]._id] : [],
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        months: Yup.array().min(1, "Select at least one month"),
        days: Yup.array().min(1, "Select at least one day"),
      })}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Months</InputLabel>
                <Select
                  multiple
                  value={values.months}
                  onChange={(e) => setFieldValue("months", e.target.value)}
                  renderValue={(selected) => selected.map(month => month.substring(0, 3)).join(', ')}
                >
                  {MONTH_ARRAY.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <FormControl component="fieldset" sx={{ mt: 2, mb: 3 }}>
            <FormLabel>Days of Week</FormLabel>
            <FormGroup row>
              {DAYS_ARRAY.map((day) => (
                <FormControlLabel
                  key={day.value}
                  control={
                    <Checkbox
                      checked={values.days.includes(day.value)}
                      onChange={(e) => {
                        const newDays = e.target.checked
                          ? [...values.days, day.value]
                          : values.days.filter(d => d !== day.value);
                        setFieldValue("days", newDays);
                      }}
                    />
                  }
                  label={day.label}
                />
              ))}
            </FormGroup>
          </FormControl>

          <ParticipantFields values={values} setFieldValue={setFieldValue} />
          <StartTimeSelection startTime={startTime} values={values} setFieldValue={setFieldValue} />
          <FormActions onCancel={onCancel} loading={loading} />
        </Form>
      )}
    </Formik>
  );
};

const DateRangeForm = ({ startTime, onSubmit, onCancel, loading }) => (
  <Formik
    initialValues={{
      startDate: dayjs(),
      endDate: dayjs().add(1, 'month'),
      participant: { minimum: 1, maximum: 20 },
      start_time: startTime[0]?._id ? [startTime[0]._id] : [],
    }}
    validationSchema={Yup.object({
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End date must be after start date")
        .required("End date is required"),
    })}
    onSubmit={onSubmit}
  >
    {({ values, setFieldValue }) => (
      <Form>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={values.startDate}
                onChange={(date) => setFieldValue("startDate", date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={values.endDate}
                onChange={(date) => setFieldValue("endDate", date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
        <ParticipantFields values={values} setFieldValue={setFieldValue} />
        <StartTimeSelection startTime={startTime} values={values} setFieldValue={setFieldValue} />
        <FormActions onCancel={onCancel} loading={loading} />
      </Form>
    )}
  </Formik>
);

const SingleDateForm = ({ startTime, onSubmit, onCancel, selectedDate, loading }) => (
  <Formik
    initialValues={{
      selectedDate: selectedDate,
      participant: { minimum: 1, maximum: 20 },
      start_time: startTime[0]?._id ? [startTime[0]._id] : [],
    }}
    validationSchema={Yup.object({
      selectedDate: Yup.date().required("Date is required"),
    })}
    onSubmit={onSubmit}
  >
    {({ values, setFieldValue }) => (
      <Form>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Select Date"
            value={values.selectedDate}
            onChange={(date) => setFieldValue("selectedDate", date)}
            slotProps={{ textField: { fullWidth: true, sx: { mb: 3 } } }}
          />
        </LocalizationProvider>
        <ParticipantFields values={values} setFieldValue={setFieldValue} />
        <StartTimeSelection startTime={startTime} values={values} setFieldValue={setFieldValue} />
        <FormActions onCancel={onCancel} loading={loading} />
      </Form>
    )}
  </Formik>
);

// Availability Form Component
const AvailabilityForm = ({ type = 'availability', open, onClose, startTime, selectedDate, onSubmit, loading }) => {
  const categories = type === 'availability' ? CATEGORIES : CATEGORIES_BLACKOUT;
  const [selected, setSelected] = useState(type === 'availability' ? CATEGORIES[3] : CATEGORIES_BLACKOUT[0]);

  const renderFormContent = () => {
    const commonProps = {
      startTime,
      onSubmit: (values) => onSubmit(values, getRecurringType(selected)),
      onCancel: onClose,
      loading,
    };

    switch (selected) {
      case "Repeat weekly on selected days":
        return <WeeklyForm {...commonProps} />;
      case "Repeat yearly during selected months":
        return <MonthlyForm {...commonProps} />;
      case "happen between selected dates":
      case "Happen between selected dates":
        return <DateRangeForm {...commonProps} />;
      case "happen on a selected date":
      case "Happen on a selected date":
        return <SingleDateForm {...commonProps} selectedDate={selectedDate} />;
      default:
        return null;
    }
  };

  const getRecurringType = (category) => {
    const typeMap = {
      "Repeat weekly on selected days": RECURRING_TYPES.WEEKLY,
      "Repeat yearly during selected months": RECURRING_TYPES.MONTHLY_SELECTED_DAYS,
      "happen between selected dates": RECURRING_TYPES.BETWEEN_TWO_DATES,
      "Happen between selected dates": RECURRING_TYPES.BETWEEN_TWO_DATES,
      "happen on a selected date": RECURRING_TYPES.SPECIFIC_DATE,
      "Happen on a selected date": RECURRING_TYPES.SPECIFIC_DATE,
    };
    return typeMap[category] || RECURRING_TYPES.SPECIFIC_DATE;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          {type === 'availability' ? <EventIcon /> : <BlockIcon />}
          <Typography variant="h6">
            {type === 'availability' ? 'Add Availability' : 'Set Blackout'}
          </Typography>
        </Stack>
      </DialogTitle>
      
      <DialogContent>
        <FormControl fullWidth sx={{ mb: 3, mt: 1 }}>
          <Autocomplete
            value={selected}
            onChange={(e, newValue) => setSelected(newValue)}
            options={categories}
            renderInput={(params) => (
              <TextField {...params} label="Rule Type" />
            )}
          />
        </FormControl>

        {renderFormContent()}
      </DialogContent>
    </Dialog>
  );
};

// Main Component
const Calendar = () => {
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId ? localId : null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [startTime, setStartTime] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Modal handlers
  const handleOpenModal = (type) => setOpenModal(type);
  const handleCloseModal = () => {
    setOpenModal(null);
    setLoading(false);
  };

  // Data fetching
  useEffect(() => {
    if (!experienceId) {
      alert("Please add title and categories");
      navigate("/titel");
      return;
    }
    fetchCalendarData();
  }, [experienceId, navigate]);

  const fetchCalendarData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Fetched experience data:", data); // Debug log
      
      // FIXED: Proper event normalization for FullCalendar
     if (data.calender_events?.length > 0) {
  const normalizedEvents = data.calender_events.map(event => {
    if (!event._id || !event.rrule) return null;

    // Extract actual HH:mm from dtstart
    let dtstart = event.rrule.dtstart;               // e.g. "2025-11-27T04:20"
    let finalDtStart = dtstart.includes(":00")
      ? dtstart
      : dtstart + ":00";                             // ensure seconds added

    // Split time into hour/minute parts
    const timePart = finalDtStart.split("T")[1];     // "04:20:00"
    const [hour, minute] = timePart.split(":").map(Number);

    // Fix byhour, byminute, bysecond
    const fixedRRule = {
      ...event.rrule,
      byhour: hour,                                  // NOT array
      byminute: minute,
      bysecond: 0,
      dtstart: finalDtStart,                         // keep exact time
      until: event.rrule.until 
        ? event.rrule.until.includes("T") 
          ? event.rrule.until 
          : event.rrule.until + "T23:59:59"
        : undefined
    };

    return {
      id: event._id,
      title: event.title || (event.isBlackout ? "Blackout" : "Available"),
      rrule: fixedRRule,
      duration: "01:00",                              // REQUIRED for FullCalendar
      extendedProps: {
        _id: event._id,
        start_time: event.start_time,
        participant: event.participant,
        isBlackout: event.isBlackout || false
      },
      backgroundColor: event.isBlackout ? '#ff4444' : '#4CAF50',
      borderColor: event.isBlackout ? '#d32f2f' : '#2E7D32',
      textColor: "#ffffff"
    };
  }).filter(Boolean);

  console.log("Normalized events for calendar:", normalizedEvents);
  setCurrentEvents(normalizedEvents);

} else {
  console.log("No calendar events found or events array is empty");
  setCurrentEvents([]);
}

      
      if (data.start_time?.length > 0) {
        setStartTime(data.start_time);
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      showSnackbar('Error loading calendar data', 'error');
    }
  };

  const handleDateSelect = (selectInfo) => {
    setSelectedDate(dayjs(selectInfo.start));
    handleOpenModal('availability');
  };

  const handleEventClick = (clickInfo) => {
    console.log("Event clicked:", clickInfo.event);
    // You can add edit/delete functionality here
  };

  const handleSubmitEvent = async (values, type) => {
    try {
      setLoading(true);
      const eventData = prepareEventData(values, type);
      
      console.log("Submitting event data:", eventData); // Debug log
      
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/experience/events/${experienceId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showSnackbar('Event added successfully');
      fetchCalendarData(); // Refresh events
    } catch (error) {
      console.error("Error submitting event:", error);
      showSnackbar('Error adding event', 'error');
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  const prepareEventData = (formVal, type) => {
    const selectedStartTimes = startTime.filter(time => 
      formVal.start_time.includes(time._id)
    );
    
    const startHoursArr = selectedStartTimes.map(time => {
      const [hours] = time.start_time.split(":");
      return parseInt(hours);
    });

    const firstStartTime = selectedStartTimes[0]?.start_time || "09:00";
    const isBlackout = openModal === 'blackout';
    
    const baseConfig = {
      start_time: formVal.start_time,
      participant: formVal.participant,
      title: isBlackout ? "Blackout Period" : "Available Time Slot",
      isBlackout: isBlackout,
    };

    switch (type) {
      case RECURRING_TYPES.WEEKLY:
        const days = formVal.days.filter(Boolean);
        return {
          ...baseConfig,
          rrule: {
            freq: "weekly",
            interval: 1,
            byweekday: days,
            dtstart: `${dayjs().format('YYYY-MM-DD')}T${firstStartTime}`,
            until: formVal.endDate ? dayjs(formVal.endDate).format("YYYY-MM-DD") : "2025-12-31",
            byhour: startHoursArr,
          },
        };

      case RECURRING_TYPES.MONTHLY_SELECTED_DAYS:
        const monthDays = formVal.days.filter(Boolean);
        return {
          ...baseConfig,
          rrule: {
            freq: "monthly",
            interval: 1,
            bymonth: formVal.months.map(month => MONTH_ARRAY.indexOf(month) + 1).sort(),
            byweekday: monthDays,
            dtstart: `${dayjs().format('YYYY-MM-DD')}T${firstStartTime}`,
            until: formVal.endDate ? dayjs(formVal.endDate).format("YYYY-MM-DD") : "2025-12-31",
            byhour: startHoursArr,
          },
        };

      case RECURRING_TYPES.SPECIFIC_DATE:
        return {
          ...baseConfig,
          rrule: {
            freq: "daily",
            interval: 1,
            dtstart: `${dayjs(formVal.selectedDate).format('YYYY-MM-DD')}T${firstStartTime}`,
            byhour: startHoursArr,
            count: 1,
          },
        };

      case RECURRING_TYPES.BETWEEN_TWO_DATES:
        return {
          ...baseConfig,
          rrule: {
            freq: "daily",
            interval: 1,
            dtstart: `${dayjs(formVal.startDate).format('YYYY-MM-DD')}T${firstStartTime}`,
            until: dayjs(formVal.endDate).format("YYYY-MM-DD"),
            byhour: startHoursArr,
          },
        };

      default:
        return baseConfig;
    }
  };

  const renderEventContent = (eventInfo) => {
    const isBlackout = eventInfo.event.extendedProps?.isBlackout;
    const participant = eventInfo.event.extendedProps?.participant;
    
    return (
      <Box sx={{ 
        p: 0.5, 
        backgroundColor: isBlackout ? '#ffebee' : '#e8f5e8',
        borderRadius: 1,
        border: `1px solid ${isBlackout ? '#ffcdd2' : '#c8e6c9'}`
      }}>
        <Typography variant="caption" display="block" fontWeight="bold" color={isBlackout ? '#d32f2f' : '#2e7d32'}>
          {eventInfo.timeText}
        </Typography>
        <Typography variant="caption" display="block" color={isBlackout ? '#d32f2f' : '#2e7d32'}>
          {isBlackout ? '🚫 Blackout' : `👥 ${participant?.minimum || 1}-${participant?.maximum || 20} guests`}
        </Typography>
      </Box>
    );
  };

  return (
    <CalendarContainer elevation={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Experience Calendar
        </Typography>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Add Available Time">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal('availability')}
            >
              Add Availability
            </Button>
          </Tooltip>
          <Tooltip title="Set Blackout Dates">
            <Button
              variant="outlined"
              startIcon={<BlockIcon />}
              onClick={() => handleOpenModal('blackout')}
            >
              Set Blackout
            </Button>
          </Tooltip>
        </Stack>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <EventIcon color="primary" />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Total Events
                  </Typography>
                  <Typography variant="h5">{currentEvents.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <ScheduleIcon color="secondary" />
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="overline">
                    Start Times
                  </Typography>
                  <Typography variant="h5">{startTime.length}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={3}
            eventDisplay="block"
            weekends={true}
            events={currentEvents}
            select={handleDateSelect}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            height="650px"
          />
        </CardContent>
      </Card>

      <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button 
          variant="contained" 
          onClick={() => navigate("/pricingCategories")}
          disabled={currentEvents.length === 0}
        >
          Continue to Pricing
        </Button>
      </Stack>

      <AvailabilityForm 
        type="availability" 
        open={openModal === 'availability'} 
        onClose={handleCloseModal}
        startTime={startTime}
        selectedDate={selectedDate}
        onSubmit={handleSubmitEvent}
        loading={loading}
      />
      <AvailabilityForm 
        type="blackout" 
        open={openModal === 'blackout'} 
        onClose={handleCloseModal}
        startTime={startTime}
        selectedDate={selectedDate}
        onSubmit={handleSubmitEvent}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CalendarContainer>
  );
};

export default Calendar;