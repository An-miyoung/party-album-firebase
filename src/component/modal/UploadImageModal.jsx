import React, { useCallback, useState } from "react";
import { storage } from "../../firebase";
import {
  ref as refStorage,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { serverTimestamp } from "firebase/database";
import { uid } from "uid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { groupIdState } from "../../store/groupId";

const UploadImageModal = ({ open, handleClose }) => {
  const groupId = useRecoilValue(groupIdState);
  const [uploadedImage, setUploadedImage] = useState("");

  const closeModal = useCallback(() => {
    handleClose();
    setUploadedImage("");
  }, [handleClose]);

  const handleChange = useCallback((e) => {
    const selectedImageFile = e.target.files[0];
    if (!selectedImageFile) return;
    setUploadedImage(selectedImageFile);

    console.log("사진을 선택했음");
  }, []);

  const handleInputComplete = useCallback(async () => {
    const storageRef = refStorage(
      storage,
      `postImages/${groupId}/${uid()}.${uploadedImage.name.split(".").pop()}`
    );

    const uploadTask = await uploadBytes(storageRef, uploadedImage);
    const downloadUrl = await getDownloadURL(uploadTask.ref);
    setUploadedImage(downloadUrl);
    console.log("사진올렸음");
    handleClose();
  }, [groupId, handleClose, uploadedImage]);

  const createImageMessage = useCallback(
    (fileUrl) => ({
      timestamp: serverTimestamp(),
      user: {
        // id: user.currentUser.uid,
        // name: user.currentUser.displayName,
        // avatar: user.currentUser.photoURL,
        name: "미영",
      },
      image: fileUrl,
    }),
    []
  );

  return (
    <>
      <Dialog open={open} onClose={closeModal}>
        <DialogTitle>사진을 선택해 주세요</DialogTitle>
        <DialogContent>
          <Input
            type="file"
            inputProps={{
              accept: "image/jpg, image/jpeg, image/gif, image/png ",
            }}
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>취소</Button>
          <Button onClick={handleInputComplete}>사진올리기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UploadImageModal;
