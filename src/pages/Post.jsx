import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { db } from "../firebase";
import { ref, update } from "firebase/database";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { groupDataPicker } from "../store/groupData";
import { groupMembersState } from "../store/groupMembers";
import useGroupData from "../hooks/useGroupData";
import Header from "../component/Header";
import PostImage from "../component/PostImage";
import GroupNameModal from "../component/modal/GroupNameModal";
import AddMembersModal from "../component/modal/AddMembersModal";

const Post = () => {
  useGroupData();

  const { guid } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));
  console.log("picekdData: ", pickedGroupData);
  const { groupId, groupName, timestamp, groupMembers } = pickedGroupData[0];
  const groupMembersString = groupMembers?.join(",") || null;

  // 각 action 에 따른 모달오픈 state
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  const [showGroupmembersModal, setShowGroupMembersModal] = useState(false);
  // addMember 에 필요한 변수
  const setGroupMembers = useSetRecoilState(groupMembersState);
  const [members, setMembers] = useState([]);

  // anchorRef
  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);
  // 그룹명 변경
  const handleGroupNameModalClose = useCallback(() => {
    setShowGroupNameModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handleShowGroupNameModal = useCallback(() => {
    setShowGroupNameModal(true);
  }, []);
  // 멤버 입력
  const handleGroupmemebrsModalClose = useCallback(() => {
    setShowGroupMembersModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handleShowGroupMembersModal = useCallback(() => {
    setGroupMembers(groupMembers);
    setMembers([]);
    console.log("realtime 속 member: ", groupMembers);
    setShowGroupMembersModal(true);
  }, [groupMembers, setGroupMembers]);

  //  member 는 한 단어가 아니라 배열을 받아들여야 해 그 처리를 modal 안에서 할 수 없다.
  // setValue 후 상태값이 변하는 useEffect 가 일어나기 전에 value 를 읽게 돼서 불가피하게 부모에서 저장처리함.
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
            width: "30vw",
          }}
        >
          <PeopleAltIcon
            sx={{
              fontSize: "3vw",
              color: "#403234",
              verticalAlign: "sub",
              marginRight: "1vw",
            }}
          />{" "}
          {groupMembersString}
        </Typography>
        <Menu
          sx={{ mt: "45px" }}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleShowGroupMembersModal}>
            <Typography textAlign="center">멤버추가</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign="center">사진추가</Typography>
          </MenuItem>
          <MenuItem onClick={handleShowGroupNameModal}>
            <Typography textAlign="center">그룹이름수정</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <PostImage />
      <GroupNameModal
        open={showGroupNameModal}
        handleClose={handleGroupNameModalClose}
        action="changeName"
        guid={guid}
      />
      <AddMembersModal
        open={showGroupmembersModal}
        handleClose={handleGroupmemebrsModalClose}
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
