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
// click on the post to expand it and show the last five comments with pagination
// ability to leave a comment

/* eslint-disable react/prop-types */
const Feed = ({ user }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);

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
              myUserId: user.userId,
              page: 1, // You can implement pagination if needed
              pageSize: 50,
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
  }, [user]);

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
            myUserId: user.userId,
            postContent: newPostContent,
          }),
        }
      );

      if (response.ok) {
        const newPost = await response.json();
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
    setExpandedPostId(expandedPostId === postId ? null : postId);
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
                  <img
                    src={
                      post.author.profilePicture
                        ? `https://messenger-backend-production-a259.up.railway.app/uploads/${post.author.profilePicture}`
                        : defaultProfilePic
                    }
                  ></img>
                  <div className="post_content">
                    <p>{post.author.username}</p>
                  </div>
                </div>
                <p>{post.content}</p>
                <div
                  className={`post_comments ${
                    expandedPostId === post.id ? "expanded" : ""
                  }`}
                >
                  {expandedPostId === post.id ? <p>Comments</p> : <span></span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
