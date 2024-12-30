import { useEffect, useState } from "react";
import defaultProfilePic from "/silhouette.png";

/* eslint-disable react/prop-types */
const Profile = ({ user, profileUser, updateUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentsAdded, setCommentsAdded] = useState(0);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profileUser.username);
  const [editedBio, setEditedBio] = useState(profileUser.bio || "");
  const [targetUser, setTargetUser] = useState(profileUser);

  useEffect(() => {
    if (user.id === targetUser.id) {
      setTargetUser(user);
    }
  }, [user]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/users_posts",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify({ targetUserId: targetUser.id }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPosts(data);
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

  // Handle post expansion/collapse
  const togglePostExpansion = (postId) => {
    setNewCommentContent("");
    if (expandedPostId !== postId) {
      setExpandedPostId(postId);
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
      updateUser({ ...user, username: editedUsername, bio: editedBio });
    }
  };

  return (
    <div className="profile_section">
      <div className="profile_container">
        <div className="profile_pic_container">
          <img
            src={
              targetUser.profilePicture
                ? `https://messenger-backend-production-a259.up.railway.app/uploads/${targetUser.profilePicture}`
                : defaultProfilePic
            }
          ></img>
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
            <button onClick={handleEditToggle}>{isEditing ? "✔" : "🖉"}</button>
          )}
        </div>
      </div>
      <div>
        <h3>Posts by {targetUser.username}</h3>
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
                          ? `https://messenger-backend-production-a259.up.railway.app/uploads/${post.author.profilePicture}`
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
                <p>{post.content}</p>
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
                                  ? `https://messenger-backend-production-a259.up.railway.app/uploads/${comment.author.profilePicture}`
                                  : defaultProfilePic
                              }
                            ></img>
                            <span>{comment.author.username}</span>
                          </div>
                          <div className="comment_content">
                            {comment.content}
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
// [_] follow / message buttons
