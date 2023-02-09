import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import styled from "styled-components";
import Header from "../component/Header";
import CreateGroup from "../component/CreateGroup";
import { ROUTE_UTILS } from "../routes";

const GroupsList = () => {
  const [groupData, setGroupData] = useState([]);
  const groupNameRef = ref(db, "groups/");

  const readGroupData = useCallback(() => {
    onValue(groupNameRef, (snapshot) => {
      const data = Object.values(snapshot.val());
      data.map((item) => setGroupData((prev) => [...prev, item]));
      console.log(data);
    });
  }, [groupNameRef]);

  useEffect(() => {
    readGroupData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StyleContainer>
      <Header />
      <CreateGroup />
      <StyleCardContainer>
        {console.log(JSON.stringify(groupData))}
        {groupData.length > 0 &&
          groupData.map(({ groupId, groupName }, idx) => (
            <StyleCardItem key={`${groupId}-${idx}`}>
              <Link
                to={ROUTE_UTILS.SHOW_POST_DETAIL(groupId)}
                style={{ textDecoration: "none", color: "#9c27b0" }}
              >
                {groupName}
              </Link>
            </StyleCardItem>
          ))}
      </StyleCardContainer>
    </StyleContainer>
  );
};

export default GroupsList;

const StyleCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15vw;
  padding-left: 8vw;
  padding-top: 10vh;
  padding-bottom: 25px;
`;

const StyleCardItem = styled.div`
  min-width: 30vw;
  background-color: #ffffcc;
  filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.25));
  border-radius: 8px;
  padding: 20px;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: 0.1px;
  overflow-wrap: break-word;
  word-break: keep-all;
  box-sizing: border-box;
  cursor: pointer;

  @media screen and (max-width: 500px) {
    font-size: 4vw;
    min-height: 80px;
  }
`;

const StyleContainer = styled.div`
  padding-top: 80px;
  padding-left: 5vw;
  max-width: 70vw;
  height: 100vh;
`;
