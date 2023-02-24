import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { db } from "../firebase";
import { child, get, ref, update } from "firebase/database";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import useMediaQuery from "@mui/material/useMediaQuery";
import { groupDataPicker } from "../store/groupData";
import { groupMembersState } from "../store/groupMembers";
import Header from "../component/Header";
import PostImage from "../component/PostImage";
import GroupNameModal from "../component/modal/GroupNameModal";
import AddMembersModal from "../component/modal/AddMembersModal";
import UploadImageModal from "../component/modal/UploadImageModal";
import { currentUserState } from "../store/user";
import { groupIdState } from "../store/groupId";
import { groupNameState } from "../store/groupName";

const ShareGuest = () => {
  const { guid } = useParams();
  const { userId } = useRecoilValue(currentUserState);
  const setGroupId = useSetRecoilState(groupIdState);
  const [groupName, setGroupName] = useRecoilState(groupNameState);
  const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [anchorEl, setAnchorEl] = useState(null);
  const pickedGroupData = useRecoilValue(groupDataPicker(guid));

  const readRecoilState = useCallback(() => {
    const { groupName, groupMembers } = pickedGroupData[0];
    setGroupId(guid);
    setGroupName(groupName);
    setGroupMembers(groupMembers);
  }, [guid, pickedGroupData, setGroupId, setGroupMembers, setGroupName]);

  const fetchPostData = useCallback(() => {
    const dbRef = ref(db);
    get(child(dbRef, `groups/${userId}/${guid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const { groupId, groupName, groupMembers } = snapshot.val();
          setGroupId(guid);
          setGroupId(groupId);
          setGroupName(groupName);
          setGroupMembers(groupMembers);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [guid, setGroupId, setGroupMembers, setGroupName, userId]);

  useEffect(() => {
    if (pickedGroupData?.length > 0) {
      readRecoilState();
    } else if (
      pickedGroupData === undefined ||
      pickedGroupData === null ||
      pickedGroupData.length === 0
    ) {
      fetchPostData();
    }
  }, [
    fetchPostData,
    pickedGroupData,
    pickedGroupData?.length,
    readRecoilState,
  ]);

  const groupMembersString = groupMembers?.join(",") || null;

  // 각 action 에 따른 모달오픈 state
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [showGroupmembersModal, setShowGroupMembersModal] = useState(false);
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  // addMember 에 필요한 변수
  const [members, setMembers] = useState([]);
  // uploadImage 에 필요한 변수
  const [percent, setPercent] = useState(null);

  // anchorRef
  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // 멤버 입력
  const handleGroupmemebrsModalClose = useCallback(() => {
    setShowGroupMembersModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handleShowGroupMembersModal = useCallback(() => {
    setGroupMembers(groupMembers);
    setMembers([]);
    setShowGroupMembersModal(true);
    handleCloseMenu();
  }, [groupMembers, handleCloseMenu, setGroupMembers]);
  // 사진 입력
  const handleUploadImageModalClose = useCallback(() => {
    setShowUploadImageModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handelShowUploadImageModal = useCallback(() => {
    setShowUploadImageModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);
  // 그룹명 변경
  const handleGroupNameModalClose = useCallback(() => {
    setShowGroupNameModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handleShowGroupNameModal = useCallback(() => {
    setShowGroupNameModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  //  member 는 한 단어가 아니라 배열을 받아들여야 해 그 처리를 modal 안에서 할 수 없다.
  // setValue 후 상태값이 변하는 useEffect 가 일어나기 전에 value 를 읽게 돼서 불가피하게 부모에서 저장처리함.
  const writeToDatabase = useCallback(async () => {
    const updates = {};
    const newMembers = groupMembers?.concat(members) || members;
    updates[`/groups/${userId}/${guid}/groupMembers`] = newMembers;
    await update(ref(db), updates);
  }, [groupMembers, guid, members, userId]);

  const handleNameString = useCallback(() => {
    writeToDatabase();
  }, [writeToDatabase]);

  return (
    <StyleContainer>
      <Header />
      <Box
        sx={{
          paddingLeft: "5vw",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          flexWrap: "wrap",
          alignItems: "baseline",
        }}
      >
        <Button variant="outlined" onClick={handleOpenMenu}>
          <MenuIcon />
          <div style={{ width: "1.5vw" }} />
          <Typography component="div" variant="h6">
            {groupName}
          </Typography>
        </Button>
        <div style={{ width: "5px" }} />
        {isMobile ? (
          <Typography
            component="div"
            sx={{
              fontSize: "4vw",
              color: "#403234",
              verticalAlign: "super",
              paddingRight: "5vw",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
            }}
          >
            <div style={{ width: "1vw" }} />
            <PeopleAltIcon
              sx={{
                fontSize: "5vw",
                color: "#403234",
                marginRight: "1vw",
                verticalAlign: "sub",
              }}
            />{" "}
            {groupMembersString}
          </Typography>
        ) : (
          <Typography
            component="div"
            sx={{
              fontSize: "20px",
              color: "#403234",
              verticalAlign: "bottom",
              paddingRight: "5vw",
              width: "30vw",
              overflowWrap: "break-word",
              wordBreak: "keep-all",
            }}
          >
            <div style={{ width: "1vw" }} />
            <PeopleAltIcon
              sx={{
                fontSize: "20px",
                color: "#403234",
                verticalAlign: "sub",
                marginRight: "1vw",
              }}
            />{" "}
            {groupMembersString}
          </Typography>
        )}
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
          <MenuItem onClick={handelShowUploadImageModal}>
            <Typography textAlign="center">사진추가</Typography>
          </MenuItem>
          <MenuItem onClick={handleShowGroupNameModal}>
            <Typography textAlign="center">그룹이름수정</Typography>
          </MenuItem>
        </Menu>
      </Box>
      <PostImage />

      <AddMembersModal
        open={showGroupmembersModal}
        handleClose={handleGroupmemebrsModalClose}
        inputValue={members}
        setInputValue={setMembers}
        handleCreate={handleNameString}
      />
      <UploadImageModal
        open={showUploadImageModal}
        handleClose={handleUploadImageModalClose}
        setPercent={setPercent}
      />
      <GroupNameModal
        open={showGroupNameModal}
        handleClose={handleGroupNameModalClose}
        action="changeName"
        guid={guid}
      />
    </StyleContainer>
  );
};

export default ShareGuest;

const StyleContainer = styled.div`
  padding-top: 80px;
  background-color: #f7f1f0;
  max-width: 100vw;
`;
