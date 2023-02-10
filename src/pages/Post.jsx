import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import { serverTimestamp } from "firebase/database";
import Header from "../component/Header";
import { groupDataPicker } from "../store/groupData";
import GreenPasta from "../static/image/green-pasta.jpeg";
import WhitePasta from "../static/image/white-pasta.jpeg";
import Gnoggi from "../static/image/gnoggi.jpeg";
import Signin from "../static/image/bg_signin.png";

// import GroupDetailsModal from "../component/modal/GroupDetailsModal";
// import { groupMembersState } from "../store/groupName";
// import { db } from "../firebase";
// import { set, ref, serverTimestamp, update } from "firebase/database";

const Post = () => {
  const { guid } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));
  const { groupId, groupName, timestamp } = pickedGroupData[0];

  const itemData = [
    {
      img: Signin,
      title: "카페 한구석 멋진 풍경",
      timestamp: serverTimestamp(),
    },
    {
      img: WhitePasta,
      title: "트러풀이 들어 간 파스타",
      timestamp: serverTimestamp(),
    },
    {
      img: GreenPasta,
      title: "캐비어가 들어 간 생면 파스타",
      timestamp: serverTimestamp(),
    },
    {
      img: Gnoggi,
      title: "엄지척 뇨끼~~ 진짜 대박 맛있음",
      timestamp: serverTimestamp(),
    },
  ];

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

  // const AddMembers = ()=>{
  //   const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  //   const [members, setMembers] = useRecoilState(groupMembersState);

  //   const handleShowGroupDetailsModal = useCallback(() => {
  //     setShowGroupDetailsModal(false);
  //   }, []);

  //   const handleCreateGroup = useCallback(() => {
  //     setShowGroupDetailsModal(true);
  //   }, []);

  //   const writeToDatabase = useCallback(() => {
  //     const updates = {};
  //     updates["/groups/"+guid+"/groupMembers"] = gorupMembers
  //   }, [groupMembers]);
  // }
  return (
    <StyleContainer>
      <Header />
      <Box
        sx={{
          paddingLeft: "5vw",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Button variant="outlined" onClick={handleOpenMenu}>
          <MenuIcon />
          <div style={{ width: "2vw" }} />
          <Typography component="div" variant="h6">
            {groupName}
          </Typography>
        </Button>

        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleProfileModalOpen}>
            <Typography textAlign="center">멤버추가</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign="center">사진추가</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign="center">그룹이름수정</Typography>
          </MenuItem>
        </Menu>
      </Box>
      {isMobile ? (
        <>
          <ImageList sx={{ paddingLeft: "5vw" }}>
            {itemData.map((item) => (
              <>
                <ImageListItem key={item.img} sx={{ width: "40vw" }}>
                  <img
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar title={item.title} position="below" />
                </ImageListItem>
              </>
            ))}
          </ImageList>
        </>
      ) : (
        <>
          <ImageList
            variant="masonry"
            cols={3}
            gap={8}
            sx={{
              paddingLeft: "10vw",
              paddingRight: "10vw",
              marginBottom: "8vh",
              height: "100vh",
            }}
          >
            {itemData.map((item) => (
              <>
                <ImageListItem key={item.img} sx={{ height: "100%" }}>
                  <img
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar position="below" title={item.title} />
                </ImageListItem>
              </>
            ))}
          </ImageList>
        </>
      )}
    </StyleContainer>
  );
};

export default Post;

const StyleContainer = styled.div`
  padding-top: 80px;
  background-color: #f7f1f0;
  max-width: 100vw;
`;
