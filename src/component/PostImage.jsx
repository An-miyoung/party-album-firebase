import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { onValue, ref } from "firebase/database";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRecoilState, useRecoilValue } from "recoil";
import { groupIdState } from "../store/groupId";
import { groupImageState } from "../store/groupImage";
import { DeleteModal } from "./modal/DeleteModal";

const PostImages = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const groupId = useRecoilValue(groupIdState);
  const [imgData, setImgData] = useState([]);

  useEffect(() => {
    setImgData([]);

    const getImages = () => {
      const imageRef = ref(db, `groups/${groupId}/postImages/`);
      onValue(imageRef, (snapshot) => {
        const data =
          snapshot.val() !== undefined &&
          snapshot.val() !== null &&
          Object.values(snapshot.val());
        setImgData(data ? Object.values(snapshot.val()) : []);
      });
    };

    getImages();
    return () => {
      setImgData([]);
    };
  }, [groupId]);

  return (
    <>
      <ImageList sx={{ paddingLeft: "5vw" }}>
        {imgData.map((item, idx) => (
          <ImageListItem
            key={`${item}-${idx}`}
            sx={{ width: "40vw", position: "relative" }}
          >
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />

            <DeleteIcon
              style={{
                color: "white",
                position: "absolute",
                bottom: "7vh",
                right: 0,
              }}
            />

            <ImageListItemBar
              title={item.title}
              key={`${item}-${idx}`}
              position="below"
            />
          </ImageListItem>
        ))}
      </ImageList>

      <>{console.log(imgData)}</>
    </>

    // <>
    //   {isMobile ? (
    //     <ImageList sx={{ paddingLeft: "5vw" }}>
    //       {imgData.map((item, idx) => (
    //         <ImageListItem
    //           key={`${item}-${idx}`}
    //           sx={{ width: "40vw", position: "relative" }}
    //         >
    //           <img
    //             src={`${item.img}?w=248&fit=crop&auto=format`}
    //             srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
    //             alt={item.title}
    //             loading="lazy"
    //           />

    //           <DeleteIcon
    //             style={{
    //               color: "white",
    //               position: "absolute",
    //               bottom: "7vh",
    //               right: 0,
    //             }}
    //             onClick={(e) => handleDelete(item.img, item.imageId)}
    //           />

    //           <ImageListItemBar
    //             title={item.title}
    //             key={`${item}-${idx}`}
    //             position="below"
    //           />
    //         </ImageListItem>
    //       ))}
    //     </ImageList>
    //   ) : (
    //     <ImageList
    //       variant="masonry"
    //       cols={3}
    //       gap={8}
    //       sx={{
    //         paddingLeft: "10vw",
    //         paddingRight: "10vw",
    //         marginBottom: "8vh",
    //         height: "100vh",
    //       }}
    //     >
    //       {imgData.map((item, idx) => (
    //         <ImageListItem
    //           key={`${item.timestamp}-${idx}`}
    //           sx={{ height: "100%", position: "relative" }}
    //         >
    //           <img
    //             src={`${item.img}?w=248&fit=crop&auto=format`}
    //             srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
    //             alt={item.title}
    //             loading="lazy"
    //           />
    //           <DeleteIcon
    //             style={{
    //               color: "white",
    //               position: "absolute",
    //               bottom: "7vh",
    //               right: 0,
    //               cursor: "pointer",
    //             }}
    //             onClick={() => {
    //               handleDelete(item.img);
    //             }}
    //           />
    //           <ImageListItemBar
    //             position="below"
    //             key={`${item}-${idx}`}
    //             title={item.title}
    //           />
    //         </ImageListItem>
    //       ))}
    //     </ImageList>
    //   )}
    //   <DeleteModal
    //     open={showDeleteModal}
    //     handleClose={handleShowDeleteModal}
    //     groupId
    //     imageId={imageId ? imageId : ""}
    //     downloadUrl={pickedImgSrc ? pickedImgSrc : ""}
    //     action="thisImageOnly"
    //   />
    //   <>{console.log(imgData)}</>
    // </>
  );
};

export default PostImages;
