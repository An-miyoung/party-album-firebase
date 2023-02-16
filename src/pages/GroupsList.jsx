import React from "react";
import { useRecoilValue } from "recoil";
import { groupDataState } from "../store/groupData";
import useGroupData from "../hooks/useGroupData";
import GroupListContainer from "../component/GroupListContainer";
import Header from "../component/Header";
import CreateGroup from "../component/CreateGroup";
import { StyleContainer } from "../component/GroupListContainer";

const GroupList = () => {
  useGroupData();
  const groupData = useRecoilValue(groupDataState);

  return (
    <>
      {groupData !== undefined && groupData !== null && groupData.length > 0 ? (
        <GroupListContainer />
      ) : (
        <StyleContainer>
          <Header />
          <CreateGroup />
        </StyleContainer>
      )}
    </>
  );
};

export default GroupList;

// import React, { useState, useCallback } from "react";
// import { Link } from "react-router-dom";
// import { ref, remove } from "firebase/database";
// import { db } from "../firebase";
// import styled from "styled-components";
// import Header from "../component/Header";
// import CreateGroup from "../component/CreateGroup";
// import { ROUTE_UTILS } from "../routes";
// import DeleteIcon from "@mui/icons-material/Delete";
// import useGroupData from "../hooks/useGroupData";
// import { DeleteModal } from "../component/modal/DeleteModal";
// import { useRecoilState, useRecoilValue } from "recoil";
// import { groupIdState } from "../store/groupId";
// import { groupDataState } from "../store/groupData";

// const GroupsList = () => {
//   useGroupData();
//   const groupData = useRecoilValue(groupDataState);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [confirmDelete, setConfirmDelete] = useState(false);

//   const [pickedGroupId, setPickedGroupId] = useRecoilState(groupIdState);

//   const handleDelete = (groupId) => {
//     setPickedGroupId(groupId);
//     setShowDeleteModal(true);
//   };

//   const handleShowDeleteModal = useCallback(() => {
//     setShowDeleteModal(false);
//   }, []);

//   const deleteToData = useCallback(() => {
//     const groupsRef = ref(db, "groups/" + pickedGroupId);

//     confirmDelete &&
//       remove(groupsRef).then(() => {
//         setConfirmDelete(false);
//       });
//   }, [confirmDelete, pickedGroupId]);

//   deleteToData();

//   return (
//     <StyleContainer>
//       <Header />
//       <CreateGroup />
//       <StyleCardContainer>
//         {groupData?.length > 0 &&
//           groupData.map(({ groupId, groupName, members }, idx) => (
//             <StyleCardItem key={`${groupId}-${idx}`}>
//               <Link
//                 to={ROUTE_UTILS.SHOW_POST_DETAIL(groupId)}
//                 style={{ textDecoration: "none", color: "white" }}
//               >
//                 {groupName}
//               </Link>
//               <DeleteIcon
//                 style={{ color: "white", verticalAlign: "sub" }}
//                 onClick={(e) => {
//                   handleDelete(groupId);
//                 }}
//               />
//             </StyleCardItem>
//           ))}
//       </StyleCardContainer>
//       <DeleteModal
//         open={showDeleteModal}
//         handleClose={handleShowDeleteModal}
//         handleConfirm={setConfirmDelete}
//       />
//     </StyleContainer>
//   );
// };

// export default GroupsList;

// const StyleCardContainer = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   grid-gap: 15vw;
//   padding-left: 8vw;
//   padding-top: 10vh;
//   padding-bottom: 25px;
//   max-width: 70vw;
// `;

// const StyleCardItem = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 3vh;
//   min-width: 30vw;
//   background-color: #dd8ea4;
//   filter: drop-shadow(0px 4px 4px rgb(0, 0, 0, 0.25));
//   border-radius: 8px;
//   padding: 20px;
//   font-weight: 400;
//   font-size: 20px;
//   line-height: 20px;
//   letter-spacing: 0.1px;
//   overflow-wrap: break-word;
//   word-break: keep-all;
//   box-sizing: border-box;
//   cursor: pointer;

//   @media screen and (max-width: 500px) {
//     font-size: 4vw;
//     min-height: 80px;
//     flex-direction: column;
//     justify-content: flex-start;
//   }
// `;

// const StyleContainer = styled.div`
//   padding-top: 80px;
//   padding-left: 5vw;
//   background-color: #f7f1f0;
// `;
