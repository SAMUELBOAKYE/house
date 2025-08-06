import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaystackButton } from "react-paystack";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./payment.css";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { room } = state || {};

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [network, setNetwork] = useState("MTN");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const paystackPublicKey =
    import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ||
    "pk_test_617b90c91293751fb40fd391f9f45032b6996e99";

  const apiBaseUrl =
    import.meta.env.VITE_API_URL || "https://quest-backend.onrender.com";

  const convertToGHS = (usd) => Math.round(usd * 12 * 100); // GHS in kobo

  const amount = room ? convertToGHS(room.price) : 0;

  const componentProps = {
    email,
    amount,
    metadata: {
      phone: phoneNumber,
      network,
      room: room?.name || "Unknown",
    },
    publicKey: paystackPublicKey,
    text: isProcessing ? "Processing..." : "Pay with Mobile Money",
    onSuccess: async (reference) => {
      try {
        setIsProcessing(true);
        const res = await axios.get(
          `${apiBaseUrl}/api/paystack/verify/${reference.reference}`
        );

        if (res.data.success) {
          navigate("/payment-success", {
            state: {
              booking: res.data.booking,
              room,
              amount: res.data.booking.amount,
              network: res.data.booking.network,
              transactionId: res.data.booking.transactionId,
            },
          });
        } else {
          setError(res.data.message || "Payment verification failed.");
        }
      } catch (err) {
        setError("Verification failed. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    onClose: () => setError("Payment popup was closed."),
  };

  const handleValidation = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !phoneNumber || !network) {
      return setError("Please fill in all fields.");
    }

    const validGhanaPattern =
      /^0(24|54|55|59|20|50|26|56|27|57|28|58|29|23|53)\d{7}$/;
    if (!validGhanaPattern.test(phoneNumber)) {
      return setError("Enter a valid Ghanaian mobile money number.");
    }

    if (!paystackPublicKey) {
      return setError("Paystack public key is missing. Check .env file.");
    }

    // Proceed to open Paystack Button
    document.getElementById("paystack-btn").click();
  };

  if (!room) {
    return (
      <motion.div
        className="payment-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2>No Room Selected</h2>
      </motion.div>
    );
  }

  return (
    <div className="app-container">
      <header className="main-header">
        <h1 className="logo">Yafafa</h1>
        <nav className="main-nav">
          <a href="/">Home</a>
          <a href="/rooms">Rooms</a>
          <a href="/contact">Contact</a>
          <a href="/book">Book Now</a>
        </nav>
      </header>

      <motion.div
        className="payment-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="payment-card"
          initial={{ y: 20, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.7,
            type: "spring",
            stiffness: 100,
          }}
        >
          <div className="payment-header">
            <motion.h2
              className="payment-title"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Book: <span className="room-name">{room.name}</span>
            </motion.h2>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Price:{" "}
              <span className="price-display">
                GHS {(room.price * 1).toFixed(1)}
              </span>
            </motion.p>
          </div>

          <div className="payment-content">
            <form className="payment-form" onSubmit={handleValidation}>
              <motion.div
                className="form-group"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  required
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <label>Mobile Money Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 0241234567"
                  value={phoneNumber}
                  onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, ""))
                  }
                  className="form-input"
                  maxLength="10"
                  required
                />
              </motion.div>

              <motion.div
                className="form-group"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <label>Network Provider</label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="MTN">MTN</option>
                  <option value="Vodafone">Vodafone</option>
                  <option value="AirtelTigo">AirtelTigo</option>
                </select>
              </motion.div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    className="error-message"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                className="payment-btn"
                disabled={isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
              >
                {isProcessing ? (
                  <>
                    <span className="processing-spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <span className="payment-icon">💳</span>
                    Proceed to Paystack
                  </>
                )}
              </motion.button>

              {/* Hidden Paystack Button that gets clicked programmatically */}
              <div style={{ display: "none" }}>
                <PaystackButton {...componentProps} id="paystack-btn" />
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Payment;
