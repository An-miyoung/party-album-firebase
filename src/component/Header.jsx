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
import { Link } from "react-router-dom";
import { ROUTES } from "../routes";

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
    await signOut(auth);
    handleCloseMenu();
  }, [handleCloseMenu]);

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
                {userId !== null ? displayName : "guest"}
              </Typography>
              <Avatar
                src={userId !== null ? photoURL : null}
                sx={{ ml: "10px", bgcolor: "#dd82a4" }}
                alt="ProfileImage"
              ></Avatar>
            </IconButton>
            {userId !== null && (
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
            )}
            {userId == null && (
              <Menu
                Menu
                sx={{ mt: "45px" }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
              >
                <MenuItem>
                  <Typography textAlign="center">
                    <Link
                      to={ROUTES.LOGIN}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      로그인
                    </Link>
                  </Typography>
                </MenuItem>
                <MenuItem>
                  <Typography textAlign="center">
                    <Link
                      to={ROUTES.JOIN}
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      회원가입
                    </Link>
                  </Typography>
                </MenuItem>
              </Menu>
            )}
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
