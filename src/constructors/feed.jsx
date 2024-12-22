import { useState, useEffect } from "react";

// api changes:
// include the user's OWN posts into the original fetch
// make a new route - fetch a user's posts by id, for profile reasons

/* eslint-disable react/prop-types */
const Feed = ({ user }) => {
  const [newPostContent, setNewPostContent] = useState("");
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(false);

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
              <div key={post.id} className="post_item">
                <p>{post.author.username + ": " + post.content}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
