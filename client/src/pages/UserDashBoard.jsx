import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTicketAlt,
  FaUser,
  FaEnvelope,
  FaCalendarCheck,
  FaArrowRight,
  FaShoppingBag,
} from "react-icons/fa";

const UserDashBoard = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user ) {
      navigate("/login");
      return;
    } else {
      setLoading(false);
    }

    if (user.role === 'admin') {
    navigate('/admin');
    return;
  }
  }, [user, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-semibold text-sm animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // User avatar first letter
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Profile Banner / Header Card */}
        <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm transition-all hover:shadow-md">
          {/* Subtle Background Accent Decor */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            {/* Avatar Badge */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-extrabold shadow-lg shadow-indigo-500/20 shrink-0 transform -rotate-1 hover:rotate-0 transition-transform">
              {userInitial}
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Welcome back, {user?.username || "User"}!
                  </h1>
                  <p className="text-slate-500 text-sm font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 animate-pulse"></span>
                    Active User Dashboard
                  </p>
                </div>

                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition active:scale-95 shadow-sm"
                >
                  <FaShoppingBag /> My Cart
                </Link>
              </div>

              {/* User Metadata Pills */}
              <div className="pt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
                {user?.email && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 font-medium">
                    <FaEnvelope className="text-slate-400" /> {user.email}
                  </span>
                )}
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100/80 font-medium capitalize">
                  <FaUser className="text-slate-400" /> Role: {user?.role || "Member"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Overview Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-slate-300 transition">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Quick Access
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-1">Bookings & Orders</h3>
            </div>
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl font-bold">
              <FaTicketAlt />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-slate-300 transition">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Account Status
              </p>
              <h3 className="text-lg font-bold text-emerald-600 mt-1">Verified</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl font-bold">
              <FaCalendarCheck />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between hover:border-slate-300 transition sm:col-span-2 lg:col-span-1">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Explore Events
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-1">Discover New Items</h3>
            </div>
            <Link
              to="/"
              className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center text-lg hover:bg-slate-800 transition"
            >
              <FaArrowRight />
            </Link>
          </div>
        </div>

        {/* Main Section Header & Action */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                <FaTicketAlt className="text-indigo-600" /> My Booking Requests
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                View all your reserved items, tickets, and booking history in one place.
              </p>
            </div>

            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              Manage Bookings <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* Booking Cards Placeholder / Embed Area */}
          <div className="pt-8 text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 text-xl">
              <FaTicketAlt />
            </div>
            <h4 className="text-base font-bold text-slate-800">Ready to view your bookings?</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
              You can check all active reservations, booking statuses, or cancel requests directly from your cart page.
            </p>
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-indigo-700 transition active:scale-95 shadow-md shadow-indigo-500/20"
            >
              Go to My Cart & Bookings
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserDashBoard;