import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/Axios";
import { FaTimesCircle } from "react-icons/fa";

const Cart = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // 1. Loading state add ki gayi hai
  const [loading, setLoading] = useState(true); 
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Auth status check hone tak wait karein
    if (authLoading) return;

    // User missing hone par login screen par bheinjen
    if (!user) {
      navigate("/login");
      return;
    }

    myBooking();
  }, [authLoading, user, navigate]);

  const myBooking = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      // 2. Ab 'setLoading' properly work karega
      setLoading(false); 
    }
  };

 const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      // Backend Delete API hit karein
      await api.delete(`/bookings/${id}`);
      
      // UI State se item ko instantly remove karein
      setBookings((prevBookings) => prevBookings.filter((item) => item._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Error cancelling booking");
    }
  };
  // 3. Auth ya API loading state guard
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 font-medium text-sm animate-pulse">
          Loading bookings...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No bookings found.</p>
          <Link
            to="/"
            className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:underline"
          >
            Explore Events & Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col"
            >
              <div className="p-6 border-b border-gray-50 flex-grow">
                {booking.productId ? (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">
                        {booking.productId.title}
                      </h3>
                      <div className="flex flex-col gap-1 items-end">
                        <span
                          className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" &&
                          booking.paymentStatus && (
                            <span
                              className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${
                                booking.paymentStatus === "paid"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {booking.paymentStatus.replace("_", " ")}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-4 space-y-1">
                      <p>
                        <strong className="text-gray-700">Date:</strong>{" "}
                        {booking.productId.date
                          ? new Date(booking.productId.date).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        <strong className="text-gray-700">Amount:</strong>{" "}
                        {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                      </p>
                      <p>
                        <strong className="text-gray-700">Requested:</strong>{" "}
                        {booking.bookedAt
                          ? new Date(booking.bookedAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-red-500 italic">
                    Product/Event details unavailable
                  </p>
                )}
              </div>

              <div className="p-4 bg-gray-50 flex justify-between items-center shrink-0">
                {booking.productId && booking.status !== "cancelled" ? (
                  <>
                    <Link
                      to={`/products/${booking.productId._id}`}
                      className="text-gray-900 font-semibold text-sm hover:underline"
                    >
                      View Event
                    </Link>
                    <button
                      onClick={() => cancelBooking(booking._id)}
                      className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
                    >
                      <FaTimesCircle /> Cancel
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center text-sm text-gray-500 italic">
                    Booking Cancelled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cart;