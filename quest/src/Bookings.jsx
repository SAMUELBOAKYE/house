import React, { useEffect, useState } from "react";
import "./Bookings.css";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "❌ Failed to fetch bookings");
        }

        setBookings(data);
      } catch (err) {
        setError(err.message || "❌ Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchBookings();
    } else {
      setError("🔐 You must be logged in to view bookings.");
      setLoading(false);
    }
  }, [token]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "❌ Failed to cancel booking");
      }

      setBookings((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
      alert("✅ Booking cancelled successfully");
    } catch (err) {
      alert(`❌ ${err.message || "Error cancelling booking"}`);
    }
  };

  if (loading) {
    return <div className="loader">⏳ Loading your bookings...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <div className="error-actions">
          <button onClick={() => window.location.reload()}>🔄 Retry</button>
          <button onClick={() => (window.location.href = "/login")}>
            🔐 Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bookings-page">
      <h2>Your Bookings 📆</h2>
      {bookings.length === 0 ? (
        <p className="no-bookings">📭 You have no bookings yet.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <h3>{booking.guestName}</h3>
              <p>
                <strong>Room:</strong> {booking.room}
              </p>
              <p>
                <strong>Date:</strong> {booking.date}
              </p>
              <p>
                <strong>Time:</strong> {booking.time}
              </p>
              <p>
                <strong>Status:</strong> {booking.status}
              </p>
              <button
                className="cancel-btn"
                onClick={() => handleCancel(booking._id)}
              >
                ❌ Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
