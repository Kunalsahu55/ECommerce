const express = require("express");
const router = express.Router();
const {
  bookProduct,
  getAllBookings,
  confirmBooking,
  getMyBookings,
  cancelBooking,
} = require("../controllers/booking.controllers");
const { protect } = require("../middleware/auth.middleware"); // Apka Auth middleware

// User routes
router.post("/", protect, bookProduct);
router.get("/my", protect, getMyBookings);

// Admin routes
router.get("/", protect, getAllBookings); // GET /api/bookings -> Admin Dashboard
router.put("/:id/confirm", protect, confirmBooking); // PUT /api/bookings/:id/confirm
router.delete("/:id", protect, cancelBooking);

module.exports = router;