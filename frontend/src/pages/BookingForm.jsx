import { useEffect, useState } from "react";

const BookingForm = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings");
        if (!res.ok) throw new Error("Failed to fetch bookings");

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Unable to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Bookings</h2>
      <ul>
        {bookings.map((booking, i) => (
          <li key={i}>{JSON.stringify(booking)}</li>
        ))}
      </ul>
    </div>
  );
};

export default BookingForm;




