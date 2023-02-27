import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { db } from "../firebase";
import { child, get, ref, update } from "firebase/database";
import { Box, Button, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { groupDataPicker } from "../store/groupData";
import { groupMembersState } from "../store/groupMembers";
import Header from "../component/Header";
import PostImage from "../component/PostImage";
import { currentUserState } from "../store/user";
import { groupIdState } from "../store/groupId";
import { groupNameState } from "../store/groupName";
import { sharedDataState } from "../store/sharedGroup";

const ShareGuest = () => {
  const { guid } = useParams();
  const setGroupId = useSetRecoilState(groupIdState);
  const [groupName, setGroupName] = useRecoilState(groupNameState);
  const [groupMembers, setGroupMembers] = useRecoilState(groupMembersState);
  const isMobile = useMediaQuery("(max-width: 600px)");

  const [sharedData, setSharedData] = useRecoilState(sharedDataState);

  // const pickedGroupData = useRecoilValue(groupDataPicker(guid));

  // const readRecoilState = useCallback(() => {
  //   const { groupName, groupMembers } = pickedGroupData[0];
  //   setGroupId(guid);
  //   setGroupName(groupName);
  //   setGroupMembers(groupMembers);
  // }, [guid, pickedGroupData, setGroupId, setGroupMembers, setGroupName]);

  const fetchPostData = useCallback(() => {
    const dbRef = ref(db);
    get(child(dbRef, `shared/${guid}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const { groupId, groupName, groupMembers, postImages } =
            snapshot.val();
          setSharedData({
            groupId,
            groupName,
            groupMembers,
            postImages: postImages,
          });
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [guid, setSharedData]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const groupMembersString = sharedData.groupMembers?.join(",") || null;
  const postImages = Object.values(sharedData.postImages);

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
        <Button variant="outlined" sx={{ cursor: "none" }}>
          <Typography component="div" variant="h6">
            {sharedData.groupName}
          </Typography>
        </Button>
        <div style={{ width: "5px" }} />
        {isMobile ? (
          <>
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
            <ImageList sx={{ paddingLeft: "5vw" }}>
              {postImages.map((item, idx) => (
                <ImageListItem
                  key={`${item}-${idx}`}
                  sx={{ width: "40vw", position: "relative" }}
                >
                  <img
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />

                  <ImageListItemBar
                    title={item.title}
                    key={`${item}-${idx}`}
                    position="below"
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        ) : (
          <>
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
              {postImages.map((item, idx) => (
                <ImageListItem
                  key={`${item.timestamp}-${idx}`}
                  sx={{ height: "100%", position: "relative" }}
                >
                  <img
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />

                  <ImageListItemBar
                    position="below"
                    key={`${item}-${idx}`}
                    title={item.title}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          </>
        )}
      </Box>
    </StyleContainer>
  );
};

export default ShareGuest;

const StyleContainer = styled.div`
  padding-top: 80px;
  background-color: #f7f1f0;
  max-width: 100vw;
`;
