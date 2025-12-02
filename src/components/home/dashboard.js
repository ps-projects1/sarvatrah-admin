import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import HikingIcon from "@mui/icons-material/Hiking";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import CategoryIcon from "@mui/icons-material/Category";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AddIcon from "@mui/icons-material/Add";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    hotels: 0,
    vehicles: 0,
    packages: 0,
    adventures: 0,
    cities: 0,
    categories: 0,
  });

  const [recentPackages, setRecentPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [hotelsRes, vehiclesRes, packagesRes, categoriesRes] = await Promise.all([
        fetch(`${process.env.REACT_APP_API_BASE_URL}/hotel/get-hotels`).catch(() => null),
        fetch(`${process.env.REACT_APP_API_BASE_URL}/vehicle/get-vehicles`).catch(() => null),
        fetch(`${process.env.REACT_APP_API_BASE_URL}/holiday/get-holiday-package?page=1&limit=5&sort=-createdAt`).catch(() => null),
        fetch(`${process.env.REACT_APP_API_BASE_URL}/inventries/categories`).catch(() => null),
      ]);

      const hotelsData = hotelsRes?.ok ? await hotelsRes.json() : null;
      const vehiclesData = vehiclesRes?.ok ? await vehiclesRes.json() : null;
      const packagesData = packagesRes?.ok ? await packagesRes.json() : null;
      const categoriesData = categoriesRes?.ok ? await categoriesRes.json() : null;

      const hotelsArray = Array.isArray(hotelsData?.data?.hotels)
        ? hotelsData.data.hotels
        : Array.isArray(hotelsData?.data)
        ? hotelsData.data
        : [];

      const vehiclesArray = Array.isArray(vehiclesData?.data)
        ? vehiclesData.data
        : [];

      const packagesArray = Array.isArray(packagesData?.data?.holidayPackages)
        ? packagesData.data.holidayPackages
        : [];

      const categoriesArray = Array.isArray(categoriesData?.data)
        ? categoriesData.data
        : [];

      const uniqueCities = new Set(
        hotelsArray
          .map(hotel => hotel.city)
          .filter(city => city)
      );

      setStats({
        hotels: hotelsArray.length,
        vehicles: vehiclesArray.length,
        packages: packagesData?.data?.totalItems || packagesArray.length,
        adventures: 0,
        cities: uniqueCities.size,
        categories: categoriesArray.length,
      });

      setRecentPackages(packagesArray.slice(0, 5));
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    { title: "Hotels", value: stats.hotels, icon: <HotelIcon />, color: "#3f51b5", path: "/hotel" },
    { title: "Vehicles", value: stats.vehicles, icon: <DirectionsCarIcon />, color: "#f50057", path: "/addVehicle" },
    { title: "Packages", value: stats.packages, icon: <CardTravelIcon />, color: "#4caf50", path: "/holiday-packages" },
    { title: "Adventures", value: stats.adventures, icon: <HikingIcon />, color: "#ff9800", path: "/addAdvanture" },
    { title: "Cities", value: stats.cities, icon: <LocationCityIcon />, color: "#9c27b0", path: "/city" },
    { title: "Categories", value: stats.categories, icon: <CategoryIcon />, color: "#00bcd4", path: "/addCategory" },
  ];

  const quickActions = [
    { label: "Add Hotel", icon: <HotelIcon />, path: "/hotel", color: "#3f51b5" },
    { label: "Add Vehicle", icon: <DirectionsCarIcon />, path: "/addVehicle", color: "#f50057" },
    { label: "Add Package", icon: <CardTravelIcon />, path: "/holiday-packages", color: "#4caf50" },
    { label: "Add Adventure", icon: <HikingIcon />, path: "/addAdvanture", color: "#ff9800" },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's an overview of your dashboard.
        </Typography>
      </Box>

      <Grid container spacing={3} mb={4}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card
              sx={{
                height: "100%",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: stat.color,
                      color: "white",
                      p: 1,
                      borderRadius: 2,
                      display: "flex",
                      mr: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <TrendingUpIcon sx={{ color: "#4caf50", ml: "auto" }} />
                </Box>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    startIcon={action.icon}
                    fullWidth
                    sx={{
                      justifyContent: "flex-start",
                      py: 1.5,
                      borderColor: action.color,
                      color: action.color,
                      "&:hover": {
                        borderColor: action.color,
                        backgroundColor: `${action.color}10`,
                      },
                    }}
                    onClick={() => navigate(action.path)}
                  >
                    {action.label}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Packages
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/holiday-packages")}
                  sx={{ textTransform: "none" }}
                >
                  View All
                </Button>
              </Box>
              {recentPackages.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <CardTravelIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                  <Typography variant="body1" color="text.secondary" mb={2}>
                    No packages added yet
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate("/holiday-packages")}
                  >
                    Add Your First Package
                  </Button>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Package Name</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Start City</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentPackages.map((pkg, index) => (
                        <TableRow
                          key={pkg._id || index}
                          sx={{
                            "&:hover": { backgroundColor: "action.hover" },
                            cursor: "pointer",
                          }}
                          onClick={() => navigate("/holiday-packages")}
                        >
                          <TableCell>{pkg.packageName || "-"}</TableCell>
                          <TableCell>{pkg.packageType || "-"}</TableCell>
                          <TableCell>
                            {pkg.packageDuration?.days || 0}D / {pkg.packageDuration?.nights || 0}N
                          </TableCell>
                          <TableCell>{pkg.startCity || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
