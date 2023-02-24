import React, { useCallback, useState } from "react";
import { db, storage } from "../../firebase";
import { ref, serverTimestamp, update } from "firebase/database";
import {
  ref as refStorage,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { uid } from "uid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Typography,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { currentUserState } from "../../store/user";
import { groupIdState } from "../../store/groupId";

function ImageModal({ open, handleClose, setPercent }) {
  const { userId } = useRecoilValue(currentUserState);
  const groupId = useRecoilValue(groupIdState);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const closeModal = useCallback(() => {
    handleClose();
    setFile("");
  }, [handleClose]);

  const onChangeTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const onChangeAddFile = useCallback((e) => {
    const addedFile = e.target.files[0];
    if (addedFile) {
      setFile(addedFile);
    }
  }, []);

  const createImageMessage = useCallback(
    (imageId, fileUrl) => ({
      timestamp: serverTimestamp(),
      imageId,
      img: fileUrl,
      title,
    }),
    [title]
  );

  const uploadFile = useCallback(() => {
    // pop으로 마지막 요소인 확장자를 제거하고 이름만으로 uuid 를 만든다.
    const filePath = `postImages/${userId}/${groupId}/${uid()}.${file.name
      .split(".")
      .pop()}`;

    // firebase storage 에 등록
    const uploadTask = uploadBytesResumable(
      refStorage(storage, filePath),
      file
    );
    // 업로드진행상태를 표시해준다.
    const unsubscribe = uploadTask.on(
      "state_changed",
      (snap) => {
        const percentUploaded = Math.round(
          (snap.bytesTransferred / snap.totalBytes) * 100
        );
        setPercent(percentUploaded);
      },
      (error) => {
        console.error(error);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // firebase db로 저장한다.
          const updates = {};
          const imageId = uid();
          updates[`groups/${userId}/${groupId}/postImages/${imageId}`] =
            createImageMessage(imageId, downloadUrl);
          await update(ref(db), updates);

          unsubscribe();
        } catch (error) {
          console.error(error);
          unsubscribe();
        }
      }
    );
  }, [createImageMessage, file, groupId, setPercent, userId]);

  const handleSendFile = useCallback(() => {
    uploadFile();
    handleClose();
    setFile(null);
  }, [handleClose, uploadFile]);

  return (
    <>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>사진을 선택해 주세요.</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            inputProps={{
              accept: "image/jpg, image/jpeg, image/gif, image/png ",
            }}
            fullWidth
            onChange={onChangeAddFile}
          />
          <div style={{ height: "3vh" }} />
          <Typography> 사진에 대한 설명 :</Typography>
          <Input type="text" fullWidth onChange={onChangeTitle} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>취소</Button>
          <Button onClick={handleSendFile}>사진올리기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ImageModal;
