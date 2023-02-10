import React, { useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import styled from "styled-components";
import Header from "../component/Header";
import CreateGroup from "../component/CreateGroup";
import { ROUTE_UTILS } from "../routes";
import { useRecoilState } from "recoil";
import { groupDataState } from "../store/groupData";

const GroupsList = () => {
  const [groupData, setGroupData] = useRecoilState(groupDataState);
  const groupNameRef = ref(db, "groups/");

  const readGroupData = useCallback(() => {
    onValue(groupNameRef, (snapshot) => {
      setGroupData([]);
      const data = Object.values(snapshot.val());
      data.map((item) => setGroupData((prev) => [...prev, item]));
    });
  }, [groupNameRef, setGroupData]);

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
          groupData.map(({ groupId, groupName, members }, idx) =>
            members !== undefined && members !== null && members.length > 0 ? (
              <StyleCardItem key={`${groupId}-${idx}`}>
                <Link
                  to={ROUTE_UTILS.SHOW_POST_DETAIL(groupId)}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {groupName}
                </Link>
              </StyleCardItem>
            ) : (
              <StyleCardItem key={`${groupId}-${idx}`}>
                <Link
                  to={ROUTE_UTILS.ADD_MEMBERS(groupId)}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  {groupName}
                </Link>
              </StyleCardItem>
            )
          )}
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
  max-width: 70vw;
`;

const StyleCardItem = styled.div`
  min-width: 30vw;
  background-color: #dd8ea4;
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
  background-color: #f7f1f0;
`;
