import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../lib/Firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/UserStore";
import Upload from "../lib/Upload";

const Chat = () => {
  const [chat, setChat] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  const handleImg = (e) => {
    if (e.target.files[0])
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
  };

  const endRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  // Set up the onSnapshot listener for the chat document
  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
        setChat(res.data());
      });

      // Clean up the listener on unmount
      return () => unSub();
    }
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      // Upload image if there is one
      if (img.file) {
        imgUrl = await Upload(img.file);
      }

      // Update the chat document with the new message
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }), // Conditionally include img if imgUrl is set
        }),
      });

      const userIds = [currentUser.id, user.id];

      // Update the userChats for both users
      userIds.forEach(async (id) => {
        const userChatRef = doc(db, "userChats", id);
        const userChatsSnapshot = await getDoc(userChatRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );
          if (chatIndex !== -1) {
            userChatsData.chats[chatIndex].lastMessage = text;
            userChatsData.chats[chatIndex].isSeen = id === currentUser.id;
            userChatsData.chats[chatIndex].updatedAt = Date.now();

            await updateDoc(userChatRef, {
              chats: userChatsData.chats,
            });
          }
        }
      });

      setImg({ file: null, url: "" });
      setText("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="text">
            <span>{user?.username}</span>
            <p>I'm FrontEnd Developer</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        <div className="messages">
          {chat?.messages?.map((message) => (
            <div
              className={
                message.senderId === currentUser?.id ? "own-message" : "message"
              }
              key={message?.createdAt}
            >
              <div className="text">
                {message.img && <img src={message.img} alt="message" />}
                <p>{message.text}</p>
                <span>1 minute ago</span>
              </div>
            </div>
          ))}
          {img.url && (
            <div className="own-message">
              <div className="text">
                <img src={img.url} alt="" />
              </div>
            </div>
          )}
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            name="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
            disabled={isReceiverBlocked || isCurrentUserBlocked}
          />
          <img
            src="./camera.png"
            alt=""
            disabled={isReceiverBlocked || isCurrentUserBlocked}
          />
          <img
            src="./mic.png"
            alt=""
            disabled={isReceiverBlocked || isCurrentUserBlocked}
          />
        </div>
        <input
          type="text"
          value={text}
          placeholder={
            isReceiverBlocked || isCurrentUserBlocked
              ? "You cannot send a message"
              : "Type Your Massage..."
          }
          onChange={(e) => setText(e.target.value)}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => setOpenEmoji((prev) => !prev)}
          />
          <div className="picker">
            {openEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
          </div>
        </div>
        <img
          src="./send.png"
          alt="send"
          className="send"
          onClick={handleSend}
          disabled={isReceiverBlocked || isCurrentUserBlocked}
          style={{
            cursor:
              isReceiverBlocked || isCurrentUserBlocked
                ? "not-allowed"
                : "pointer",
            opacity: isReceiverBlocked || isCurrentUserBlocked ? 0.5 : 1,
          }}
        />
      </div>
    </div>
  );
};

export default Chat;
