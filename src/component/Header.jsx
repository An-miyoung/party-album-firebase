import React, { useState, useCallback } from "react";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
// import "../firebase";
// import { signOut, getAuth } from "firebase/auth";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleProfileModalOpen = useCallback(() => {
    setShowProfileModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  // const handleProfileModalClose = useCallback(() => {
  //   setShowProfileModal(false);
  // }, []);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          color: "#333333",
          backgroundColor: "#ccccff",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            height: "50px",
          }}
        >
          <Box sx={{ display: "flex" }}>
            <Typography component="div" variant="h6">
              추억파뤼앨범
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleOpenMenu}>
              <Typography component="div" variant="h6">
                미영
              </Typography>
              <Avatar
                sx={{ ml: "10px", bgcolor: "secondary.main" }}
                alt="ProfileImage"
              ></Avatar>
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleProfileModalOpen}>
                <Typography textAlign="center">프로필이미지</Typography>
              </MenuItem>
              <MenuItem>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
