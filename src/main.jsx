import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./components/login";
import GroupChatCreator from "./components/group_chat_creator";
import Registration from "./components/registration";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/groupchat" element={<GroupChatCreator />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);

// remaking the messenger:
// [_]
// [_] redo the css
// [_]
// [_]
// [_]
// [_]
// [_]
// [_]
// [_]
// [_]
// [_]
