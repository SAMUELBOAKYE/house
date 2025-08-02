import React from "react";
import { motion } from "framer-motion";
import BookingForm from "./BookingForm";
import RoomSummary from "./RoomSummary";
import "./BookingPage.css";

const BookingPage = () => {
  return (
    <div className="booking-page">
      <motion.section
        className="booking-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="hero-title">Book Your Stay at Yafafa</h1>
        <p className="hero-subtitle">
          Discover peace and style â€” choose your perfect room and complete your
          booking with ease.
        </p>
      </motion.section>

      <section className="booking-content">
        <motion.div
          className="booking-left"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <BookingForm />
        </motion.div>

        <motion.div
          className="booking-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
        >
<RoomSummary />
        </motion.div>
      </section>
    </div>
  );
};

export default BookingPage;

