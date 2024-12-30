import { useState, useEffect } from "react";
import defaultProfilePic from "/silhouette.png";

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
const Feed = ({ user }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentsAdded, setCommentsAdded] = useState(0);
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postPagination, setPostPagination] = useState(1);

  // Fetch the posts of people the user follows
  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      try {
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
          setFeedPosts(data);
        } else {
          console.error("Failed to fetch feed");
        }
      } catch (err) {
        console.error("Error fetching feed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [user, commentsAdded, postPagination]);

  // Handle creating a new post
  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) {
      return; // Don't submit if content is empty
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
            postContent: newPostContent,
          }),
        }
      );

      if (response.ok) {
        const newPost = await response.json();
        setPostPagination(1);
        setFeedPosts([newPost, ...feedPosts]); // Add new post to the top of the feed
        setNewPostContent(""); // Clear the input field
      } else {
        console.error("Failed to create post");
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

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

  return (
    <div className="feed_container">
      {/* New Post Section */}
      <div className="new_post_section">
        <textarea
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="What's happening?"
          rows="5"
          className="new_post_textarea"
        />
        <button onClick={handlePostSubmit} className="post_button">
          Post
        </button>
      </div>

      {/* Feed Section */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="feed_posts">
          {feedPosts.length === 0 ? (
            <div>No posts from people you follow</div>
          ) : (
            feedPosts.map((post) => (
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
                  {post.author.username === user.username ? (
                    <button
                      onClick={() => handlePostDelete(post)}
                      className="delete_post"
                    >
                      🗑
                    </button>
                  ) : (
                    <div></div>
                  )}
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
