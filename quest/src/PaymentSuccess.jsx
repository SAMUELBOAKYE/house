import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, amount, network, transactionId, booking } =
    location.state || {};

  if (!room || !transactionId) {
    return (
      <div className="payment-container">
        <div className="payment-error">
          <h2>Invalid Transaction</h2>
          <p>No valid transaction details found.</p>
          <button onClick={() => navigate("/")} className="payment-btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-success">
        <div className="success-icon animated-bounce">GO</div>
        <h2>Payment Successful!</h2>
        <p>
          Your booking for <strong>{room.name}</strong> has been confirmed.
        </p>

        <div className="transaction-details">
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">
              GHS {parseFloat(amount).toFixed(2)}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Transaction ID:</span>
            <span className="detail-value">{transactionId}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Paid with:</span>
            <span className="detail-value">{network} Mobile Money</span>
          </div>

          {booking?.customerEmail && (
            <div className="detail-row">
              <span className="detail-label">Confirmation sent to:</span>
              <span className="detail-value">{booking.customerEmail}</span>
            </div>
          )}
        </div>

        <div className="success-actions">
          <button onClick={() => navigate("/")} className="payment-btn">
            Back to Home
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="payment-btn secondary"
          >
            View Booking in Admin
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
