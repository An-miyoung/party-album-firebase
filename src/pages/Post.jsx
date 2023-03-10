import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, Link } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { db } from "../firebase";
import {
  child,
  get,
  ref,
  update,
  set,
  serverTimestamp,
} from "firebase/database";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import useMediaQuery from "@mui/material/useMediaQuery";
import { ROUTE_UTILS } from "../routes";
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

const Post = () => {
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

  // ??? action ??? ?????? ???????????? state
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);
  const [showGroupmembersModal, setShowGroupMembersModal] = useState(false);
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  // addMember ??? ????????? ??????
  const [members, setMembers] = useState([]);
  // uploadImage ??? ????????? ??????
  const [percent, setPercent] = useState(null);

  // anchorRef
  const handleOpenMenu = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // ????????????
  const handleSharedGroup = () => {
    set(ref(db, `shared/${guid}`), {
      timestamp: serverTimestamp(),
      groupId: guid,
      groupName,
      groupMembers,
      postImages: pickedGroupData[0].postImages,
    });
  };

  // ?????? ??????
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
  // ?????? ??????
  const handleUploadImageModalClose = useCallback(() => {
    setShowUploadImageModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handelShowUploadImageModal = useCallback(() => {
    setShowUploadImageModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);
  // ????????? ??????
  const handleGroupNameModalClose = useCallback(() => {
    setShowGroupNameModal(false);
    handleCloseMenu();
  }, [handleCloseMenu]);
  const handleShowGroupNameModal = useCallback(() => {
    setShowGroupNameModal(true);
    handleCloseMenu();
  }, [handleCloseMenu]);

  //  member ??? ??? ????????? ????????? ????????? ??????????????? ??? ??? ????????? modal ????????? ??? ??? ??????.
  // setValue ??? ???????????? ????????? useEffect ??? ???????????? ?????? value ??? ?????? ?????? ??????????????? ???????????? ???????????????.
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
          <MenuItem onClick={handleSharedGroup}>
            <Typography textAlign="center">
              <Link
                to={ROUTE_UTILS.SHARE_GUEST(guid)}
                style={{ textDecoration: "none", color: "black" }}
              >
                ????????????
              </Link>
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleShowGroupMembersModal}>
            <Typography textAlign="center">????????????</Typography>
          </MenuItem>
          <MenuItem onClick={handelShowUploadImageModal}>
            <Typography textAlign="center">????????????</Typography>
          </MenuItem>
          <MenuItem onClick={handleShowGroupNameModal}>
            <Typography textAlign="center">??????????????????</Typography>
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

export default Post;

const StyleContainer = styled.div`
  padding-top: 80px;
  background-color: #f7f1f0;
  max-width: 100vw;
`;
