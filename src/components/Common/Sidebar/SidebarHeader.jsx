import { Box, IconButton, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTheme, styled } from "@mui/material/styles";
import logo from "../../../assets/images/mainLogo.svg";

// Styled components with enhanced design
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

export default function SidebarHeader({ open, handleDrawerToggle }) {
  const theme = useTheme();

  return (
    <DrawerHeader>
      <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
        <img
          src={logo}
          alt="Sarvatrah logo"
          style={{ height: 40, width: "auto" }}
        />
        {open && (
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
            Sarvatrah
          </Typography>
        )}
      </Box>
      <IconButton onClick={handleDrawerToggle} sx={{ color: "inherit" }}>
        {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </IconButton>
    </DrawerHeader>
  );
}
