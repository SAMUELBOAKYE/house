import React, { useState } from "react";
import "./BookingForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BookingForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    specialRequests: "",
    roomType: "ROOM 1", // ✅ matches dropdown values
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const accessKey = "e2158152-919f-402f-8674-9aa76afdc614"; // ✅ your new Web3Forms API key

    const form = new FormData();
    form.append("access_key", accessKey);
    form.append("name", formData.fullName);
    form.append("email", formData.email);
    form.append("message", formData.specialRequests);
    form.append("Phone", formData.phone);
    form.append("Check-In", formData.checkIn);
    form.append("Check-Out", formData.checkOut);
    form.append("Guests", formData.guests);
    form.append("Room Type", formData.roomType);
    form.append("replyto", formData.email);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });

      const result = await res.json();

      if (!result.success) {
        toast.error(`❌ Failed to submit: ${result.message || "Try again."}`);
        setError(result.message || "Form submission failed.");
        return;
      }

      toast.success("✅ Booking submitted, redirecting to payment...");

      // ✅ Set pricing based on roomType
      let price = 120;
      if (formData.roomType === "ROOM 1") price = 150;
      if (formData.roomType === "ROOM 2") price = 160;
      if (formData.roomType === "ROOM 3") price = 170;
      if (formData.roomType === "ROOM 4") price = 180;
      if (formData.roomType === "ROOM 5") price = 190;
      if (formData.roomType === "ROOM 6") price = 200;
      if (formData.roomType === "ROOM 7") price = 210;
      if (formData.roomType === "ROOM 8") price = 220;
      if (formData.roomType === "ROOM 9") price = 230;

      navigate("/payment", {
        state: {
          room: {
            name: formData.roomType,
            price,
          },
        },
      });
    } catch (err) {
      console.error("❌ Submission or payment error:", err);
      setError("Something went wrong. Please try again.");
      toast.error("❌ Network or server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button className="retry-btn" onClick={() => setError(null)}>
            Retry
          </button>
        </div>
      )}

      <form className="booking-form" onSubmit={handleSubmit}>
        <h2>Reservation Details</h2>

        <label>
          Full Name
          <input
            type="text"
            name="fullName"
            required
            value={formData.fullName}
            onChange={handleChange}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Room Type
          <select
            name="roomType"
            required
            value={formData.roomType}
            onChange={handleChange}
          >
            <option value="ROOM 1">ROOM 1</option>
            <option value="ROOM 2">ROOM 2</option>
            <option value="ROOM 3">ROOM 3</option>
            <option value="ROOM 4">ROOM 4</option>
            <option value="ROOM 5">ROOM 5</option>
            <option value="ROOM 6">ROOM 6</option>
            <option value="ROOM 7">ROOM 7</option>
            <option value="ROOM 8">ROOM 8</option>
            <option value="ROOM 9">ROOM 9</option>
          </select>
        </label>

        <label>
          Check-In Date
          <input
            type="date"
            name="checkIn"
            required
            value={formData.checkIn}
            onChange={handleChange}
          />
        </label>

        <label>
          Check-Out Date
          <input
            type="date"
            name="checkOut"
            required
            value={formData.checkOut}
            onChange={handleChange}
          />
        </label>

        <label>
          Number of Guests
          <input
            type="number"
            name="guests"
            min="1"
            max="9"
            required
            value={formData.guests}
            onChange={handleChange}
          />
        </label>

        <label>
          Special Requests
          <textarea
            name="specialRequests"
            rows="3"
            value={formData.specialRequests}
            onChange={handleChange}
          ></textarea>
        </label>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Processing..." : "Confirm & Pay"}
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={4000} />
    </>
  );
};

export default BookingForm;
