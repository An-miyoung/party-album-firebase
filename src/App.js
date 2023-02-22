import React, { useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./routes.js";
import Join from "./pages/Join";
import Login from "./pages/Login";
import GroupsList from "./pages/GroupsList";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
import TestJoin from "./pages/TestJoin";
// import { useRecoilState } from "recoil";
// import { currentUserState } from "./store/user";

function App() {
  // const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (!!user) {
  //       setCurrentUser(user);
  //     } else {
  //       console.log("logout");
  //       setCurrentUser({});
  //     }
  //   });
  //   return () => unsubscribe();
  // }, [setCurrentUser]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.JOIN} />} />
        <Route path="/testJoin" element={<TestJoin />} />
        <Route path={ROUTES.JOIN} element={<Join />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.SHOW_POST_DETAIL} element={<Post />} />
        <Route path={ROUTES.GROUPS_LIST} element={<GroupsList />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
