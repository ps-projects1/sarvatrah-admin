import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import LoadingSpinner from "../Common/LoadingSpinner";
import ErrorMessage from "../Common/ErrorMessage";
import CloseIcon from "@mui/icons-material/Close";
import Switch from "@mui/material/Switch";
import Carousel from "react-material-ui-carousel";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

const HotelList = ({
  hotels = [],
  loading,
  selectedHotel,
  setSelectedHotel,
  handleDelete,
  handleEdit,
  isMobile,
  openViewModal,
  setOpenViewModal,
  openEditModal,
  setOpenEditModal,
  editingHotel,
  handleUpdateHotel,
  setEditingHotel,
  handleStatusToggle,
  updatingHotelId,
}) => {
  const [editFormData, setEditFormData] = React.useState(null);

  React.useEffect(() => {
    if (editingHotel) {
      setEditFormData(editingHotel);
    }
  }, [editingHotel]);

  const handleView = (hotel) => {
    setSelectedHotel(hotel);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedHotel(null);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditingHotel(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...editFormData.rooms];
    updatedRooms[index][field] = value;
    setEditFormData({
      ...editFormData,
      rooms: updatedRooms,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleUpdateHotel(editFormData);
    handleCloseEditModal();
  };

   const sortedHotels = [...hotels].sort((a, b) => {
    const dateA = new Date(a.updatedAt || a.createdAt || 0);
    const dateB = new Date(b.updatedAt || b.createdAt || 0);
    return dateB - dateA; 
  });


  const handleDeleteWithErrorHandling = async (hotelId) => {
    await handleDelete(hotelId);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!hotels || hotels.length === 0) {
    return <ErrorMessage message="No hotels found" />;
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Hotel List
      </Typography>

      <TableContainer component={Paper}>
        <Table aria-label="hotel table">
          <TableHead>
            <TableRow>
              <TableCell>Hotel Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Rooms</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedHotels.map((hotel) => (
              <TableRow key={hotel._id || hotel.id}>
                <TableCell>
                  <Typography fontWeight="bold">
                    {hotel.hotelName || "N/A"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {hotel.email || "No email"}
                  </Typography>
                </TableCell>
                <TableCell>{hotel.hotelType || "N/A"}</TableCell>
                <TableCell>
                  {hotel.city || "N/A"}, {hotel.state || "N/A"}
                  <Typography variant="body2" color="textSecondary">
                    {hotel.address || "No address"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip
                    title={hotel.active ? "Deactivate hotel" : "Activate hotel"}
                  >
                    <Box display="flex" alignItems="center">
                      {updatingHotelId === hotel._id ? (
                        <CircularProgress size={24} />
                      ) : (
                        <>
                          <Switch
                            checked={hotel.active}
                            onChange={(e) =>
                              handleStatusToggle(hotel._id, e.target.checked)
                            }
                            color="primary"
                            size="small"
                          />
                          <Chip
                            label={hotel.active ? "Active" : "Inactive"}
                            size="small"
                            color={hotel.active ? "success" : "default"}
                            variant="outlined"
                            sx={{ ml: 1 }}
                          />
                        </>
                      )}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {hotel.rooms?.length || 0} types
                  <Typography variant="body2" color="textSecondary">
                    {hotel.rooms?.length > 0
                      ? `${Math.min(
                          ...hotel.rooms.map(
                            (room) => room.occupancyRates[1] || 0
                          )
                        )} - 
                         ${Math.max(
                           ...hotel.rooms.map(
                             (room) => room.occupancyRates[1] || 0
                           )
                         )}`
                      : "No price range"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {hotel.phoneNumber || "N/A"}
                  <Typography variant="body2" color="textSecondary">
                    {hotel.contactPerson || "No contact person"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {isMobile ? (
                    <div>
                      <IconButton
                        color="primary"
                        onClick={() => handleView(hotel)}
                        aria-label="view"
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEdit(hotel)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteWithErrorHandling(hotel._id)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleView(hotel)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => handleEdit(hotel)}
                        color="secondary"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteWithErrorHandling(hotel._id)}
                        color="error"
                        size="small"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Modal */}
      <Modal
        open={openViewModal}
        aria-labelledby="hotel-view-modal"
        disableEscapeKeyDown
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "80%",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          {selectedHotel ? (
            <div>
              {/* Header Section */}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h4" gutterBottom>
                  {selectedHotel.hotelName}
                  {selectedHotel.active && (
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Typography>
                <IconButton onClick={handleCloseViewModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Typography
                variant="subtitle1"
                color="textSecondary"
                gutterBottom
              >
                {selectedHotel.hotelType} • {selectedHotel.city},{" "}
                {selectedHotel.state}
              </Typography>

              {/* Image Slider */}
              {selectedHotel.imgs?.length > 0 ? (
                <Box sx={{ my: 3 }}>
                  <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                    Debug: {selectedHotel.imgs.length} images found
                  </Typography>
                  <Carousel
                    autoPlay={false}
                    navButtonsAlwaysVisible
                    indicators
                    animation="slide"
                  >
                    {selectedHotel.imgs.map((img, index) => {
                      // Debug logging
                      console.log("Image data:", img);
                      console.log("Image type:", typeof img);

                      const imageSrc = typeof img === 'string'
                        ? (img.startsWith('http') ? img : `${process.env.REACT_APP_API_BASE_URL}/${img}`)
                        : (img.path?.startsWith('http') ? img.path : `${process.env.REACT_APP_API_BASE_URL}/${img.path}`);

                      console.log("Final image URL:", imageSrc);

                      return (
                        <Box key={index} sx={{ height: "300px" }}>
                          <Typography variant="caption" sx={{ display: 'block', mb: 1 }}>
                            Image {index + 1}: {imageSrc}
                          </Typography>
                          <img
                            src={imageSrc}
                            alt={`${selectedHotel.hotelName} ${index + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              console.error("Image failed to load:", imageSrc);
                              console.error("Original img data:", img);
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ddd' width='300' height='300'/%3E%3Ctext fill='%23999' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3EImage not found%3C/text%3E%3C/svg%3E";
                            }}
                            onLoad={() => {
                              console.log("Image loaded successfully:", imageSrc);
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Carousel>
                </Box>
              ) : (
                <Box
                  sx={{
                    height: "200px",
                    bgcolor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    my: 3,
                  }}
                >
                  <Typography>No Images Available</Typography>
                </Box>
              )}

              {/* Hotel Details */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Hotel Information
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">Description</Typography>
                    <Typography>
                      {selectedHotel.descriptions || "No description available"}
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Address</Typography>
                      <Typography>
                        {selectedHotel.address || "N/A"}
                        <br />
                        {selectedHotel.city}, {selectedHotel.state} -{" "}
                        {selectedHotel.pincode}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">Contact</Typography>
                      <Typography>
                        Phone: {selectedHotel.phoneNumber || "N/A"}
                        <br />
                        Email: {selectedHotel.email || "N/A"}
                        <br />
                        Contact Person: {selectedHotel.contactPerson || "N/A"}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    Room Types & Rates
                  </Typography>

                  {selectedHotel.rooms?.length > 0 ? (
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Type</TableCell>
                            <TableCell align="right">Occupancy 1</TableCell>
                            <TableCell align="right">Occupancy 2</TableCell>
                            <TableCell align="right">Occupancy 3</TableCell>
                            <TableCell align="right">Child (Bed)</TableCell>
                            <TableCell align="right">Child (No Bed)</TableCell>
                            <TableCell>Amenities</TableCell>
                            <TableCell>Availability</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {selectedHotel.rooms.map((room, index) => (
                            <TableRow key={index}>
                              <TableCell>{room.roomType}</TableCell>
                              <TableCell align="right">
                                ₹{room.occupancyRates[0]}
                              </TableCell>
                              <TableCell align="right">
                                ₹{room.occupancyRates[1]}
                              </TableCell>
                              <TableCell align="right">
                                ₹{room.occupancyRates[2]}
                              </TableCell>
                              <TableCell align="right">
                                ₹{room.child.childWithBedPrice}
                              </TableCell>
                              <TableCell align="right">
                                ₹{room.child.childWithoutBedPrice}
                              </TableCell>
                              <TableCell>
                                {room.amenities?.join(", ") || "None"}
                              </TableCell>
                              <TableCell>
                                {room.duration[0]?.startDate ? (
                                  <>
                                    {new Date(
                                      room.duration[0].startDate
                                    ).toLocaleDateString()}{" "}
                                    -{" "}
                                    {new Date(
                                      room.duration[0].endDate
                                    ).toLocaleDateString()}
                                  </>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography>No room information available</Typography>
                  )}
                </Grid>
              </Grid>

              {/* Additional Information */}
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "background.paper",
                  borderRadius: 1,
                }}
              >
                <Typography variant="subtitle2">
                  Additional Information
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Last Updated:</strong>{" "}
                      {new Date(selectedHotel.updatedAt).toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Status:</strong>{" "}
                      {selectedHotel.active ? "Active" : "Inactive"}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Total Rooms:</strong>{" "}
                      {selectedHotel.rooms?.length || 0}
                    </Typography>
                  </Grid> */}
                  <Grid item xs={6} md={3}>
                    <Typography variant="body2">
                      <strong>Total Images:</strong>{" "}
                      {selectedHotel.imgs?.length || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={handleCloseViewModal}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    handleCloseViewModal();
                    handleEdit(selectedHotel);
                  }}
                >
                  Edit Hotel
                </Button>
              </Box>
            </div>
          ) : (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6">No hotel data available</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={handleCloseViewModal}
              >
                Close
              </Button>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={openEditModal}
        aria-labelledby="hotel-edit-modal"
        disableEscapeKeyDown
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "80%",
            maxHeight: "90vh",
            overflowY: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          {editFormData ? (
            <form onSubmit={handleSubmit}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">
                  Edit Hotel
                </Typography>
                <IconButton
                  onClick={handleCloseEditModal}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Hotel Name"
                    name="hotelName"
                    value={editFormData.hotelName || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Hotel Type"
                    name="hotelType"
                    value={editFormData.hotelType || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                    select
                  >
                    <MenuItem value="standard">Standard</MenuItem>
                    <MenuItem value="luxury">Luxury</MenuItem>
                    <MenuItem value="boutique">Boutique</MenuItem>
                    <MenuItem value="resort">Resort</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={editFormData.address || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={editFormData.city || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={editFormData.state || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Pincode"
                    name="pincode"
                    value={editFormData.pincode || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                Contact Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phoneNumber"
                    value={editFormData.phoneNumber || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={editFormData.email || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                    type="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Person"
                    name="contactPerson"
                    value={editFormData.contactPerson || ""}
                    onChange={handleFormChange}
                    margin="normal"
                    required
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
                Room Information
              </Typography>
              {editFormData.rooms?.length > 0 ? (
                editFormData.rooms.map((room, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 3,
                      p: 2,
                      border: "1px solid #ddd",
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom>
                      Room Type: {room.roomType || "N/A"}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Room Type"
                          value={room.roomType || ""}
                          onChange={(e) =>
                            handleRoomChange(index, "roomType", e.target.value)
                          }
                          margin="normal"
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Price"
                          value={room.roomPrice || ""}
                          onChange={(e) =>
                            handleRoomChange(index, "roomPrice", e.target.value)
                          }
                          margin="normal"
                          required
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          fullWidth
                          label="Inventory"
                          value={room.inventry || ""}
                          onChange={(e) =>
                            handleRoomChange(index, "inventry", e.target.value)
                          }
                          margin="normal"
                          required
                          type="number"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          Amenities
                        </Typography>
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {room.amenities?.length > 0 ? (
                            room.amenities.map((amenity, i) => (
                              <Chip key={i} label={amenity || "N/A"} />
                            ))
                          ) : (
                            <Typography variant="body2">
                              No amenities
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))
              ) : (
                <Typography>No rooms available</Typography>
              )}

              <Box
                sx={{
                  mt: 3,
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                }}
              >
                <Button variant="outlined" onClick={handleCloseEditModal}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
                </Button>
              </Box>
            </form>
          ) : (
            <ErrorMessage message="No hotel data to edit" />
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default HotelList;
