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

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const currentUser = useRecoilValue(currentUserState);

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
  const handleLogout = useCallback(async () => {
    console.log(currentUser);
    await signOut(auth);
    // App.js 내부 onAuthStateChanged 함수를 이용해 로그아웃 처리를 해준다.
  }, [currentUser]);

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
                {currentUser && console.log("currentUser : ", currentUser)}
                {currentUser.uid !== null ? currentUser.displayName : "guest"}
              </Typography>
              <Avatar
                src={currentUser.uid !== null ? currentUser.photoURL : null}
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
    </>
  );
}

export default Header;
