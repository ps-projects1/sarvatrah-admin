import * as React from "react";
import { useAuth } from "../context/AuthContext";
import { styled, useTheme } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { DRAWER_WIDTH, LOGIN_PATH } from "../utils/constant";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Header from "../components/Common/Header/Header";
import SidebarHeader from "../components/Common/Sidebar/SidebarHeader";
import SidebarMenu from "../components/Common/Sidebar/SidebarMenu";
import SidebarFooter from "../components/Common/Sidebar/SidebarFooter";

const MainHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  color: theme.palette.primary.contrastText,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open ? openedMixin(theme) : closedMixin(theme)),
  "& .MuiDrawer-paper": {
    ...(open ? openedMixin(theme) : closedMixin(theme)),
    backgroundColor: theme.palette.background.paper,
    borderRight: "none",
  },
}));

// Mixins
const openedMixin = (theme) => ({
  width: DRAWER_WIDTH,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Layout = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setOpen(!open);
  const handleNavigation = (path) => navigate(`/${path}`);

  const { logout } = useAuth(); // Get user and logout from auth context
  const [anchorEl, setAnchorEl] = React.useState(null);
  const profileMenuOpen = Boolean(anchorEl);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
  };

  if (pathname === LOGIN_PATH) {
    return children;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* Header Of Dashboard */}
      <Header
        open={open}
        anchorEl={anchorEl}
        profileMenuOpen={profileMenuOpen}
        handleLogout={handleLogout}
        handleProfileClick={handleProfileClick}
        handleProfileClose={handleProfileClose}
        handleDrawerToggle={handleDrawerToggle}
      />
      {/* Sidebar */}
      <Drawer variant="permanent" open={open}>
        {/* Header Fixed */}
        <SidebarHeader open={open} handleDrawerToggle={handleDrawerToggle} />
        <Divider />
        {/* Scrollable Menu Section */}
        <SidebarMenu open={open} handleNavigation={handleNavigation} />
        <Divider />
        {/* Footer Fixed */}
        <SidebarFooter handleLogout={handleLogout} open={open} />
      </Drawer>
      {/* Main Layout */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.grey[50],
          minHeight: "100vh",
        }}
      >
        <MainHeader />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
