import { useState } from "react";
import "./ChatList.css";
import AddUser from "../../addUser/AddUser";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
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
        <div className="item">
          <img src="avatar.png" alt="" />
          <div className="text">
            <span>John Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="avatar.png" alt="" />
          <div className="text">
            <span>John Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="avatar.png" alt="" />
          <div className="text">
            <span>John Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="avatar.png" alt="" />
          <div className="text">
            <span>John Doe</span>
            <p>Hello</p>
          </div>
        </div>
        <div className="item">
          <img src="avatar.png" alt="" />
          <div className="text">
            <span>John Doe</span>
            <p>Hello</p>
          </div>
        </div>
      </div>
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
