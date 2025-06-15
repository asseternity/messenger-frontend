import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Login from "./constructors/login";
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

// db:
// [v] users: following, profile pic, bio
// [v] posts: who wrote it, comments, likes
// [v] comments: to which post, likes, who wrote it

// api routes:
// [v] serve a user's data by id
// [v] serve posts of everyone you follow
// [v] change your profile
// [v] follow a user
// [v] unfollow a user
// [v] write a post
// [v] write a comment
// [v] like a post
// [v] like a comment
// [v] conversationsController: search usernames AND groupchats you are a member of
// [v] multer for file upload
// [v] map the new routes

// do the frontend:
// [v] fix the "missing prop validation" eslint thing
// [v] handle a default profile pic if there is none
// [v] top bar: a top bar with your profile and username; two bookmark tabs under it: feed / messages that switch the bar's colors when switched
// [v] feed page: "What's happening?", then a feed of everyone whom the user follows
// [v] messages: users and groupchats with whom you've got messages, sorted by last message with a date, above that a search for all users
// [v] profile page for yourself: by default, no bio and default profile pic, change profile pic, bio, username if you want
// [v] profile page for others: see profile pic, bio and username, and two buttons below: folllow/unfollow and message
// [v] profile posts: posts of that person under their profile

// requirements:
// [v] Users must sign in to see anything except the sign-in page.
// [v] Users should be able to sign in using your chosen authentication method.
// [v] Users can send follow requests to other users.
// [v] Users can create posts (text only).
// v] Users can like posts.
// [v] Users can comment on posts.
// [v] Posts should always display the post content, author, comments, and likes.
// [v] There should be an index page for posts, which shows all the recent posts from the current user and users they are following.
// [v] Users can create a profile with a profile picture.

// image messages:
// [v] frontend function for sending [image] + urls
// [v] backend for image upload for message
// [v] *decipher image_ messages in frontend*
// [v] css
// [v] replace broken image_ messages with a stock error

// bugs:
// [v] after new message chats don't update
// [v] create new conversation is bugged
// [v] writing a post does not update the page
// [v] expand post writing zone when text overflows

// image posts:
// [_] frontend for images in posts: section to post an image
// [_] frontend for images in posts: cipher the image posts
// [_] backend for image upload for posts
// [_] *decipher image_ posts in frontend*
// [_] css
// [_] replace broken image_ posts with a stock error
