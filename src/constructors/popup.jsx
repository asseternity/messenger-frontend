import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
const Popup = ({ user, unreadMessages, unreadComments, closeCallback }) => {
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    const updateTime = async () => {
      try {
        await fetch(
          "https://messenger-backend-production-a259.up.railway.app/notification_update",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              myUserId: user.id,
            }),
          }
        );
      } catch (err) {
        console.log(err);
      }
    };

    updateTime();
  }, []);

  useEffect(() => {
    const allNews = [...unreadComments, ...unreadMessages];
    const allNewsSorted = allNews.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() > dateB.getTime() ? -1 : 1;
    });
    // Now go through allNewsSorted and add the 'type' label based on 'author' or 'sender'
    const allNewsLabeled = allNewsSorted.map((newsItem) => {
      if (newsItem.author) {
        return { ...newsItem, type: "comment" };
      } else if (newsItem.sender) {
        return { ...newsItem, type: "message" };
      }
      return { ...newsItem, type: "other" }; // Return the original object if neither 'author' nor 'sender' is found
    });
    setUpdates(allNewsLabeled); // Set the state with the labeled array
  }, []);

  return (
    <div className="popup_inner">
      <div className="popup_inner_top">
        <button onClick={closeCallback}>X</button>
      </div>
      {updates.map((update) => {
        return (
          <p key={update.content + update.id}>
            You have a new {update.type} from{" "}
            {update.sender ? update.sender.username : update.author.username}
            {": "}
            {update.content}
          </p>
        );
      })}
    </div>
  );

  // do the fetching in the initial index load
  // here just show the data
  // and have an x to close it
  // backend:
  // - when the popup is closed, store the time in user.CreatedAt
  // - when the feed is loaded, find: (1) messages to you after user.CreatedAt and (2) comments to your posts after user.CreatedAt
  // - put them into a single array and sort by date
  // - transform them into strings like "you have a new message from XYZ from [Day]", "ABC commented on your post on [Day]"
  // - when the popup is closed, store the time in user.CreatedAt
};

export default Popup;
