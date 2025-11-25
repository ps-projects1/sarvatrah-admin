import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  FormGroup,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import rrulePlugin from "@fullcalendar/rrule";

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
const daysArray = [
  {
    label: "Sunday",
    value: "su",
  },
  {
    label: "Monday",
    value: "mo",
  },
  {
    label: "Tuesday",
    value: "tu",
  },
  {
    label: "Wednesday",
    value: "we",
  },
  {
    label: "Thursday",
    value: "th",
  },
  {
    label: "Friday",
    value: "fr",
  },
  {
    label: "Saturday",
    value: "sa",
  },
];

const RecurringTypes = {
  WEEKLY: "weekly",
  SPECIFIC_DATE: "specific_date",
  BETWEEN_TWO_DATES: "between_two_dates",
  MONTHLY_SELECTED_DAYS: "monthly_selected_days",
};

let todayStr = new Date().toISOString().replace(/T.*$/, "");

const todayDate = new Date();


const monthArray = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  const localId = localStorage.getItem("_id");
  const [experienceId] = useState(localId ? localId : null);
  const [weekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [blackOut, setBlackOut] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    "happen on a selected date"
  );
  const [selectedBlackout, setSelectedBlackout] = useState(
    "Happen between selected dates"
  );
 
 
  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [startTime, setStartTime] = useState([]);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleBlackout = () => setBlackOut(true);
  const [currentSelectedStartTime, setCurrentStartTime] = useState([]);
  const [currentSelectedInfo, setCurrentSelectInfo] = useState({});
  const [deleteEventModal, setDeleteEventModal] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setSelectedCategory("happen on a selected date");
  };
  const handleCloseBlack = () => {
    setBlackOut(false);
    // setSelectedBlackout("Happen on a selected date");
  };

  useEffect(() => {
    if (!experienceId && experienceId?.length === 0) {
      alert("please add titel and categories");
      navigate("/titel");
      return;
    }
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
      const { calender_events } = responseJson;
      if (calender_events && calender_events.length > 0) {
        // const events = calender_events.map((item) => item.event);
        setCurrentEvents(calender_events);
      }
    })();
    getStartTIme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getStartTIme = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/${experienceId}`,

      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { start_time } = await response.json();
    if (start_time && start_time.length > 0) {
      // console.log(start_time, "start_time");
      setStartTime(start_time);
      setCurrentStartTime(start_time[0]);
      return;
    }
    // alert("Start time not found please add start time");
    // navigate("/startTime");
  };
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };
  const handleBlackoutChange = (event, newValue) => {
    setSelectedBlackout(newValue);
  };



  const handleDateSelect = (selectInfo) => {
    handleOpen();
    // setCurrentSelectInfo(selectInfo);
    // // let title = prompt("Please enter a new title for your event");
    // let calendarApi = selectInfo.view.calendar;
    // calendarApi.unselect();
  };

  const handleEventClick = (clickInfo) => {
    setDeleteEventModal(true);
    console.log(clickInfo, " clickInfo");
    setCurrentSelectInfo(clickInfo);
  };
  const deleteEvent = async () => {
    setDeleteEventModal(false);
    
    const data = {
      calenderEvnetId: currentSelectedInfo.event?.extendedProps?._id,
    };
    console.log(data, "data");
    const deleteEvets = await fetch(
`${process.env.REACT_APP_API_BASE_URL}/experience/events/${experienceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const response = await deleteEvets.json();
    console.log(response, "response");
    setCurrentEvents(response);
    // setCurrentEvents(events);
  };
 

  const renderEventContent = (eventInfo) => (
    <>
      <b>{eventInfo.timeText}</b>
      {/* <i>{eventInfo.event.title}</i> */}
      <i>
        {eventInfo.event?.start_time
          ? startTime.find((time) => time._id === eventInfo.event?.start_time)
              .start_time
          : ""}
      </i>
    </>
  );

  const handleEventAdd = (event) => {};
  const handleOnFormSubmit = async () => {
    const data = currentEvents;
    if (data.length === 0) {
      alert("Please add events");
      return;
    }
    navigate("/pricingCategories");
  };

 
  const handleBackendEventAdd = async (event) => {
    const data = event;
    const result = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/experience/events/${experienceId}`
,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const response = await result.json();
    setCurrentEvents(response);
    handleClose();
    // setCurrentEvents(response);
    console.log(response, "response");
  };
  const subMitingData = async (formVal, type = RecurringTypes.WEEKLY) => {
    console.log(formVal, "formVal");
    let startStr = startTime.find((time) => {
      if (time && formVal.start_time.includes(time._id)) {
        return true;
      }
      return false;
    });
    let startHoursArr = [];
    let startMinutesArr = [];
    for (let i = 0; i < startTime?.length; i++) {
      if (startTime[i] && formVal.start_time.includes(startTime[i]._id)) {
        const [startHours, startMinutes] = startTime[i].start_time.split(":");
        startHoursArr.push(startHours);
        startMinutesArr.push(startMinutes);
      }
    }
    startStr = startStr ? startStr.start_time : "";
    const todayStrWithTime = `${todayStr}T${startStr}`;
    switch (type) {
      case RecurringTypes.WEEKLY:
        const days = [];
        formVal.days.forEach((day) => {
          if (day && day.length > 0) {
            days.push(day.join(""));
          }
        });
        const backendEvent = {
          title: "my recurring event",
          rrule: {
            freq: "weekly",
            interval: 1,
            byweekday: days,
            dtstart: todayStrWithTime,
            until: formVal.endDate
              ? dayjs(formVal.endDate).format("YYYY-MM-DD")
              : "2025-06-01",
            byhour: startHoursArr.map((hour) => parseInt(hour)),
          },
          start_time: formVal.start_time,
          participant: formVal.participant,
        };
        console.log(backendEvent, "backendEvent for weekly");
        handleBackendEventAdd(backendEvent);
        return backendEvent;
      case RecurringTypes.MONTHLY_SELECTED_DAYS:
        console.log(formVal, "formVal");
        const daysForMont = [];
        formVal.days.forEach((day) => {
          if (day && day.length > 0) {
            daysForMont.push(day.join(""));
          }
        });
        const monthlyEvent = {
          title: "my recurring event",
          rrule: {
            freq: "monthly",
            interval: 1,
            bymonth: formVal.months
              .map((monthStr) => {
                return monthArray.indexOf(monthStr) + 1;
              })
              .sort(),
            dtstart: todayStrWithTime,
            byweekday: daysForMont,
            until: formVal.endDate
              ? dayjs(formVal.endDate).format("YYYY-MM-DD")
              : "2025-06-01",
            byhour: startHoursArr.map((hour) => parseInt(hour)),
          },
          start_time: formVal.start_time,
          participant: formVal.participant,
        };
        handleBackendEventAdd(monthlyEvent);
        setCurrentEvents(monthlyEvent);
        console.log(monthlyEvent, "backendEvent for monthly");
        return;
      case RecurringTypes.SPECIFIC_DATE:
        console.log(formVal, "formVal00000000000");
        const selectedDate = dayjs(formVal.selectedDate);
        const formattedDate = selectedDate.format("YYYY-MM-DD");

        const startTimestrForsingle = `${formattedDate}T${startStr}`;

        const specificEvent = {
          title: startTime.find((time) => time._id === formVal.start_time),
          rrule: {
            freq: "daily",
            interval: 1,
            dtstart: startTimestrForsingle,
            byhour: startHoursArr.map((hour) => parseInt(hour)),
            count: startHoursArr.length,
          },
          start_time: formVal.start_time,
          participant: formVal.participant,
        };

        console.log(specificEvent, "backendEvent for specific date");
        handleBackendEventAdd(specificEvent);
        return;
      case RecurringTypes.BETWEEN_TWO_DATES:
        console.log(formVal, "formVal");
        const startDateBy = dayjs(formVal.startDate);
        const formatedStartDateBy = startDateBy.format("YYYY-MM-DD");
        const startTimestr = `${formatedStartDateBy}T${startStr}`;
        const untilDate = dayjs(formVal.endDate);
        const untilDateStr = untilDate.format("YYYY-MM-DD");
        const betweenEvent = {
          title: startTime.find((time) => time._id === formVal.start_time),
          rrule: {
            freq: "daily",
            interval: 1,
            dtstart: startTimestr,
            until: untilDateStr,
            byhour: startHoursArr.map((hour) => parseInt(hour)),
          },
          start_time: formVal.start_time,
          participant: formVal.participant,
        };
        handleBackendEventAdd(betweenEvent);
        setCurrentEvents([betweenEvent]);
        break;
      default:
        break;
    }
  };

  const renderSwitchForm = () => {
    switch (selectedCategory) {
      case "Repeat weekly on selected days":
        return (
          <Formik
            initialValues={{
              days: [],
              participant: { minimum: 0, maximum: 100 },
              start_time: startTime[0]._id,
            }}
            validationSchema={Yup.object({
              days: Yup.array()
                .min(1, "Select at least one day")
                .required("Days are required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              // console.log(values, "values");
              if (!values.start_time) {
                values.start_time = startTime[0]._id;
              }
              subMitingData(values);
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ padding: "25px" }}>
                <h6>Affected days</h6>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span
                    style={{
                      fontStyle: "italic",
                      paddingBottom: "5px",
                      fontSize: "15px",
                    }}
                  >
                    Select which days this availability rule applies to.
                  </span>
                  <FieldArray name="days">
                    {({ form, push, remove }) => (
                      <>
                        {daysArray.map((day, index) => (
                          <div key={index}>
                            <Field
                              type="checkbox"
                              name={`days.${index}`}
                              value={day.value}
                            />
                            {day.label}
                          </div>
                        ))}
                      </>
                    )}
                  </FieldArray>
                  <div>
                    <h6>Participants (PAX)</h6>
                    <span
                      style={{
                        fontStyle: "italic",
                        paddingBottom: "5px",
                        fontSize: "15px",
                      }}
                    >
                      The experience will only be bookable if minimum
                      participants is met.
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        paddingTop: "5px",
                      }}
                    >
                      <div style={{ width: "20%" }}>
                        <TextField
                          size="small"
                          id="outlined-number"
                          type="number"
                          value={values.participant?.minimum}
                          onChange={(e) =>
                            setFieldValue("participant.minimum", e.target.value)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      <div>minimum</div>
                      <div style={{ width: "20%" }}>
                        <TextField
                          size="small"
                          id="outlined-number"
                          type="number"
                          value={values.participant?.maximum}
                          onChange={(e) =>
                            setFieldValue("participant.maximum", e.target.value)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      <div>maximum</div>
                    </div>
                    {/*display start Time checkBox*/}
                    <div>
                      <h6>Select all start times</h6>
                      <FieldArray name="start_time">
                        {({ form, push, remove }) => (
                          <>
                            {startTime.map((time, index) => (
                              <div key={index}>
                                <Field
                                  type="checkbox"
                                  name={`start_time.${index}`}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const timeId = time._id;
                                    const startTimes = values.start_time || [];
                                    console.log(startTimes, "startTimes");
                                    if (
                                      isChecked &&
                                      !startTimes.includes(timeId)
                                    ) {
                                      setFieldValue("start_time", [
                                        ...startTimes,
                                        timeId,
                                      ]);
                                    } else if (
                                      !isChecked &&
                                      startTimes.includes(timeId)
                                    ) {
                                      setFieldValue(
                                        "start_time",
                                        startTimes.filter((id) => id !== timeId)
                                      );
                                    }
                                  }}
                                  checked={
                                    values.start_time
                                      ? values.start_time.includes(time._id)
                                      : false
                                  }
                                />
                                {time.start_time}
                              </div>
                            ))}
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        );

      case "Repeat yearly during selected months":
        return (
          <Formik
            initialValues={{
              months: [],
              participant: { minimum: 0, maximum: 100 },
              start_time: startTime[0]._id,
            }}
            validationSchema={Yup.object({
              months: Yup.array()
                .min(1, "Select at least one month")
                .required("Months are required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              if (!values.start_time) {
                values.start_time = startTime[0]._id;
              }
              subMitingData(values, RecurringTypes.MONTHLY_SELECTED_DAYS);
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ padding: "25px" }}>
                <h6>Affected months</h6>
                <span
                  style={{
                    fontStyle: "italic",
                    paddingBottom: "5px",
                    fontSize: "15px",
                  }}
                >
                  Select which month(s) this availability rule applies to.
                </span>
                <FormControl fullWidth>
                  <InputLabel htmlFor="months">Affected Months</InputLabel>
                  <Select
                    multiple
                    name="months"
                    value={values.months || []}
                    onChange={(e) => setFieldValue("months", e.target.value)}
                    label="Affected Months"
                  >
                    {monthArray.map((month, index) => (
                      <MenuItem key={index} value={month}>
                        {month}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <h6>Affected days</h6>
                <FieldArray name="days">
                  {({ form, push, remove }) => (
                    <>
                      {daysArray.map((day, index) => (
                        <div key={index}>
                          <Field
                            type="checkbox"
                            name={`days.${index}`}
                            value={day.value}
                          />
                          {day.label}
                        </div>
                      ))}
                    </>
                  )}
                </FieldArray>
                <div>
                  <h6>Participants (PAX)</h6>
                  <span
                    style={{
                      fontStyle: "italic",
                      paddingBottom: "5px",
                      fontSize: "15px",
                    }}
                  >
                    The experience will only be bookable if minimum participants
                    is met.
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      paddingTop: "5px",
                    }}
                  >
                    <div style={{ width: "20%" }}>
                      <TextField
                        size="small"
                        id="outlined-number"
                        type="number"
                        value={values.participant?.minimum}
                        onChange={(e) =>
                          setFieldValue("participant.minimum", e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div>minimum</div>
                    <div style={{ width: "20%" }}>
                      <TextField
                        size="small"
                        id="outlined-number"
                        type="number"
                        value={values.participant?.maximum}
                        onChange={(e) =>
                          setFieldValue("participant.maximum", e.target.value)
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </div>
                    <div>maximum</div>
                  </div>
                </div>
                <div>
                  <h6>Select all start times</h6>

                  <FieldArray name="start_time">
                    {({ form, push, remove }) => (
                      <>
                        {startTime.map((time, index) => (
                          <div key={index}>
                            <Field
                              type="checkbox"
                              name={`start_time.${index}`}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                const timeId = time._id;
                                const startTimes = values.start_time || [];
                                console.log(startTimes, "startTimes");
                                if (isChecked && !startTimes.includes(timeId)) {
                                  setFieldValue("start_time", [
                                    ...startTimes,
                                    timeId,
                                  ]);
                                } else if (
                                  !isChecked &&
                                  startTimes.includes(timeId)
                                ) {
                                  setFieldValue(
                                    "start_time",
                                    startTimes.filter((id) => id !== timeId)
                                  );
                                }
                              }}
                              checked={
                                values.start_time
                                  ? values.start_time.includes(time._id)
                                  : false
                              }
                            />
                            {time.start_time}
                          </div>
                        ))}
                      </>
                    )}
                  </FieldArray>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  type="submit"
                >
                  Submit
                </Button>{" "}
              </Form>
            )}
          </Formik>
        );

      case "happen beatween selected dates":
        return (
          <Formik
            initialValues={{
              startDate: null,
              endDate: null,
              participant: { minimum: 0, maximum: 100 },
            }}
            validationSchema={Yup.object({
              startDate: Yup.date().required("Start date is required"),
              endDate: Yup.date()
                .min(Yup.ref("startDate"), "End date must be after start date")
                .required("End date is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              if (!values.start_time) {
                values.start_time = startTime[0]._id;
              }
              subMitingData(values, RecurringTypes.BETWEEN_TWO_DATES);
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ padding: "25px" }}>
                <h6>Affected dates</h6>
                <span
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  Select which dates this availability rule applies to.
                </span>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Start date"
                        onChange={(newValue) => {
                          setFieldValue("startDate", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField>{params.inputProps.value}</TextField>
                        )}
                        value={values.startDate || ""}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="End date"
                        onChange={(newValue) => {
                          setFieldValue("endDate", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField>{params.inputProps.value}</TextField>
                        )}
                        value={values.endDate || null}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <div>
                  <h6>Participants (PAX)</h6>
                  <span
                    style={{
                      fontStyle: "italic",
                      paddingBottom: "5px",
                      fontSize: "15px",
                    }}
                  >
                    The experience will only be bookable if minimum participants
                    are met.
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      paddingTop: "5px",
                    }}
                  >
                    <div style={{ width: "20%" }}>
                      <Field name="participant.minimum">
                        {({ field }) => (
                          <TextField
                            size="small"
                            id="outlined-number"
                            type="number"
                            {...field}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) => {
                              if (e.target.value > values.participant.maximum) {
                                setFieldValue(
                                  "participant.maximum",
                                  e.target.value
                                );
                              }
                            }}
                            value={values.participant?.minimum || 0}
                          />
                        )}
                      </Field>
                    </div>
                    <div>minimum</div>
                    <div style={{ width: "20%" }}>
                      <Field name="participant.maximum">
                        {({ field }) => (
                          <TextField
                            size="small"
                            id="outlined-number"
                            type="number"
                            {...field}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) => {
                              if (
                                e.target.value < values?.participant?.minimum
                              ) {
                                setFieldValue(
                                  "participant.minimum",
                                  e.target.value
                                );
                              }
                            }}
                            value={values?.participant?.maximum || 100}
                          />
                        )}
                      </Field>
                    </div>
                    <div>maximum</div>
                  </div>

                  <div style={{ paddingTop: "20px" }}>
                    <h6>Select all start times</h6>
                    <span
                      style={{
                        fontStyle: "italic",
                        paddingBottom: "5px",
                        fontSize: "15px",
                      }}
                    >
                      {" "}
                      Select all start times{" "}
                    </span>
                    <FieldArray name="start_time">
                      {({ form, push, remove }) => (
                        <>
                          {startTime.map((time, index) => (
                            <div key={index}>
                              <Field
                                type="checkbox"
                                name={`start_time.${index}`}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const timeId = time._id;
                                  const startTimes = values.start_time || [];
                                  console.log(startTimes, "startTimes");
                                  if (
                                    isChecked &&
                                    !startTimes.includes(timeId)
                                  ) {
                                    setFieldValue("start_time", [
                                      ...startTimes,
                                      timeId,
                                    ]);
                                  } else if (
                                    !isChecked &&
                                    startTimes.includes(timeId)
                                  ) {
                                    setFieldValue(
                                      "start_time",
                                      startTimes.filter((id) => id !== timeId)
                                    );
                                  }
                                }}
                                checked={
                                  values.start_time
                                    ? values.start_time.includes(time._id)
                                    : false
                                }
                              />
                              {time.start_time}
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  type="submit"
                >
                  Submit
                </Button>{" "}
              </Form>
            )}
          </Formik>
        );
      case "happen on a selected date":
        return (
          <Formik
            initialValues={{ selectedDate: selectedDate }}
            validationSchema={Yup.object({
              selectedDate: Yup.date().required("Date is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              if (!values.start_time) {
                values.start_time = startTime[0]._id;
              }
              subMitingData(values, RecurringTypes.SPECIFIC_DATE);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ padding: "25px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        name="selectedDate"
                        value={dayjs(selectedDate)}
                        onChange={(date) => {
                          setFieldValue("selectedDate", date);
                          setSelectedDate(date);
                        }}
                        // slotProps={{ textField: { size: "small" } }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <FormGroup>
                    {/* <FormControlLabel
                      control={<Switch />}
                      label="Switch"
                      name="switch"
                      onChange={(e) => setIsEventAllTime(e.target.checked)}
                      checked={isEventAllTime}
                      // Handle switch state here if needed
                    /> */}
                  </FormGroup>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "40px",
                  }}
                >
                  <div>
                    <h6>Participants (PAX)</h6>
                    <span
                      style={{
                        fontStyle: "italic",
                        paddingBottom: "5px",
                        fontSize: "15px",
                      }}
                    >
                      The experience will only be bookable if minimum
                      participants is met.
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        paddingTop: "5px",
                      }}
                    >
                      <div style={{ width: "20%" }}>
                        <TextField
                          size="small"
                          id="outlined-number"
                          type="number"
                          value={values.participant?.minimum || 0}
                          onChange={(e) =>
                            setFieldValue("participant.minimum", e.target.value)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      <div>minimum</div>
                      <div style={{ width: "20%" }}>
                        <TextField
                          size="small"
                          id="outlined-number"
                          type="number"
                          value={values.participant?.maximum}
                          onChange={(e) =>
                            setFieldValue("participant.maximum", e.target.value)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      <div>maximum</div>
                    </div>
                    {/*display start Time checkBox*/}
                    <div>
                      <h6>Select all start times</h6>

                      <FieldArray name="start_time">
                        {({ form, push, remove }) => (
                          <>
                            {startTime.map((time, index) => (
                              <div key={index}>
                                <Field
                                  type="checkbox"
                                  name={`start_time.${index}`}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const timeId = time._id;
                                    const startTimes = values.start_time || [];
                                    console.log(startTimes, "startTimes");
                                    if (
                                      isChecked &&
                                      !startTimes.includes(timeId)
                                    ) {
                                      setFieldValue("start_time", [
                                        ...startTimes,
                                        timeId,
                                      ]);
                                    } else if (
                                      !isChecked &&
                                      startTimes.includes(timeId)
                                    ) {
                                      setFieldValue(
                                        "start_time",
                                        startTimes.filter((id) => id !== timeId)
                                      );
                                    }
                                  }}
                                  checked={
                                    values.start_time
                                      ? values.start_time.includes(time._id)
                                      : false
                                  }
                                />
                                {time.start_time}
                              </div>
                            ))}
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        );
      default:
        return null;
    }
  };
  const renderSwitchFormBlackOut = () => {
    switch (selectedCategory) {
      case "happen beatween selected dates":
        return (
          <Formik
            initialValues={{
              startDate: null,
              endDate: null,
              participant: { minimum: 0, maximum: 100 },
            }}
            validationSchema={Yup.object({
              startDate: Yup.date().required("Start date is required"),
              endDate: Yup.date()
                .min(Yup.ref("startDate"), "End date must be after start date")
                .required("End date is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              console.log(values);
              if (!values.start_time) {
                values.start_time = startTime[0]._id;
              }
              subMitingData(values, RecurringTypes.BETWEEN_TWO_DATES);
              setSubmitting(false);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ padding: "25px" }}>
                <h6>Affected dates</h6>
                <span
                  style={{
                    fontStyle: "italic",
                  }}
                >
                  Select which dates this availability rule applies to.
                </span>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="Start date"
                        onChange={(newValue) => {
                          setFieldValue("startDate", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField>{params.inputProps.value}</TextField>
                        )}
                        value={values.startDate || ""}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        label="End date"
                        onChange={(newValue) => {
                          setFieldValue("endDate", newValue);
                        }}
                        renderInput={(params) => (
                          <TextField>{params.inputProps.value}</TextField>
                        )}
                        value={values.endDate || null}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </div>
                <div>
                  <h6>Participants (PAX)</h6>
                  <span
                    style={{
                      fontStyle: "italic",
                      paddingBottom: "5px",
                      fontSize: "15px",
                    }}
                  >
                    The experience will only be bookable if minimum participants
                    are met.
                  </span>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      paddingTop: "5px",
                    }}
                  >
                    <div style={{ width: "20%" }}>
                      <Field name="participant.minimum">
                        {({ field }) => (
                          <TextField
                            size="small"
                            id="outlined-number"
                            type="number"
                            {...field}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) => {
                              if (e.target.value > values.participant.maximum) {
                                setFieldValue(
                                  "participant.maximum",
                                  e.target.value
                                );
                              }
                            }}
                            value={values.participant?.minimum || 0}
                          />
                        )}
                      </Field>
                    </div>
                    <div>minimum</div>
                    <div style={{ width: "20%" }}>
                      <Field name="participant.maximum">
                        {({ field }) => (
                          <TextField
                            size="small"
                            id="outlined-number"
                            type="number"
                            {...field}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={(e) => {
                              if (
                                e.target.value < values?.participant?.minimum
                              ) {
                                setFieldValue(
                                  "participant.minimum",
                                  e.target.value
                                );
                              }
                            }}
                            value={values?.participant?.maximum || 100}
                          />
                        )}
                      </Field>
                    </div>
                    <div>maximum</div>
                  </div>

                  <div style={{ paddingTop: "20px" }}>
                    <h6>Select all start times</h6>
                    <span
                      style={{
                        fontStyle: "italic",
                        paddingBottom: "5px",
                        fontSize: "15px",
                      }}
                    >
                      {" "}
                      Select all start times{" "}
                    </span>
                    <FieldArray name="start_time">
                      {({ form, push, remove }) => (
                        <>
                          {startTime.map((time, index) => (
                            <div key={index}>
                              <Field
                                type="checkbox"
                                name={`start_time.${index}`}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const timeId = time._id;
                                  const startTimes = values.start_time || [];
                                  console.log(startTimes, "startTimes");
                                  if (
                                    isChecked &&
                                    !startTimes.includes(timeId)
                                  ) {
                                    setFieldValue("start_time", [
                                      ...startTimes,
                                      timeId,
                                    ]);
                                  } else if (
                                    !isChecked &&
                                    startTimes.includes(timeId)
                                  ) {
                                    setFieldValue(
                                      "start_time",
                                      startTimes.filter((id) => id !== timeId)
                                    );
                                  }
                                }}
                                checked={
                                  values.start_time
                                    ? values.start_time.includes(time._id)
                                    : false
                                }
                              />
                              {time.start_time}
                            </div>
                          ))}
                        </>
                      )}
                    </FieldArray>
                  </div>
                </div>
                <Button
                  onClick={handleCloseBlack}
                  variant="outlined"
                  color="primary"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  type="submit"
                >
                  Submit
                </Button>{" "}
              </Form>
            )}
          </Formik>
        );
      case "happen on a selected date":
        return (
          <Formik
            initialValues={{ selectedDate: selectedDate }}
            validationSchema={Yup.object({
              selectedDate: Yup.date().required("Date is required"),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              if (!values.start_time) {
                values.start_time = startTime[0]._id;
              }
              subMitingData(values, RecurringTypes.SPECIFIC_DATE);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ padding: "25px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DatePicker"]}>
                      <DatePicker
                        name="selectedDate"
                        value={dayjs(selectedDate)}
                        onChange={(date) => {
                          setFieldValue("selectedDate", date);
                          setSelectedDate(date);
                        }}
                        // slotProps={{ textField: { size: "small" } }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                  <FormGroup>
                    {/* <FormControlLabel
                      control={<Switch />}
                      label="Switch"
                      name="switch"
                      onChange={(e) => setIsEventAllTime(e.target.checked)}
                      checked={isEventAllTime}
                      // Handle switch state here if needed
                    /> */}
                  </FormGroup>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "40px",
                  }}
                >
                  <div>
                    <h6>Participants (PAX)</h6>
                    <span
                      style={{
                        fontStyle: "italic",
                        paddingBottom: "5px",
                        fontSize: "15px",
                      }}
                    >
                      The experience will only be bookable if minimum
                      participants is met.
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        paddingTop: "5px",
                      }}
                    >
                      <div style={{ width: "20%" }}>
                        <TextField
                          size="small"
                          id="outlined-number"
                          type="number"
                          value={values.participant?.minimum || 0}
                          onChange={(e) =>
                            setFieldValue("participant.minimum", e.target.value)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      <div>minimum</div>
                      <div style={{ width: "20%" }}>
                        <TextField
                          size="small"
                          id="outlined-number"
                          type="number"
                          value={values.participant?.maximum}
                          onChange={(e) =>
                            setFieldValue("participant.maximum", e.target.value)
                          }
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                      </div>
                      <div>maximum</div>
                    </div>
                    {/*display start Time checkBox*/}
                    <div>
                      <h6>Select all start times</h6>

                      <FieldArray name="start_time">
                        {({ form, push, remove }) => (
                          <>
                            {startTime.map((time, index) => (
                              <div key={index}>
                                <Field
                                  type="checkbox"
                                  name={`start_time.${index}`}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const timeId = time._id;
                                    const startTimes = values.start_time || [];
                                    console.log(startTimes, "startTimes");
                                    if (
                                      isChecked &&
                                      !startTimes.includes(timeId)
                                    ) {
                                      setFieldValue("start_time", [
                                        ...startTimes,
                                        timeId,
                                      ]);
                                    } else if (
                                      !isChecked &&
                                      startTimes.includes(timeId)
                                    ) {
                                      setFieldValue(
                                        "start_time",
                                        startTimes.filter((id) => id !== timeId)
                                      );
                                    }
                                  }}
                                  checked={
                                    values.start_time
                                      ? values.start_time.includes(time._id)
                                      : false
                                  }
                                />
                                {time.start_time}
                              </div>
                            ))}
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleCloseBlack}
                  variant="outlined"
                  color="primary"
                  className="btn btn-primary"
                  style={{ marginRight: "10px" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            )}
          </Formik>
        );
      default:
        return null;
    }
  };

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <Button onClick={handleOpen} variant="outlined">
          open
        </Button>
        <Button onClick={handleBlackout} style={{color: "black"}}>
          Blackout
        </Button>
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            rrulePlugin,
          ]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="dayGridMonth"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventDisplay="block"
          weekends={weekendsVisible}
          events={currentEvents}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          // eventsSet={handleEvents}
          eventAdd={handleEventAdd}
        />
        <div>
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
                  Add availability
                </Typography>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div style={{ padding: "25px" }}>
                  <h6>Select the type of availability rule</h6>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>This rule should</div>
                    <div style={{ width: "30%" }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={categories}
                        onChange={handleCategoryChange}
                        value={selectedCategory}
                        size="small"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <>{renderSwitchForm()}</>
                    {/* <FormGroup>
                      <FormControlLabel control={<Switch />} />
                    </FormGroup> */}
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <RadioGroup
                            onChange={(e) => {
                              setCurrentStartTime(e.target.value);
                            }}
                            value={currentSelectedStartTime}
                          >
                            {startTime && startTime.length > 0
                              ? startTime.map((item, index) => (
                                  <Radio key={index} value={item} />
                                ))
                              : null}
                          </RadioGroup>
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
          <Modal
            open={blackOut}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ overflowY: "scroll" }}
          >
            <Box sx={style}>
              <div style={{ borderBottom: "1px solid", padding: "10px" }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Set Blackout
                </Typography>
              </div>
              <div style={{ marginTop: "10px" }}>
                <div style={{ padding: "25px" }}>
                  <h6>Select the type of Blackout rule:</h6>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div>This rule should</div>
                    <div style={{ width: "30%" }}>
                      <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={categoriesBlackout}
                        onChange={handleBlackoutChange}
                        value={selectedBlackout}
                        size="small"
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ padding: "25px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <>{renderSwitchFormBlackOut()}</>
                    {/* <FormGroup>
                      <FormControlLabel control={<Switch />} />
                    </FormGroup> */}
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <RadioGroup
                            onChange={(e) => {
                              setCurrentStartTime(e.target.value);
                            }}
                            value={currentSelectedStartTime}
                          >
                            {startTime && startTime.length > 0
                              ? startTime.map((item, index) => (
                                  <Radio key={index} value={item} />
                                ))
                              : null}
                          </RadioGroup>
                        }
                      />
                    </FormGroup>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
          <Modal
            open={deleteEventModal}
            onClose={() => setDeleteEventModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ overflowY: "scroll" }}
          >
            <Box sx={style}>
              <div>
                <div style={{ padding: "25px" }}>
                  <h6>Are you sure you want to delete this event?</h6>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    onClick={() => setDeleteEventModal(false)}
                    variant="outlined"
                  >
                    Back
                  </Button>
                  <Button variant="contained" onClick={deleteEvent}>
                    Continue
                  </Button>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
        <Button onClick={handleOnFormSubmit}>Countinue </Button>
      </div>
    </div>
  );
};

export default Calendar;
const categories = [
  "Repeat weekly on selected days",
  "Repeat yearly during selected months",
  "happen beatween selected dates",
  "happen on a selected date",
];
const categoriesBlackout = [
  "Happen between selected dates",
  "Happen on a selected date",
];
