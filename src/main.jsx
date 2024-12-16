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

// requirements:
// [v] Users must sign in to see anything except the sign-in page.
// [v] Users should be able to sign in using your chosen authentication method.
// [_] Users can send follow requests to other users.
// [_] Users can create posts (text only).
// [_] Users can like posts.
// [_] Users can comment on posts.
// [_] Posts should always display the post content, author, comments, and likes.
// [_] There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
// [_] Users can create a profile with a profile picture.

// db:
// [_] users: following, profile pic (assign a default one on registration), bio
// [_] posts: who wrote it, comments, likes
// [_] comments: to which post, likes, who wrote it

// api routes:
// [_] serve a user's data by id
// [_] serve posts of everyone you follow
// [_] search usernames AND groupchats you are a member of
// [_] change your profile
// [_] follow a user
// [_] unfollow a user
// [_] write a post
// [_] write a comment
// [_] like a post
// [_] like a comment

// do the frontend:
// [v] fix the "missing prop validation" eslint thing
// [_] top bar: your profile pic and two tabs on top: feed / messages
// [_] feed page: "What's happening?", then a feed of everyone whom the user follows
// [_] messages: users and groupchats with whom you've got messages, sorted by last message with a date, above that a search for all users
// [_] profile page for yourself: change it (profile pic, bio, username)
// [_] profile page for others: see profile pic, bio and username, and two buttons below: folllow/unfollow and message
