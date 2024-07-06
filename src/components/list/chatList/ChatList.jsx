import { useEffect, useState } from "react";
import "./ChatList.css";
import AddUser from "../../addUser/AddUser";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../lib/Firebase";
import { useUserStore } from "../../lib/UserStore";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const { currentUser } = useUserStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unSub();
  }, [currentUser.id]);

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="search.png" alt="" />
          <input type="search" />
        </div>
        <img
          src={addMode ? "minus.png" : "plus.png"}
          alt="add"
          className="add"
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      <div className="items">
        {chats.map((chat) => (
          <div
            className="item"
            key={chat.chatId}
            onClick={() => handleSelect(chat)}
          >
            <img src={chat.user.avatar || "avatar.png"} alt="avatar" />
            <div className="text">
              <span>{chat.user.username}</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
