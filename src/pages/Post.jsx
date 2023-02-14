import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import { ref, update } from "firebase/database";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Header from "../component/Header";
import { groupDataPicker } from "../store/groupData";
import GroupDetailsModal from "../component/modal/GroupDetailsModal";
import { groupMembersState } from "../store/groupMembers";
import useGroupData from "../hooks/useGroupData";
import PostImage from "../component/PostImage";

const Post = () => {
  useGroupData();

  const { guid } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));
  const { groupId, groupName, timestamp, groupMembers } = pickedGroupData[0];
  const setGroupMembers = useSetRecoilState(groupMembersState);

  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [members, setMembers] = useState([]);
  const groupMembersString = groupMembers?.join(",") || null;

  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleGroupDetailsModalOpen = useCallback(() => {
    setGroupMembers(groupMembers);
    setMembers([]);
    setShowGroupDetailsModal(true);
    handleCloseMenu();
  }, [groupMembers, handleCloseMenu, setGroupMembers]);

  const handleShowGroupDetailsModal = useCallback(() => {
    setShowGroupDetailsModal(false);
  }, []);

  const writeToDatabase = useCallback(async () => {
    const updates = {};
    const newMembers = groupMembers?.concat(members) || members;
    updates["/groups/" + guid + "/groupMembers"] = newMembers;
    await update(ref(db), updates);
  }, [groupMembers, guid, members]);

  const handleNameString = useCallback(() => {
    console.log("members : ", members);
    writeToDatabase();
  }, [members, writeToDatabase]);

  const addImage = () => {};

  return (
    <StyleContainer>
      <Header />
      <Box
        sx={{
          paddingLeft: "5vw",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Button variant="outlined" onClick={handleOpenMenu}>
          <MenuIcon />
          <div style={{ width: "2vw" }} />
          <Typography component="div" variant="h6">
            {groupName}
          </Typography>
        </Button>
        <Typography
          component="div"
          sx={{
            fontSize: "2vw",
            color: "#403234",
            verticalAlign: "bottom",
            paddingRight: "5vw",
          }}
        >
          그룹멤버 : {groupMembersString}
        </Typography>
        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleGroupDetailsModalOpen}>
            <Typography textAlign="center">멤버추가</Typography>
          </MenuItem>
          <MenuItem onClick={addImage}>
            <Typography textAlign="center">사진추가</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign="center">그룹이름수정</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <PostImage />
      <GroupDetailsModal
        open={showGroupDetailsModal}
        handleClose={handleShowGroupDetailsModal}
        name="addMembers"
        inputValue={members}
        setInputValue={setMembers}
        handleCreate={handleNameString}
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
