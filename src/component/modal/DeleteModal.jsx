import React, { useCallback } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { db, storage } from "../../firebase";
import { ref, remove } from "firebase/database";
import { ref as refStorage, listAll, deleteObject } from "firebase/storage";
import { imgSrcTranslator } from "../../utils/imgSrcTranslator";
import { useRecoilValue } from "recoil";
import { groupImageState } from "../../store/groupImage";

export const DeleteModal = ({ open, handleClose, groupId, action }) => {
  const groupImage = useRecoilValue(groupImageState);

  const title =
    action === "groupsAll"
      ? "정말로 이 앨범을 삭제하시겠습니까?"
      : "정말로 이 이미지를 삭제하시겠습니까?";

  const closeModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const deleteToData = useCallback(() => {
    const groupsRef = ref(db, "groups/" + groupId);
    const deleteRef = refStorage(storage, "postImages/" + groupId);

    remove(groupsRef)
      .then(() => {
        // storage 내부를 재귀하며 이미지 파일 삭제
        listAll(deleteRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              deleteObject(itemRef)
                .then(() => {})
                .catch((error) => {
                  console.log("storage  삭제 실패 : ", error);
                });
            });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("realTime database 삭제 실패 : ", error);
      });
  }, [groupId]);

  const groupsAllDelete = useCallback(() => {
    deleteToData();
    handleClose();
  }, [deleteToData, handleClose]);

  const thisImageOnlyDelete = useCallback(() => {
    const imageRef = ref(
      db,
      "groups/" + groupId + "/postImages/" + groupImage.imageId
    );
    const imgSrc = imgSrcTranslator(groupImage.downloadUrl);
    const deleteRef = refStorage(storage, imgSrc);

    remove(imageRef)
      .then(() => {
        console.log("delete");

        deleteObject(deleteRef)
          .then(() => {})
          .catch((error) => {
            console.log("storage 에서 ", imgSrc, " 삭제 실패", error);
          });
      })
      .catch((error) => {
        console.log("realtime 삭제 실패", error);
      });
    handleClose();
  }, [groupId, groupImage.downloadUrl, groupImage.imageId, handleClose]);

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
