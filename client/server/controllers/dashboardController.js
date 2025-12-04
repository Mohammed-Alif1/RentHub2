import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

// Get owner dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const ownerId = req.userId;

    // Get total cars count
    const totalCars = await Car.countDocuments({ owner: ownerId });

    // Get all bookings for owner's cars
    const allBookings = await Booking.find({ owner: ownerId });
    const totalBookings = allBookings.length;

    // Count bookings by status
    const pendingBookings = await Booking.countDocuments({
      owner: ownerId,
      status: "pending",
    });

    const completedBookings = await Booking.countDocuments({
      owner: ownerId,
      status: "completed",
    });

    const confirmedBookings = await Booking.countDocuments({
      owner: ownerId,
      status: "confirmed",
    });

    // Calculate monthly revenue (current month)
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const monthlyBookings = await Booking.find({
      owner: ownerId,
      status: { $in: ["confirmed", "completed"] },
      createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth },
    });

    const monthlyRevenue = monthlyBookings.reduce(
      (sum, booking) => sum + booking.price,
      0
    );

    // Calculate total revenue
    const totalRevenueBookings = await Booking.find({
      owner: ownerId,
      status: { $in: ["confirmed", "completed"] },
    });
    const totalRevenue = totalRevenueBookings.reduce(
      (sum, booking) => sum + booking.price,
      0
    );

    // Get recent bookings (last 5)
    const recentBookings = await Booking.find({ owner: ownerId })
      .populate(
        "car",
        "brand model image category location year seating_capacity transmission"
      )
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalCars,
        totalBookings,
        pendingBookings,
        completedBookings,
        confirmedBookings,
        monthlyRevenue,
        totalRevenue,
        recentBookings,
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching dashboard statistics",
    });
  }
};

// Get revenue analytics (optional - for charts)
export const getRevenueAnalytics = async (req, res) => {
  try {
    const ownerId = req.userId;
    const { period = "monthly" } = req.query; // monthly, yearly

    let groupBy;
    let dateRange;

    if (period === "yearly") {
      // Last 12 months
      dateRange = new Date();
      dateRange.setMonth(dateRange.getMonth() - 12);
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else {
      // Last 30 days
      dateRange = new Date();
      dateRange.setDate(dateRange.getDate() - 30);
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    }

    const revenueData = await Booking.aggregate([
      {
        $match: {
          owner: ownerId,
          status: { $in: ["confirmed", "completed"] },
          createdAt: { $gte: dateRange },
        },
      },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$price" },
          bookingCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      period,
      data: revenueData,
    });
  } catch (error) {
    console.error("Get revenue analytics error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching revenue analytics",
    });
  }
};
