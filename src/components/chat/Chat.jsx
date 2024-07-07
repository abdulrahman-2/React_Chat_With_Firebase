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
  const { chatId, user } = useChatStore();
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

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleSend = async () => {
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await Upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          sanderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIds = [currentUser.id, user.id];

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
          <img src="avatar.png" alt="" />
          <div className="text">
            <span>John Doe</span>
            <p>I'm FullStack Developer</p>
          </div>
        </div>
        <div className="icons">
          <img src="phone.png" alt="" />
          <img src="video.png" alt="" />
          <img src="info.png" alt="" />
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
            <img src="img.png" alt="" />
          </label>
          <input
            type="file"
            name="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
          />
          <img src="camera.png" alt="" />
          <img src="mic.png" alt="" />
        </div>
        <input
          type="text"
          value={text}
          placeholder="Type Your Massage..."
          onChange={(e) => setText(e.target.value)}
        />
        <div className="emoji">
          <img
            src="emoji.png"
            alt=""
            onClick={() => setOpenEmoji((prev) => !prev)}
          />
          <div className="picker">
            {openEmoji && <EmojiPicker onEmojiClick={handleEmoji} />}
          </div>
        </div>
        <img src="send.png" alt="send" className="send" onClick={handleSend} />
      </div>
    </div>
  );
};

export default Chat;
