const Booking = require("../model/booking.model");
const Product = require("../model/product.model");

// 1. BOOK PRODUCT
const bookProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const userId = req.user._id || req.user.id;

    const product = await Product.findById(productId).lean().exec();
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingBooking = await Booking.findOne({ userId, productId }).lean().exec();
    if (existingBooking && existingBooking.status !== "cancelled") {
      return res.status(400).json({ message: "Already booked or pending" });
    }

    const booking = await Booking.create({
      userId,
      productId,
      status: "pending",
      paymentStatus: "not_paid",
      amount: product.price || 0,
    });

    return res.status(201).json({
      message: "Booking request submitted successfully",
      booking,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 2. GET ALL BOOKINGS (Admin Only) - [NEW ADDITION]
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "username email name")
      .populate("productId")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("getAllBookings Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 3. CONFIRM / UPDATE BOOKING STATUS (Admin)
const confirmBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body; // status: 'confirmed' or 'cancelled'
    const booking = await Booking.findById(req.params.id)
      .populate("userId", "username email name")
      .populate("productId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) {
      booking.status = status;
    } else {
      booking.status = "confirmed";
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();

    return res.json({ message: "Booking status updated successfully", booking });
  } catch (error) {
    console.error("confirmBooking Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 4. GET MY BOOKINGS (Logged-in User)
const getMyBookings = async (req, res) => {
  try {
    const currentUserId = req.user._id || req.user.id;

    const bookings = await Booking.find({ userId: currentUserId })
      .populate("productId")
      .sort({ createdAt: -1 });

    return res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getMyBookings:", error);
    return res.status(500).json({ message: "Server error fetching user bookings" });
  }
};

// 5. CANCEL BOOKING
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const userId = req.user._id || req.user.id;

    if (booking.userId.toString() !== userId.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error("cancelBooking Error:", error);
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  bookProduct,
  getAllBookings, // <-- Exported
  confirmBooking,
  getMyBookings,
  cancelBooking,
};