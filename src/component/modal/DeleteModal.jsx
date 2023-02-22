import React, { useCallback } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { db, storage } from "../../firebase";
import { ref, remove } from "firebase/database";
import { ref as refStorage, listAll, deleteObject } from "firebase/storage";
import { imgSrcTranslator } from "../../utils/imgSrcTranslator";
import { useRecoilValue } from "recoil";
import { groupImageState } from "../../store/groupImage";

export const DeleteModal = ({ open, handleClose, groupId, action }) => {
  const { imageId, downloadUrl } = useRecoilValue(groupImageState);

  const title =
    action === "groupsAll"
      ? "정말로 이 앨범을 삭제하시겠습니까?"
      : "정말로 이 이미지를 삭제하시겠습니까?";

  const closeModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const deleteToData = useCallback(
    (realtimeRef, storageRef) => {
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
    },
    [action]
  );

  const groupsAllDelete = useCallback(() => {
    deleteToData(
      ref(db, "groups/" + groupId),
      refStorage(storage, "postImages/" + groupId)
    );
    handleClose();
  }, [deleteToData, groupId, handleClose]);

  const thisImageOnlyDelete = useCallback(() => {
    const imgSrc = imgSrcTranslator(downloadUrl);
    deleteToData(
      ref(db, "groups/" + groupId + "/postImages/" + imageId),
      refStorage(storage, imgSrc)
    );
    handleClose();
  }, [deleteToData, downloadUrl, groupId, handleClose, imageId]);

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
