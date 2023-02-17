import React, { useCallback } from "react";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { db, storage } from "../../firebase";
import { ref, remove } from "firebase/database";
import { ref as refStorage, listAll, deleteObject } from "firebase/storage";

export const DeleteModal = ({ open, handleClose, groupId }) => {
  const closeModal = useCallback(() => {
    handleClose();
  }, [handleClose]);

  const deleteToData = useCallback(() => {
    const groupsRef = ref(db, "groups/" + groupId);
    const deleteRef = refStorage(storage, "postImages/" + groupId);

    remove(groupsRef)
      .then(() => {
        console.log("realtime삭제");

        listAll(deleteRef)
          .then((res) => {
            res.items.forEach((itemRef) => {
              deleteObject(itemRef)
                .then(() => {
                  console.log("storge 에서 삭제");
                })
                .catch((error) => {
                  console.log("storage 삭제 실패 : ", error);
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

  const groupDataDelete = useCallback(() => {
    deleteToData();
    handleClose();
  }, [deleteToData, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{`정말로 앨범을 삭제하시겠습니까?`}</DialogTitle>
      <DialogActions>
        <Button onClick={closeModal}>취소</Button>
        <Button onClick={groupDataDelete}>삭제</Button>
      </DialogActions>
    </Dialog>
  );
};
