import React from "react";
import { useParams } from "react-router-dom";

const Post = () => {
  const { guid } = useParams();
  return <div>Post {`${guid}`} </div>;
};

export default Post;
