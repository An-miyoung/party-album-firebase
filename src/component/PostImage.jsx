import React from "react";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import GreenPasta from "../static/image/green-pasta.jpeg";
import WhitePasta from "../static/image/white-pasta.jpeg";
import Gnoggi from "../static/image/gnoggi.jpeg";
import Signin from "../static/image/bg_signin.png";

const Post = () => {
  const isMobile = useMediaQuery("(max-width: 600px)");
  const itemData = [
    {
      img: Signin,
      title: "카페 한구석 멋진 풍경",
    },
    {
      img: WhitePasta,
      title: "트러풀이 들어 간 파스타",
    },
    {
      img: GreenPasta,
      title: "캐비어가 들어 간 생면 파스타",
    },
    {
      img: Gnoggi,
      title: "엄지척 뇨끼~~ 진짜 대박 맛있음",
    },
  ];

  return (
    <>
      {isMobile ? (
        <>
          <ImageList sx={{ paddingLeft: "5vw" }}>
            {itemData.map((item) => (
              <>
                <ImageListItem key={item.timestamp} sx={{ width: "40vw" }}>
                  <img
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar title={item.title} position="below" />
                </ImageListItem>
              </>
            ))}
          </ImageList>
        </>
      ) : (
        <>
          <ImageList
            variant="masonry"
            cols={3}
            gap={8}
            sx={{
              paddingLeft: "10vw",
              paddingRight: "10vw",
              marginBottom: "8vh",
              height: "100vh",
            }}
          >
            {itemData.map((item) => (
              <>
                <ImageListItem key={item.img} sx={{ height: "100%" }}>
                  <img
                    src={`${item.img}?w=248&fit=crop&auto=format`}
                    srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                    alt={item.title}
                    loading="lazy"
                  />
                  <ImageListItemBar position="below" title={item.title} />
                </ImageListItem>
              </>
            ))}
          </ImageList>
        </>
      )}
    </>
  );
};

export default Post;
