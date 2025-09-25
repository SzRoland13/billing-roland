import {
  Box,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { logout } from "../api/services/authService";
import { ROLE } from "../utils/enums";

const drawerWidth = 240;

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    roles: [ROLE.USER, ROLE.ACCOUNTANT, ROLE.ADMIN],
  },
  {
    label: "Invoices",
    path: "/invoices",
    roles: [ROLE.USER, ROLE.ACCOUNTANT, ROLE.ADMIN],
  },
  {
    label: "Create Invoice",
    path: "/create-invoice",
    roles: [ROLE.ACCOUNTANT, ROLE.ADMIN],
  },
  {
    label: "Admin",
    path: "/admin",
    roles: [ROLE.ADMIN],
  },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { username, roles, name } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems
              .filter((item) => item.roles.some((r) => roles.includes(r)))
              .map((item) => (
                <ListItemButton
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  sx={{ color: "black" }}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))}

            <Divider sx={{ my: 1 }} />

            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <Typography variant="h4" gutterBottom sx={{ color: "black" }}>
          Welcome, {name || username || "User"}!
        </Typography>
        <Typography variant="body1" gutterBottom sx={{ color: "black" }}>
          Roles: {roles.length ? roles.join(", ") : "No roles"}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardPage;
