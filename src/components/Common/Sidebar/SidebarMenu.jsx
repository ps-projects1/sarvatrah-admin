import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CategoryIcon from "@mui/icons-material/Category";
import HikingIcon from "@mui/icons-material/Hiking";
import CardTravelIcon from "@mui/icons-material/CardTravel";
import PolicyIcon from "@mui/icons-material/Policy";
import PeopleIcon from "@mui/icons-material/People";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import StoreIcon from "@mui/icons-material/Store";
import CopyrightIcon from "@mui/icons-material/Copyright";

export const MENU_ITEMS = [
  { path: "dashboard", label: "Dashboard", icon: <DashboardIcon /> },
  { path: "hotel", label: "Hotels", icon: <HotelIcon /> },
  { path: "city", label: "Cities", icon: <LocationCityIcon /> },
  { path: "addVehicle", label: "Vehicles", icon: <DirectionsCarIcon /> },
  { path: "addCategory", label: "Categories", icon: <CategoryIcon /> },
  { path: "addAdvanture", label: "Adventures", icon: <HikingIcon /> },
  { path: "holiday-packages", label: "Packages", icon: <CardTravelIcon /> },
  { path: "policy", label: "Policies", icon: <PolicyIcon /> },
  { path: "manageDriver", label: "Drivers", icon: <PeopleIcon /> },
  { path: "manageOffer", label: "Offers", icon: <LocalOfferIcon /> },
  {
    path: "manageSeasonality",
    label: "Seasonality",
    icon: <CalendarTodayIcon />,
  },
  { path: "manageVendor", label: "Vendors", icon: <StoreIcon /> },
  { path: "manageFooter", label: "Footer", icon: <CopyrightIcon /> },
];

export default function SidebarMenu({ open, handleNavigation }) {
  const { pathname } = useLocation();
  const theme = useTheme();

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", overflowX: "hidden" }}>
      <List sx={{ py: 1 }}>
        {MENU_ITEMS.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={pathname === `/${item.path}`}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color:
                    pathname === `/${item.path}`
                      ? theme.palette.primary.main
                      : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: pathname === `/${item.path}` ? 600 : "normal",
                }}
                sx={{
                  opacity: open ? 1 : 0,
                  color:
                    pathname === `/${item.path}`
                      ? theme.palette.primary.main
                      : "inherit",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
