import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";

/* eslint-disable react/prop-types */
const Profile = ({ user, profileUser, updateUser, goToChatFromProfile }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentsAdded, setCommentsAdded] = useState(0);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profileUser.username);
  const [editedBio, setEditedBio] = useState(profileUser.bio || "");
  const [targetUser, setTargetUser] = useState(profileUser);
  const [allUsers, setAllUsers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [profileHidden, setProfileHidden] = useState(false);

  console.log("Profile loading!");

  useEffect(() => {
    if (user.id === targetUser.id) {
      setTargetUser(user);
    }
  }, [user]);

  useEffect(() => {
    if (profileUser !== targetUser) {
      setEditedUsername(profileUser.username);
      setEditedBio(profileUser.bio || "");
      setTargetUser(profileUser);
    }
  }, [profileUser]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/users_posts",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ targetUserId: targetUser.id }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPosts(data.post);
          setAllUsers(data.users);
        } else {
          console.error("Failed to fetch feed");
        }
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user, targetUser, commentsAdded]);

  // fetch all users, then map follows to usernames
  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/all-users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          const filteredData = data.filter((item) =>
            targetUser.following.includes(item.id)
          );
          setFollowing(filteredData);
        } else {
          console.error("Failed to fetch follows");
        }
      } catch (err) {
        console.error("Error fetching follows:", err);
      }
    };

    fetchFollows();
  }, [user, targetUser, commentsAdded]);

  // Handle post expansion/collapse
  const togglePostExpansion = (postId) => {
    if (expandedPostId !== postId) {
      setNewCommentContent("");
      setExpandedPostId(postId);
    }
  };

  const toggleHideProfile = () => {
    if (profileHidden) {
      setProfileHidden(false);
    } else {
      setProfileHidden(true);
    }
  };

  // Handle add comment
  const handleCommentSubmit = async (postId) => {
    if (!newCommentContent.trim()) {
      return; // Don't submit if content is empty
    }
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/new_comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.userId,
            myPostId: postId,
            commentContent: newCommentContent,
          }),
        }
      );
      if (response.ok) {
        setCommentsAdded(commentsAdded + 1);
        setNewCommentContent(""); // Clear the input field
      } else {
        console.error("Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handlePostDelete = async (post) => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/delete_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.userId,
            postId: post.id,
          }),
        }
      );
      if (response.ok) {
        setCommentsAdded(commentsAdded + 1);
        setNewCommentContent(""); // Clear the input field
      } else {
        console.error("Failed to delete post");
      }
    } catch (err) {
      console.error("Error deleting post: ", err);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes to the backend
      saveProfileChanges();
    }
    setIsEditing(!isEditing);
  };

  const saveProfileChanges = async () => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/update_profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.userId,
            newUsername: editedUsername,
            newBio: editedBio,
          }),
        }
      );
      if (!response.ok) {
        console.error("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      updateUser(
        { ...user, username: editedUsername, bio: editedBio },
        targetUser
      );
    }
  };

  const handleFollowUnfollow = async (whoToFollow) => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/follow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.id,
            targetUserId: whoToFollow.id,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        updateUser({ ...user, following: data.following }, targetUser);
      } else {
        console.error("Failed to post.");
      }
    } catch (err) {
      console.error("Error during post: ", err);
    }
  };

  const handleChat = (whoToChatWith) => {
    goToChatFromProfile(whoToChatWith);
  };

  const handleClickProfilePicture = () => {
    // Trigger the click event on the hidden file input element
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.click();
    } else {
      console.error("File input element not found.");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("userId", user.id);
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/upload/upload-profile-pic",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        updateUser({ ...user, profilePicture: data.fileUrl }, targetUser);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handlePostLikeUnlike = async (postId) => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/like_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.id,
            postId: postId,
          }),
        }
      );
      if (response.ok) {
        setCommentsAdded(commentsAdded + 1);
        setNewCommentContent(""); // Clear the input field
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  const handleCommentLikeUnlike = async (commentId) => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/like_comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.id,
            commentId: commentId,
          }),
        }
      );
      if (response.ok) {
        setCommentsAdded(commentsAdded + 1);
        setNewCommentContent(""); // Clear the input field
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  return (
    <div className="profile_section">
      {!profileHidden && (
        <div className="profile_top">
          <div className="profile_container">
            <div className="profile_pic_container">
              <img
                src={
                  targetUser.profilePicture
                    ? `${targetUser.profilePicture}`
                    : defaultProfilePic
                }
                onClick={
                  targetUser.username === user.username
                    ? handleClickProfilePicture
                    : () => {}
                }
              ></img>
              {targetUser.username === user.username && (
                <input
                  type="file"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              )}
            </div>
            <div className="profile_text_container">
              {isEditing ? (
                <input
                  type="text"
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="edit_username_input"
                />
              ) : (
                <h3 className="profile_username">{targetUser.username}</h3>
              )}
              <div className="profile_bio">
                {isEditing ? (
                  <textarea
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="edit_bio_textarea"
                  ></textarea>
                ) : (
                  targetUser.bio || "This user has not added a bio."
                )}
              </div>
            </div>
            <div className="profile_edit_container">
              {targetUser.username === user.username && (
                <button onClick={handleEditToggle}>
                  {isEditing ? "✔" : "🖉"}
                </button>
              )}
              {targetUser.username !== user.username && (
                <div className="profile_follow_chat">
                  <button onClick={() => handleFollowUnfollow(targetUser)}>
                    {user.following.includes(targetUser.id)
                      ? "Unfollow"
                      : "Follow"}
                  </button>
                  <button onClick={() => handleChat(targetUser)}>Chat</button>
                </div>
              )}
            </div>
          </div>
          <div className="profile_follows">
            <span className="following_title">Following</span>
            <span className="following_click">
              {targetUser.username === user.username
                ? "(click to unfollow)"
                : ""}{" "}
            </span>
            {targetUser.username === user.username ? (
              <div className="profile_follows_inner">
                {following.map((item) => (
                  <img
                    key={"following_list_" + item.id + item.username}
                    src={
                      item.profilePicture
                        ? `${item.profilePicture}`
                        : defaultProfilePic
                    }
                    className="following_img"
                    onClick={() => handleFollowUnfollow(item)}
                  ></img>
                ))}
              </div>
            ) : (
              <div className="profile_follows_inner">
                {following.map((item) => (
                  <img
                    key={"following_list_" + item.id + item.username}
                    src={
                      item.profilePicture
                        ? `${item.profilePicture}`
                        : defaultProfilePic
                    }
                    className="following_img"
                  ></img>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="posts_by" onClick={toggleHideProfile}>
        <h3>
          Posts by {targetUser.username}{" "}
          {!profileHidden ? "(click to expand)" : "(click to collapse)"}
        </h3>
      </div>
      {loading ? (
        <div className="profile_feed">Loading...</div>
      ) : (
        <div className="profile_feed">
          {posts.length === 0 ? (
            <div>This user has no posts.</div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="post_item"
                onClick={() => togglePostExpansion(post.id)}
              >
                <div className="post_author">
                  <div className="post_data">
                    <img
                      src={
                        post.author.profilePicture
                          ? `${post.author.profilePicture}`
                          : defaultProfilePic
                      }
                    ></img>
                    <div className="post_content">
                      <p>{post.author.username}</p>
                      <span className="last_message">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePostDelete(post)}
                    className="delete_post"
                  >
                    🗑
                  </button>
                </div>
                <p className="profile_post_content">{post.content}</p>

                <div className="post_like_container">
                  <button
                    className="delete_post"
                    onClick={() => handlePostLikeUnlike(post.id)}
                  >
                    ♡
                  </button>
                  <div className="post_like_counter">
                    {post.likes?.length || 0}
                  </div>
                  <div className="post_like_likers">
                    {
                      // Loop through post.likes and match ids with allUsers
                      post.likes.map((likeId) => {
                        // Find the user with the matching id
                        const user = allUsers.find(
                          (user) => user.id === likeId
                        );
                        return user ? (
                          <img
                            key={user.id}
                            src={
                              user.profilePicture
                                ? `${user.profilePicture}`
                                : defaultProfilePic
                            }
                            alt="profile"
                            className="post_like_img"
                          />
                        ) : null;
                      })
                    }
                  </div>
                </div>
                <div
                  className={`post_comments ${
                    expandedPostId === post.id ? "expanded" : ""
                  }`}
                >
                  {expandedPostId === post.id ? (
                    <div>
                      {post.comments.map((comment) => (
                        <div
                          className="comment_container"
                          key={post.id + "." + comment.id}
                        >
                          <div className="comment_author">
                            <img
                              src={
                                post.author.profilePicture
                                  ? `${comment.author.profilePicture}`
                                  : defaultProfilePic
                              }
                            ></img>
                            <span>{comment.author.username}</span>
                            <button
                              className="like_comment"
                              onClick={() =>
                                handleCommentLikeUnlike(comment.id)
                              }
                            >
                              ♡
                            </button>
                            <div className="comment_main">
                              <span className="comment_content">
                                {comment.content}
                              </span>
                              {comment.likes.length > 0 ? (
                                <span className="comment_likers">
                                  {comment.likes.length === 1
                                    ? "1 like:"
                                    : `${comment.likes.length} likes:`}
                                  {comment.likes.map((likeId) => {
                                    const user = allUsers.find(
                                      (user) => user.id === likeId
                                    );
                                    return user ? (
                                      <span key={user.id}>
                                        {" "}
                                        {user.username}
                                      </span>
                                    ) : null;
                                  })}
                                </span>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <textarea
                        value={newCommentContent}
                        onChange={(e) => setNewCommentContent(e.target.value)}
                        placeholder="Add a comment."
                        rows="2"
                        className="comment_textarea"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="comment_button"
                      >
                        Post
                      </button>
                    </div>
                  ) : (
                    <span className="comments_instruction">
                      Click to see comments
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
          <div className="profile_feed_filler"></div>
        </div>
      )}
    </div>
  );
};

export default Profile;

// [v] hook up to open profiles through the search tab

// your profile:
// [v] display username, bio, profile pic
// [v] css display
// [v] your posts under your profile
// [v] perfect css
// [v] display post dates everywhere (on feed too)
// [v] delete the the post (button available on feed as well)
// [v] editing mode for your profile
// [v] the entire app should refetch when username is updated, it doesn't recognize you
// [v] on username change - only username_bar changes
// [v] on bio change - doesn't update until logout
// [v] recenter username and profile pic on top

// other people's profiles:
// [v] display username, bio, profile pic
// [v] css display
// [v] posts of that person under their profile
// [v] perfect css
// [v] display post dates everywhere (on feed too)
// [v] follow / message buttons
// [v] identify whether you're following that user or not
// [v] follow button hook up
// [_] raise the chat button up a level to index by callback passing
