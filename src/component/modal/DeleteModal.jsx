import React, { useCallback } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { db, storage } from "../../firebase";
import { ref, remove } from "firebase/database";
import { ref as refStorage, listAll, deleteObject } from "firebase/storage";
import { imgSrcTranslator } from "../../utils/imgSrcTranslator";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../store/user";
import { groupImageState } from "../../store/groupImage";

const deleteToData = (action, realtimeRef, storageRef) => {
  remove(realtimeRef)
    .then(() => {
      action === "groupsAll" &&
        // 앨범전체를 삭제할 경우, storage 내부를 재귀하며 이미지 파일 삭제
        listAll(storageRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              deleteObject(itemRef);
            });
          })
          .catch((error) => {
            console.log("storage 에서 삭제 실패", error);
          });
      // 특정 이미지 하나를 지울때
      action === "thisImageOnly" &&
        deleteObject(storageRef)
          .then(() => {})
          .catch((error) => {
            console.log("storage 에서 삭제 실패", error);
          });
    })
    .catch((error) => {
      console.log("realTime database 삭제 실패 : ", error);
    });
};

export const DeleteModal = ({ open, handleClose, groupId, action }) => {
  const { userId } = useRecoilValue(currentUserState);
  const { imageId, downloadUrl } = useRecoilValue(groupImageState);

  const title =
    action === "groupsAll"
      ? "정말로 이 앨범을 삭제하시겠습니까?"
      : "정말로 이 이미지를 삭제하시겠습니까?";

  const closeModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const groupsAllDelete = useCallback(() => {
    deleteToData(
      action,
      ref(db, `groups/${userId}/${groupId}`),
      refStorage(storage, `postImages/${userId}/${groupId}`)
    );
    handleClose();
  }, [action, groupId, handleClose, userId]);

  const thisImageOnlyDelete = useCallback(() => {
    const imgSrc = imgSrcTranslator(downloadUrl);
    deleteToData(
      action,
      ref(db, `groups/${userId}/${groupId}/postImages/${imageId}`),
      refStorage(storage, imgSrc)
    );
    handleClose();
  }, [action, downloadUrl, groupId, handleClose, imageId, userId]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        <Button
          onClick={
            action === "groupsAll" ? groupsAllDelete : thisImageOnlyDelete
          }
        >
          삭제
        </Button>
      </DialogActions>
    </Dialog>
  );
};
