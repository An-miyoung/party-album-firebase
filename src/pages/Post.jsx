import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { ref, serverTimestamp, update } from "firebase/database";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import { useRecoilValue, useRecoilState } from "recoil";
import Header from "../component/Header";
import { groupDataPicker } from "../store/groupData";
import GreenPasta from "../static/image/green-pasta.jpeg";
import WhitePasta from "../static/image/white-pasta.jpeg";
import Gnoggi from "../static/image/gnoggi.jpeg";
import Signin from "../static/image/bg_signin.png";
import GroupDetailsModal from "../component/modal/GroupDetailsModal";
import { groupMembersState } from "../store/groupMembers";

const Post = () => {
  const { guid } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));
  const { groupId, groupName, timestamp, groupMembers } = pickedGroupData[0];
  // const hasGroupMembers =
  //   groupMembers !== undefined &&
  //   groupMembers !== null &&
  //   groupMembers.length > 0;

  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [members, setMembers] = useRecoilState(groupMembersState);

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

  const handleAddMembersModalOpen = useCallback(() => {
    setShowAddMembersModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  const handleShowAddMembersModal = useCallback(() => {
    setShowAddMembersModal(false);
  }, []);

  const writeToDatabase = useCallback(async () => {
    const updates = {};
    updates["/groups/" + guid + "/groupMembers"] = members;
    await update(ref(db), updates);
  }, [guid, members]);

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
          <MenuItem onClick={handleAddMembersModalOpen}>
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
      <GroupDetailsModal
        open={showAddMembersModal}
        handleClose={handleShowAddMembersModal}
        name="groupMembers"
        inputValue={members}
        setInputValue={setMembers}
        handleCreate={writeToDatabase}
      />
    </StyleContainer>
  );
};

export default Post;

const StyleContainer = styled.div`
  padding-top: 80px;
  background-color: #f7f1f0;
  max-width: 100vw;
`;
