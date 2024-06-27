import "./Detail.css";

const Detail = () => {
  return (
    <div className="detail">
      <div className="user">
        <img src="avatar.png" alt="" />
        <h2>John Doe</h2>
        <p>I'm FullStack Devoloper</p>
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
            <span>Shard Photo</span>
            <img src="arrowDown.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="avatar.png" alt="" />
                <span>photo_2024.png</span>
              </div>
              <img src="download.png" alt="" className="deleteIcon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="avatar.png" alt="" />
                <span>photo_2024.png</span>
              </div>
              <img src="download.png" alt="" className="deleteIcon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="avatar.png" alt="" />
                <span>photo_2024.png</span>
              </div>
              <img src="download.png" alt="" className="deleteIcon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="avatar.png" alt="" />
                <span>photo_2024.png</span>
              </div>
              <img src="download.png" alt="" className="deleteIcon" />
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="avatar.png" alt="" />
                <span>photo_2024.png</span>
              </div>
              <img src="download.png" alt="" className="deleteIcon" />
            </div>
          </div>
        </div>

        <div className="option">
          <div className="title">
            <span>Shard File</span>
            <img src="arrowDown.png" alt="" />
          </div>
        </div>
        <button>Block User</button>
        <button className="logout">Logout</button>
      </div>
    </div>
  );
};

export default Detail;
