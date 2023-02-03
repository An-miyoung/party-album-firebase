import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";
import { ROUTES } from "./routes.js";
import AddMembers from "./pages/AddMembers";
import Join from "./pages/Join";
import GroupsList from "./pages/GroupsList";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to={ROUTES.JOIN} />} />
        <Route path={ROUTES.JOIN} element={<Join />} />
        <Route path={ROUTES.ADD_MEMBERS} element={<AddMembers />} />
        <Route path={ROUTES.GROUPS_LIST} element={<GroupsList />} />
      </Routes>
    </div>
  );
}

export default App;
