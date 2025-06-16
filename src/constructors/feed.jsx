import { useState, useEffect, useRef } from "react";
import defaultProfilePic from "/silhouette.png";
import not_found from "/not_found.png";

// api changes:
// v include the user's OWN posts into the original fetch
// v make a new route - fetch a user's posts by id, for profile reasons

// css changes:
// v reduce max width of feed and messages to like 800? so that they don't look like shit on PC
// v also on the messages tab!
// v make ROOT's bg pink instead to fix

// feed changes:
// v put profile pics up on posts in the feed
// v default at first, but then replace with correct ones upon fetch
// v click on the post to expand it
// v show comments
// v ability to leave a comment
// v display commenter's username and profile pic
// v css comments
// v post pagination
// v pagination for comments
// v css comment field

/* eslint-disable react/prop-types */
const Feed = ({ user, profileCallback, isAllUsers }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentsAdded, setCommentsAdded] = useState(0);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postPagination, setPostPagination] = useState(1);
  const [allUsers, setAllUsers] = useState([]);
  const [isPostEditing, setIsPostEditing] = useState(false);
  const [editedPostContent, setEditedPostContent] = useState("");
  const [editedUrlContent, setEditedUrlContent] = useState("");
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [showGuestMessage, setShowGuestMessage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const textareaRef = useRef(null);

  // Fetch the posts of people the user follows
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
        if (!isAllUsers) {
          const response = await fetch(
            "https://messenger-backend-production-a259.up.railway.app/get_feed",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              credentials: "include",
              body: JSON.stringify({
                myUserId: user.id,
                page: postPagination, // You can implement pagination if needed
                pageSize: 5,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFeedPosts(data.post);
            setAllUsers(data.users);
          } else {
            console.error("Failed to fetch feed");
          }
        } else {
          const response = await fetch(
            "https://messenger-backend-production-a259.up.railway.app/all_posts",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
              credentials: "include",
              body: JSON.stringify({
                page: postPagination, // You can implement pagination if needed
                pageSize: 5,
              }),
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFeedPosts(data.allPosts);
            setAllUsers(data.users);
          } else {
            console.error("Failed to fetch feed");
          }
        }
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user, commentsAdded, postPagination, isAllUsers]);

  // Handle creating a new post
  const handlePostSubmit = async () => {
    if (user.username === "Guest") {
      setShowGuestMessage(true);
      return;
    }
    if (!newPostContent.trim()) {
      return; // Don't submit if content is empty
    }

    // handle attaching an image to the post
    let postText = "";
    if (imageUrl !== "") {
      postText = "image_" + imageUrl + "({[image]})" + newPostContent;
    } else {
      postText = newPostContent;
    }

    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/new_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            myUserId: user.id,
            postContent: postText,
          }),
        }
      );
      if (response.ok) {
        const newPost = await response.json();
        setPostPagination(1);
        setFeedPosts([newPost, ...feedPosts]); // Add new post to the top of the feed
        setNewPostContent(""); // Clear the input field
        setImageUrl(""); // Clear the input field
      } else {
        console.error("Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  // Handle post expansion/collapse
  const togglePostExpansion = (postId) => {
    if (expandedPostId !== postId) {
      setNewCommentContent("");
      setExpandedPostId(postId);
    }
  };

  // Handle add comment
  const handleCommentSubmit = async (postId) => {
    if (user.username === "Guest") {
      setShowGuestMessage(true);
      return;
    }
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
            myUserId: user.id,
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
            myUserId: user.id,
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

  const handlePostEditToggle = (post) => {
    if (isPostEditing) {
      // Save changes to the backend
      savePostChanges(post);
      setIsPostEditing(false);
    }
    if (!isPostEditing) {
      // break up the content string into postContent and url
      const initialPostString = post.content;
      const editing_postContent = initialPostString.split("({[image]})").pop();
      const editing_imageUrl = initialPostString
        .split("({[image]})")[0]
        .slice(6);
      setEditedPostContent(editing_postContent);
      setEditedUrlContent(editing_imageUrl);
      setIsPostEditing(post.id);
    }
  };

  const savePostChanges = async (post) => {
    // if the post NOW contains an image url, cipher the two into a coded string
    let postText = newPostContent;
    if (editedUrlContent !== "") {
      postText =
        "image_" + editedUrlContent + "({[image]})" + editedPostContent;
    }
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/update_post",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            postId: post.id,
            postContent: postText,
          }),
        }
      );
      if (response.ok) {
        setCommentsAdded(commentsAdded + 1);
        setEditedPostContent(""); // Clear the input field
        setEditedUrlContent("");
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  const handleCommentEditToggle = (comment) => {
    if (isCommentEditing) {
      saveCommentChanges(comment);
      setIsCommentEditing(false);
    } else {
      setEditedCommentContent(comment.content);
      setIsCommentEditing(comment.id);
    }
  };

  const saveCommentChanges = async (comment) => {
    try {
      const response = await fetch(
        "https://messenger-backend-production-a259.up.railway.app/edit_comment",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            commentId: comment.id,
            commentContent: editedCommentContent,
          }),
        }
      );
      if (response.ok) {
        setCommentsAdded(commentsAdded + 1);
        setEditedCommentContent(""); // Clear the input field
      }
    } catch (err) {
      console.error("Error during fetch: ", err);
    }
  };

  // dynamically resize new post textarea
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleImageError = (e) => {
    // avoid infinite loop if placeholder also fails
    e.currentTarget.onerror = null;
    e.currentTarget.src = not_found;
  };

  return (
    <div className="feed_container">
      {/* Guest restriction popup*/}
      {showGuestMessage && (
        <div className="guest_message">
          As a guest user, you may not create posts or comments. Register to use
          the Lounge!
          <button onClick={() => setShowGuestMessage(false)}>Confirm</button>
        </div>
      )}
      {/* New Post Section */}
      {!isAllUsers && (
        <div className="new_post_section">
          <textarea
            ref={textareaRef}
            onInput={handleInput}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="What's happening?"
            rows="5"
            className="new_post_textarea"
          />
          <div className="new_post_options">
            <button onClick={handlePostSubmit} className="post_button">
              Post
            </button>
            <div className="image_post_section">
              Attach image to post:
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://yourwebsite.com/image.jpg"
                className="image_post_input"
              />
            </div>
          </div>
        </div>
      )}
      {/* Feed Section */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="feed_posts">
          {feedPosts.length === 0 ? (
            <div>No posts from people you follow</div>
          ) : (
            feedPosts.map((post) => (
              <div key={post.id} className="post_item">
                <div className="post_author post_author_animation">
                  <div className="post_data">
                    <img
                      onClick={() => profileCallback(post.author)}
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
                  {post.author.username === user.username ? (
                    <div>
                      <button
                        onClick={() => handlePostDelete(post)}
                        className="delete_post"
                      >
                        🗑
                      </button>{" "}
                      {isPostEditing === post.id && (
                        <button
                          className="delete_post"
                          onClick={() => handlePostEditToggle(post)}
                        >
                          {"✔"}
                        </button>
                      )}
                      {isPostEditing === false && (
                        <button
                          className="delete_post"
                          onClick={() => handlePostEditToggle(post)}
                        >
                          {"🖉"}
                        </button>
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                {isPostEditing !== post.id ? (
                  <div style={{ height: "100%", width: "100%" }}>
                    {post.content.startsWith("image_") && (
                      <div style={{ height: "100%", width: "100%" }}>
                        <img
                          src={post.content.split("({[image]})")[0].slice(6)}
                          className="post_image"
                          onError={handleImageError}
                        />
                        <p>{post.content.split("({[image]})").pop()}</p>
                      </div>
                    )}
                    {!post.content.startsWith("image_") && (
                      <p className="post_content_text">{post.content}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      placeholder="Add your image URL..."
                      value={editedUrlContent}
                      onChange={(e) => setEditedUrlContent(e.target.value)}
                      className="edit_post_url"
                    />
                    <textarea
                      value={editedPostContent}
                      onChange={(e) => setEditedPostContent(e.target.value)}
                      className="edit_bio_textarea"
                    ></textarea>
                  </div>
                )}
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
                  onClick={() => togglePostExpansion(post.id)}
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
                            {comment.author.username === user.username ? (
                              <div>
                                {isCommentEditing === false && (
                                  <button
                                    className="like_comment edit_comment"
                                    onClick={() =>
                                      handleCommentEditToggle(comment)
                                    }
                                  >
                                    Edit
                                  </button>
                                )}
                                {isCommentEditing === comment.id && (
                                  <button
                                    className="like_comment edit_comment"
                                    onClick={() =>
                                      handleCommentEditToggle(comment)
                                    }
                                  >
                                    Confirm
                                  </button>
                                )}
                              </div>
                            ) : (
                              <div></div>
                            )}
                            <div className="comment_main">
                              {isCommentEditing !== comment.id ? (
                                <span className="comment_content">
                                  {comment.content}
                                </span>
                              ) : (
                                <textarea
                                  value={editedCommentContent}
                                  onChange={(e) =>
                                    setEditedCommentContent(e.target.value)
                                  }
                                  className="edit_bio_textarea edit_comment_textarea"
                                ></textarea>
                              )}
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
          <div className="post_pagination">
            <button
              onClick={() => setPostPagination(Math.max(1, postPagination - 1))}
              disabled={postPagination === 1}
            >
              {"<"}
            </button>
            <span>Page {postPagination}</span>
            <button
              onClick={() => setPostPagination(postPagination + 1)}
              disabled={feedPosts.length < 5}
            >
              {">"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
