import React from "react";
import styles from "./RoomSummary.module.css";
import roomImage from "./assets/r1.jpg";
import "./RoomSummary.module.css";
const RoomSummary = () => {
  return (
    <div className={styles["room-summary"]}>
      <h2>Room Overview</h2>
      <div className={styles["room-card"]}>
        <img
          src={roomImage}
          alt="Selected Room"
          className={styles["room-image"]}
        />
        <div className={styles["room-details"]}>
          <h3>Room 1</h3>
          <p>
            Spacious and elegantly designed with a king-size bed, ensuite
            bathroom and air conditioning.
          </p>
          <ul>
            <li> Sleeps 2 Guests</li>
            <li> No Free Wi-Fi</li>
            <li> Private Bathroom</li>
            <li> Air Conditioning</li>
            <li>Spot Bar</li>
          </ul>
          <div className={styles["room-price"]}>GHS 100 / night& 50 / day</div>
        </div>
      </div>
    </div>
  );
};

export default RoomSummary;
