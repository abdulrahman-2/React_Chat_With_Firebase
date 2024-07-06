import { useEffect, useRef, useState } from "react";
import "./Chat.css";
import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/Firebase";

const Chat = () => {
  const [chat, setChat] = useState("");
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpenEmoji(false);
  };

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "chats", "5RJ4sk1AIQSwOOR7GGts"),
      (res) => {
        setChat(res.data());
      }
    );

    return () => unSub();
  }, []);

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
          <div className="message">
            <img src="avatar.png" alt="" />
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="own-message">
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="message">
            <img src="avatar.png" alt="" />
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="own-message">
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="message">
            <img src="avatar.png" alt="" />
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="own-message">
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="message">
            <img src="avatar.png" alt="" />
            <div className="text">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
          <div className="own-message">
            <div className="text">
              <img src="theme.png" alt="" />
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
                magni tempora explicabo nostrum optio molestiae odio ullam
                assumenda.
              </p>
              <span>1 minute ago</span>
            </div>
          </div>
        </div>
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="img.png" alt="" />
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
        <img src="send.png" alt="send" className="send" />
      </div>
    </div>
  );
};

export default Chat;
