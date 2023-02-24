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
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../store/user";
import ProfileModal from "./modal/ProfileModal";

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { userId, displayName, photoURL } = useRecoilValue(currentUserState);

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

  const handleProfileModalClose = useCallback(() => {
    setShowProfileModal(false);
  }, []);

  const handleLogout = useCallback(async () => {
    console.log("userId : ", userId);
    await signOut(auth);
    handleCloseMenu();
  }, [handleCloseMenu, userId]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          color: "#403234",
          backgroundColor: "#f2e9eb",
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
                {userId && console.log("currentUser : ", displayName)}
                {userId !== null ? displayName : "guest"}
              </Typography>
              <Avatar
                src={userId !== null ? photoURL : null}
                sx={{ ml: "10px", bgcolor: "#dd82a4" }}
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
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <ProfileModal
        open={showProfileModal}
        handleClose={handleProfileModalClose}
      />
    </>
  );
}

export default Header;
