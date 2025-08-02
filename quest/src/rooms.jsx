import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./rooms.module.css";
import room1 from "./assets/r1.jpg";
import room2 from "./assets/r2.jpg";
import room3 from "./assets/r33.jpg";
import room5 from "./assets/r55.jpg";
import room6 from "./assets/r66.jpg";
import room7 from "./assets/r77.jpg";
import room8 from "./assets/r88.jpg";

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "ROOM 1",
      image: room1,
      description: "Spacious king-sized room with city view and private bath.",
      price: 100,
      features: ["Wi-Fi", "Air Conditioning", "Breakfast", "TV"],
      available: true,
    },
    {
      id: 2,
      name: "ROOM 2",
      image: room2,
      description: "Comfortable double bed with en-suite bathroom.",
      price: 100,
      features: ["Wi-Fi", "TV", "Room Service"],
      available: true,
    },
    {
      id: 3,
      name: "ROOM 3",
      image: room3,
      description: "Superior double room with garden view and extra amenities.",
      price: 4.17,
      features: ["Wi-Fi", "Mini Fridge", "TV", "Breakfast"],
      available: true,
    },
    {
      id: 4,
      name: "ROOM 4",
      image: room5,
      description: "Spacious suite ideal for families. Includes two beds.",
      price: 100,
      features: ["Wi-Fi", "TV", "Breakfast", "Air Conditioning"],
      available: true,
    },
    {
      id: 5,
      name: "ROOM 5",
      image: room6,
      description: "Ideal for business travelers. Workspace and fast internet.",
      price: 100,
      features: ["TV", "Workspace", "Room Service"],
      available: true,
    },
    {
      id: 6,
      name: "ROOM 6",
      image: room7,
      description: "Perfect for solo travelers. Comfortable and efficient.",
      price: 100,
      features: ["Wi-Fi", "TV"],
      available: true,
    },
    {
      id: 7,
      name: "ROOM 7",
      image: room8,
      description: "Spacious room with ambient lighting and seating area.",
      price: 100,
      features: ["TV", "Room Service", "Mini Bar"],
      available: true,
    },
    {
      id: 8,
      name: "ROOM 8",
      image: room8,
      description: "Nice room with serving table and chair",
      price: 100,
      features: ["TV", "Room Service", "Mini Bar"],
      available: true,
    },
  ]);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleBookNow = (room) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === room.id ? { ...r, available: false } : r))
    );
    setSelectedRoom((prev) => (prev ? { ...prev, available: false } : prev));
    navigate("/payment", { state: { room } }, []);
    closeModal();
  };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isModalOpen]);

  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }, []), []);

  return (
    <div className={styles["rooms-page-container"]}>
      <section className={styles["rooms-section"]}>
        <div className={styles["rooms-header"]}>
          <h1>Our Rooms</h1>
          <p>Explore the comfort and luxury we offer.</p>
        </div>
        <div className={styles["rooms-grid"]}>
          {rooms.map((room) => (
            <div key={room.id} className={styles["room-card"]}>
              <div className={styles["room-image-container"]}>
                <img
                  src={room.image}
                  alt={room.name}
                  className={styles["room-image"]}
                />
              </div>
              <div className={styles["room-content"]}>
                <h2>{room.name}</h2>
                <p className={styles["room-description"]}>{room.description}</p>
                <div className={styles["room-features"]}>
                  {room.features.map((feature, index) => (
                    <span key={index}>{feature}</span>
                  ))}
                </div>
                <div className={styles["room-footer"]}>
                  <div className={styles["price-availability"]}>
                    <span className={styles["room-price"]}>
                      GHS {(room.price * 12).toFixed(2)}
                    </span>
                    <span
                      className={`${styles["availability-badge"]} ${
                        styles[room.available ? "available" : "unavailable"]
                      }`}
                    >
                      {room.available ? "Available" : "Booked"}
                    </span>
                  </div>
                  <button
                    className={styles["view-details-btn"]}
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(room);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {isModalOpen && selectedRoom && (
        <div className={styles["room-details-modal"]} onClick={closeModal}>
          <div
            className={styles["modal-content"]}
            onClick={(e) => {
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
            }}
          >
            <button className={styles["close-modal"]} onClick={closeModal}>
              ×
            </button>
            <div className={styles["modal-image-container"]}>
              <img src={selectedRoom.image} alt={selectedRoom.name} />
            </div>
            <div className={styles["modal-details"]}>
              <h2>{selectedRoom.name}</h2>
              <p className={styles["modal-description"]}>
                {selectedRoom.description}
              </p>
              <div className={styles["modal-features"]}>
                {selectedRoom.features.map((feature, i) => (
                  <span key={i}>{feature}</span>
                ))}
              </div>
              <div className={styles["modal-footer"]}>
                <div className={styles["price-availability"]}>
                  <span className={styles["room-price"]}>
                    GHS {(selectedRoom.price * 12).toFixed(2)}/night
                  </span>
                  <span
                    className={`${styles["modal-availability"]} ${
                      styles[
                        selectedRoom.available ? "available" : "unavailable"
                      ]
                    }`}
                  >
                    {selectedRoom.available ? "Available" : "Booked"}
                  </span>
                </div>
                {selectedRoom.available ? (
                  <button
                    className={styles["book-now-btn"]}
                    onClick={() => handleBookNow(selectedRoom)}
                  >
                    Book Now
                  </button>
                ) : (
                  <div className={styles["booked-message"]}>
                    This room has been booked
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
