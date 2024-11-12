const order = require("../models/order.model");
const appointment = require("../models/appointment.model");
const pet = require("../models/pet.model");
const rescueRequest = require("../models/rescueRequest.model");

const generateDateArray = (days) => {
  const dates = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates.reverse();
};

const fillMissingDates = (data, dates) => {
  const dateMap = dates.reduce((acc, date) => {
    acc[date] = 0;
    return acc;
  }, {});

  data.forEach(item => {
    dateMap[item._id] = item.order;
  });

  return Object.keys(dateMap).map(date => ({
    _id: date,
    order: dateMap[date]
  }));
};

module.exports.getDashboard = async (req, res) => {
  try {
    const pendingOrders = await order.countDocuments({ order_status: "Chờ xử lý" });
    const pendingAppointments = await appointment.countDocuments({ doctorName: "anonymous" });
    const pendingPets = await pet.countDocuments({ adoptStatus: "Đang được yêu cầu" });
    const pendingRescueRequests = await rescueRequest.countDocuments({ requestStatus: "Chưa xử lý" });
    // const admin_account = Account.findById(id);
    const dashboard = {
      pendingOrders: pendingOrders,
      pendingAppointments: pendingAppointments,
      pendingPets: pendingPets,
      pendingRescueRequests: pendingRescueRequests,
    };
    res.status(200).json({ dashboard });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getGraphOrderData = async (req, res) => {
  try {
    const dates = generateDateArray(30);

    const ordersAll = await order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          order: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by day in ascending order
      }
    ]);

    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const generateMonthArray = (start, end) => {
      const months = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        months.push(currentDate.toISOString().split('T')[0].substring(0, 7));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
      return months;
    };

    const months = generateMonthArray(startOfYear, new Date());

    const ordersMonth = await order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          order: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by month in ascending order
      }
    ]);

    const fillMissingMonths = (data, months) => {
      const monthMap = months.reduce((acc, month) => {
        acc[month] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        monthMap[item._id] = item.order;
      });

      return Object.keys(monthMap).map(month => ({
        _id: month,
        order: monthMap[month]
      }));
    };

    const ordersMonthFilled = fillMissingMonths(ordersMonth, months);

    const unpaidOrders = await order.aggregate([
      {
        $match: {
          status: "Chưa thanh toán",
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          order: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by day in ascending order
      }
    ]);

    const nothandledOrders = await order.aggregate([
      {
        $match: {
          order_status: "Chờ xử lý",
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          order: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by day in ascending order
      }
    ]);

    const handledOrders = await order.aggregate([
      {
        $match: {
          order_status: "Đã xử lý",
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          order: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by day in ascending order
      }
    ]);

    const ordersAllFilled = fillMissingDates(ordersAll, dates);
    const unpaidOrdersFilled = fillMissingDates(unpaidOrders, dates);
    const nothandledOrdersFilled = fillMissingDates(nothandledOrders, dates);
    const handledOrdersFilled = fillMissingDates(handledOrders, dates);

    const graphData = {
      ordersAll: ordersAllFilled,
      ordersMonth: ordersMonthFilled,
      unpaidOrders: unpaidOrdersFilled,
      nothandledOrders: nothandledOrdersFilled,
      handledOrders: handledOrdersFilled,
    };

    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.getGraphRevenueData = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const revenue = await order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth
          },
          $or: [
            { payment_method: "Trực tiếp", order_status: "Đã hoàn thành" },
            { payment_method: "ZaloPay", order_status: { $ne: "Chờ thanh toán" } }
          ]
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$total_price" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const generateDateArray = (start, end) => {
      const dates = [];
      const currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(new Date(currentDate).toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const fillMissingDatesAndAccumulate = (data, dates) => {
      const dateMap = dates.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        dateMap[item._id] = item.totalRevenue;
      });

      let accumulatedRevenue = 0;
      return Object.keys(dateMap).map(date => {
        accumulatedRevenue += dateMap[date];
        return {
          _id: date,
          totalRevenue: accumulatedRevenue
        };
      });
    };

    const dates = generateDateArray(startOfMonth, new Date());
    const revenueFilled = fillMissingDatesAndAccumulate(revenue, dates);

    const graphData = {
      revenue: revenueFilled,
    };

    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports.getGraphPetData = async (req, res) => {
  try {
    const petsChuaCoChu = await pet.countDocuments({ adoptStatus: "Chưa có chủ" });
    const petsDangDuocYeuCau = await pet.countDocuments({ adoptStatus: "Đang được yêu cầu" });
    const petsDaCoChu = await pet.countDocuments({ adoptStatus: "Đã có chủ" });

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dates = generateDateArray((new Date() - startOfMonth) / (1000 * 60 * 60 * 24));

    const petsRequestsByDay = await pet.aggregate([
      {
        $match: {
          adoptStatus: "Đang được yêu cầu",
          updatedAt: {
            $gte: startOfMonth
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const fillMissingDates = (data, dates) => {
      const dateMap = dates.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        dateMap[item._id] = item.count;
      });

      return Object.keys(dateMap).map(date => ({
        _id: date,
        count: dateMap[date]
      }));
    };

    const petsRequestsByDayFilled = fillMissingDates(petsRequestsByDay, dates);

    const graphData = {
      petsChuaCoChu,
      petsDangDuocYeuCau,
      petsDaCoChu,
      petsRequestsByDay: petsRequestsByDayFilled
    };

    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports.getGraphRescueRequestData = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const dates = generateDateArray((new Date() - startOfMonth) / (1000 * 60 * 60 * 24));

    const rescueRequestsByDay = await rescueRequest.aggregate([
      {
        $match: {
          requestStatus: "Đang được yêu cầu",
          updatedAt: {
            $gte: startOfMonth
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const fillMissingDates = (data, dates) => {
      const dateMap = dates.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        dateMap[item._id] = item.count;
      });

      return Object.keys(dateMap).map(date => ({
        _id: date,
        count: dateMap[date]
      }));
    };

    const rescueRequestsByDayFilled = fillMissingDates(rescueRequestsByDay, dates);

    const graphData = {
      rescueRequestsByDay: rescueRequestsByDayFilled
    };

    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports.getGraphAppointmentData = async (req, res) => {
  try {
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const today = new Date();
    const dates = generateDateArray((today - startOfMonth) / (1000 * 60 * 60 * 24));

    const appointmentsByDay = await appointment.aggregate([
      {
        $match: {
          doctor_id: "anonymous",
          updatedAt: {
            $gte: startOfMonth
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const appointmentsPreview = await appointment.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startOfMonth
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const fillMissingDates = (data, dates) => {
      const dateMap = dates.reduce((acc, date) => {
        acc[date] = 0;
        return acc;
      }, {});

      data.forEach(item => {
        dateMap[item._id] = item.count;
      });

      return Object.keys(dateMap).map(date => ({
        _id: date,
        count: dateMap[date]
      }));
    };

    const appointmentsByDayFilled = fillMissingDates(appointmentsByDay, dates);
    const appointmentsPreviewFilled = fillMissingDates(appointmentsPreview, dates);

    const graphData = {
      appointmentsByDay: appointmentsByDayFilled,
      appointmentsPreview: appointmentsPreviewFilled
    };

    res.status(200).json(graphData);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};