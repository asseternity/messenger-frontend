import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./components/login";
import GroupChatCreator from "./components/group_chat_creator";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/groupchat" element={<GroupChatCreator />} />
      </Routes>
    </HashRouter>
  </StrictMode>
);

// groupchat: fix infinite loops in both ChatWindow and GroupChatWindow
// groupchat: fix not re-rendering after clicking on another groupchat
// registration
// css
// deploy
