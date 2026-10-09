import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/Axios";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaUser, FaBox } from "react-icons/fa";

const Admin = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [actionLoading, setActionLoading] = useState(null);

  // Fetch all bookings for admin
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // Handle Confirm or Cancel Action
  const handleUpdateStatus = async (bookingId, status, paymentStatus) => {
    try {
      setActionLoading(bookingId);
      const res = await api.put(`/bookings/${bookingId}/confirm`, {
        status,
        paymentStatus,
      });

      // Local state update
      setBookings((prev) =>
        prev.map((item) => (item._id === bookingId ? res.data.booking : item))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm animate-pulse">
          Loading Admin Control Panel...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-4 gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Control Panel</h1>
          <p className="text-slate-600 text-sm mt-1">
            Welcome back, <span className="font-semibold text-indigo-600">{user?.username}</span>
          </p>
        </div>
        <div className="text-sm bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium self-start sm:self-auto">
          Total Bookings: {bookings.length}
        </div>
      </div>

      {/* Bookings Table / List */}
      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 font-medium">No customer bookings found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Product / Event</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 transition">
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaUser className="text-slate-400" />
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.userId?.username || item.userId?.name || "N/A"}
                          </p>
                          <p className="text-xs text-slate-500">{item.userId?.email || "No email"}</p>
                        </div>
                      </div>
                    </td>

                    {/* Product Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FaBox className="text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {item.productId?.title || item.productId?.name || "Product Deleted"}
                          </p>
                          <p className="text-xs text-slate-400">
                            Requested: {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="p-4 font-semibold text-slate-900">
                      ₹{item.amount}
                    </td>

                    {/* Booking Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
                          item.status === "confirmed"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.status === "cancelled"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* Payment Status Badge */}
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
                          item.paymentStatus === "paid"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.paymentStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      {actionLoading === item._id ? (
                        <span className="text-xs text-slate-400 animate-pulse">Updating...</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          {item.status !== "confirmed" && (
                            <button
                              onClick={() => handleUpdateStatus(item._id, "confirmed", "paid")}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-medium flex items-center gap-1 transition"
                            >
                              <FaCheckCircle /> Confirm & Paid
                            </button>
                          )}
                          {item.status !== "cancelled" && (
                            <button
                              onClick={() => handleUpdateStatus(item._id, "cancelled", "not_paid")}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-medium flex items-center gap-1 transition"
                            >
                              <FaTimesCircle /> Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;