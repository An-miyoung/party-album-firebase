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
import { useRecoilState } from "recoil";
import { currentUserState } from "./store/user";
import ShareGuest from "./pages/ShareGuest";

function App() {
  const [user, setUser] = useRecoilState(currentUserState);
  const isCurrentUser = user.userId !== null;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!!user) {
        setUser({
          userId: user.uid,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        console.log("logout");
        setUser({
          userId: null,
          displayName: "",
          photoURL: "",
        });
      }
    });
    return () => unsubscribe();
  }, [isCurrentUser, setUser]);

  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isCurrentUser ? (
              <Navigate to={ROUTES.GROUPS_LIST} />
            ) : (
              <Navigate to={ROUTES.LOGIN} />
            )
          }
        />
        <Route
          path={ROUTES.JOIN}
          element={
            isCurrentUser ? <Navigate to={ROUTES.GROUPS_LIST} /> : <Join />
          }
        />
        <Route
          path={ROUTES.LOGIN}
          element={
            isCurrentUser ? <Navigate to={ROUTES.GROUPS_LIST} /> : <Login />
          }
        />
        <Route path={ROUTES.SHARE_GUEST} element={<ShareGuest />} />
        <Route path={ROUTES.SHOW_POST_DETAIL} element={<Post />} />
        <Route
          path={ROUTES.GROUPS_LIST}
          element={
            isCurrentUser ? <GroupsList /> : <Navigate to={ROUTES.LOGIN} />
          }
        />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
