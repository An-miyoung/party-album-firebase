import React from "react";
import styled from "styled-components";
import Header from "../component/Header";
import CreateGroup from "../component/CreateGroup";

const GroupsList = () => {
  const groupNames = [
    "오케이 골프",
    "창덕맘 모임",
    "유교과 대왕대비",
    "AAAA",
    "BBBBBB",
    "CCC",
    "DDD",
    "EEE",
    "FFF",
    "GGG",
  ];
  return (
    <StyleContainer>
      <Header />
      <CreateGroup />
      <StyleCardContainer>
        {groupNames.length > 0 &&
          groupNames.map((item, idx) => (
            <StyleCardItem key={`${item}-${idx}`}>{item}</StyleCardItem>
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
`;

const StyleCardItem = styled.div`
  min-height: 20vh;
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
