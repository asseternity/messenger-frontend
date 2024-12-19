/* eslint-disable react/prop-types */
const Messages = ({ user }) => {
  const [loggedInUser, setLoggedInUser] = useState(user);
  const [searchString, setSearchString] = useState("");
  const [usersChats, setUsersChats] = useState([]);
  // [_] get all chats and groupchats by searching "" on that route
  // [_] left bar: search on top
  // [_] left bar: chats by recency under that (with date of latest message)
  // [_] right bar: send the thing to chat_window / groupchat_window

  useEffect(() => {
    const handleGetAllChats = async () => {
      try {
        const response = await fetch(
          "https://messenger-backend-production-a259.up.railway.app/users_conversations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
            credentials: "include",
            body: JSON.stringify({
              myUserId: user.userId,
              searchString: searchString,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUsersChats(data);
        }
      } catch (err) {
        console.error("Error during fetch: ", err);
      }
    };
  }, [loggedInUser, searchString]);

  return (
    <div className="messages_container">
      <div className="chats_search_&_list">
        <div className="search_form"></div>
        <div className="search_results"></div>
      </div>
      <div className="chats_themselves"></div>
    </div>
  );
};

export default Messages;
