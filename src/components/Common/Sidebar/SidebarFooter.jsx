import { Box, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function SidebarFooter({ open, handleLogout }) {

  return (
    <Box sx={{ p: 2 }}>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: open ? 3 : "auto",
            justifyContent: "center",
          }}
        >
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText
          primary="Logout"
          sx={{ opacity: open ? 1 : 0 }}
          primaryTypographyProps={{ fontWeight: 600 }}
        />
      </ListItemButton>
    </Box>
  );
}
