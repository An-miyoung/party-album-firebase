import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./routes.js";
import AddMembers from "./pages/AddMembers";
import Join from "./pages/Join";
import GroupsList from "./pages/GroupsList";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.JOIN} />} />
        <Route path={ROUTES.JOIN} element={<Join />} />
        <Route path={ROUTES.SHOW_POST_DETAIL} element={<Post />} />
        <Route path={ROUTES.ADD_MEMBERS} element={<AddMembers />} />
        <Route path={ROUTES.GROUPS_LIST} element={<GroupsList />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
