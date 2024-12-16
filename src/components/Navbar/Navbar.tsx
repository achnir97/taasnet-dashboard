import React from "react";
import { NavLink } from "react-router-dom";
import { Box, Stack, Typography } from "@mui/material";

const Navbar: React.FC = () => {
  return (
    <Box
      component="nav"
      sx={{
        width: "100%",
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{ textDecoration: "none", color: "inherit" }}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 500,
                position: "relative",
                transition: "color 0.3s ease",
                "&:hover": { color: "#555" },
                "&.active-link": {
                  color: "green",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -4,
                    width: "100%",
                    height: "3px",
                    backgroundColor: "green",
                  },
                },
              }}
            >
              {item.label}
            </Typography>
          </NavLink>
        ))}
      </Stack>
    </Box>
  );
};

const navItems = [
  { path: "/home", label: "Home" },
  { path: "/profile-management", label: "Profile Management" },
  { path: "/events-list", label: "Services" },
  { path: "/bookings", label: "Accepted Bookings" },
  { path: "/create-event", label: "Create Cards" },
  { path: "/service-platform", label: "Service Platform" },
  { path: "/broadcast", label: "LiveStream Broadcast" },
];

export default Navbar;
