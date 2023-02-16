import React, { useCallback, useState } from "react";
import { db, storage } from "../../firebase";
import {
  getDatabase,
  push,
  ref,
  serverTimestamp,
  set,
} from "firebase/database";
import {
  ref as refStorage,
  uploadBytes,
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
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { groupIdState } from "../../store/groupId";

function ImageModal({ open, handleClose, setPercent }) {
  const groupId = useRecoilValue(groupIdState);
  const [file, setFile] = useState(null);

  const closeModal = useCallback(() => {
    handleClose();
    setFile("");
  }, [handleClose]);

  const onChangeAddFile = useCallback((e) => {
    const addedFile = e.target.files[0];
    if (addedFile) {
      setFile(addedFile);
    }
  }, []);

  const createImageMessage = useCallback(
    (fileUrl) => ({
      timestamp: serverTimestamp(),
      user: {
        id: groupId,
        // id: user.currentUser.uid,
        // name: user.currentUser.displayName,
        // avatar: user.currentUser.photoURL,
      },
      img: fileUrl,
      title: "올린 사진",
    }),
    [groupId]
  );

  const uploadFile = useCallback(() => {
    // pop으로 마지막 요소인 확장자를 제거하고 이름만으로 uuid 를 만든다.
    const filePath = `postImages/${groupId}/${uid()}.${file.name
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
          await set(
            push(ref(db, `groups/${groupId}/postImages/`)),
            createImageMessage(downloadUrl)
          );
          unsubscribe();
        } catch (error) {
          console.error(error);
          unsubscribe();
        }
      }
    );
  }, [createImageMessage, file, groupId, setPercent]);

  const handleSendFile = useCallback(() => {
    uploadFile();
    handleClose();
    setFile(null);
  }, [handleClose, uploadFile]);

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
            onChange={onChangeAddFile}
          />
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

// const UploadImageModal = ({ open, handleClose }) => {
//   const groupId = useRecoilValue(groupIdState);
//   const [uploadedImage, setUploadedImage] = useState("");

//   const closeModal = useCallback(() => {
//     handleClose();
//     setUploadedImage("");
//   }, [handleClose]);

//   const handleChange = useCallback((e) => {
//     const selectedImageFile = e.target.files[0];
//     if (!selectedImageFile) return;
//     setUploadedImage(selectedImageFile);

//     console.log("사진을 선택했음");
//   }, []);

//   const handleInputComplete = useCallback(async () => {
//     const storageRef = refStorage(
//       storage,
//       `postImages/${groupId}/${uid()}.${uploadedImage.name.split(".").pop()}`
//     );

//     const uploadTask = await uploadBytes(storageRef, uploadedImage);
//     const downloadUrl = await getDownloadURL(uploadTask.ref);
//     setUploadedImage(downloadUrl);
//     console.log("사진올렸음");
//     handleClose();
//   }, [groupId, handleClose, uploadedImage]);

//   const createImageMessage = useCallback(
//     (fileUrl) => ({
//       timestamp: serverTimestamp(),
//       user: {
//         // id: user.currentUser.uid,
//         // name: user.currentUser.displayName,
//         // avatar: user.currentUser.photoURL,
//         name: "미영",
//       },
//       image: fileUrl,
//     }),
//     []
//   );

//   return (
//     <>
//       <Dialog open={open} onClose={closeModal}>
//         <DialogTitle>사진을 선택해 주세요</DialogTitle>
//         <DialogContent>
//           <Input
//             type="file"
//             inputProps={{
//               accept: "image/jpg, image/jpeg, image/gif, image/png ",
//             }}
//             fullWidth
//             onChange={handleChange}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={closeModal}>취소</Button>
//           <Button onClick={handleInputComplete}>사진올리기</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// };

// export default UploadImageModal;
