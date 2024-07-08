import { useEffect, useState } from "react";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../lib/Firebase";
import { useChatStore } from "../lib/chatStore";
import { useUserStore } from "../lib/UserStore";
import "./Detail.css";

const Detail = () => {
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [sharedPhotos, setSharedPhotos] = useState([]);

  useEffect(() => {
    if (chatId) {
      const chatRef = doc(db, "chats", chatId);

      const unsubscribe = onSnapshot(chatRef, (doc) => {
        if (doc.exists()) {
          const chatData = doc.data();
          const images = chatData.messages
            .filter((message) => message.img) // Filter messages that contain images
            .map((message) => ({ img: message.img, text: message.text }));
          setSharedPhotos(images);
        }
      });

      return () => unsubscribe();
    }
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="detail">
      <div className="user">
        <img src={user?.avatar || "avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>I'm FrontEnd Developer</p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photo</span>
            <img src="arrowDown.png" alt="" />
          </div>
          <div className="photos">
            {sharedPhotos.map((photo, index) => (
              <div className="photoItem" key={index}>
                <div className="photoDetail">
                  <img src={photo.img} alt={`shared-${index}`} />
                  <span>{photo.text}</span>
                </div>
                <img src="download.png" alt="download" className="deleteIcon" />
              </div>
            ))}
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shared File</span>
            <img src="arrowDown.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>
          {isCurrentUserBlocked
            ? "You are Blocked!"
            : isReceiverBlocked
            ? "User Blocked!"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Detail;
