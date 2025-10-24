import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Package,
  DollarSign,
  MessageCircle,
  Activity,
} from "lucide-react";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalContacts: 0,
    averageOrderValue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [recentContacts, setRecentContacts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [orderStatusSummary, setOrderStatusSummary] = useState({});
  const [performance, setPerformance] = useState({
    revenueChange: 0,
    ordersChange: 0,
    avgChange: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch products
      const productsRes = await axios.get(`${backendUrl}/api/product/list`);
      const products = productsRes.data.products || [];

      // 2. Fetch orders from CORRECT admin route
      let orders = [];
      try {
        const ordersRes = await axios.get(`${backendUrl}/api/order/admin`, {
          headers: { token },
        });
        orders = ordersRes.data?.orders || [];
      } catch (err) {
        console.warn("Orders fetch failed:", err.message);
      }

      // 3. Fetch contacts from CORRECT route
      let contacts = [];
      try {
        const contactsRes = await axios.get(`${backendUrl}/api/contact`, {
          headers: { token },
        });
        // Handle different response formats
        if (Array.isArray(contactsRes.data)) {
          contacts = contactsRes.data;
        } else if (contactsRes.data?.contacts) {
          contacts = contactsRes.data.contacts;
        } else if (contactsRes.data?.data) {
          contacts = contactsRes.data.data;
        }
      } catch (err) {
        console.warn("Contacts fetch failed:", err.message);
      }

      // === Process Data ===
      const dailySales = {};
      const today = new Date();
      const last7Days = new Date(today);
      last7Days.setDate(today.getDate() - 7);

      orders
        .filter((o) => new Date(o.date) >= last7Days)
        .forEach((o) => {
          const date = new Date(o.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          dailySales[date] = (dailySales[date] || 0) + (o.amount || 0);
        });

      const formattedChartData = Object.entries(dailySales).map(
        ([date, sales]) => ({ date, sales })
      );

      const statusCount = orders.reduce((acc, o) => {
        const status = o.status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const totalRevenue = orders.reduce((a, o) => a + (o.amount || 0), 0);
      const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;

      // Performance (this month vs last month)
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
      const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

      const getMonthOrders = (month, year) =>
        orders.filter(
          (o) =>
            new Date(o.date).getMonth() === month &&
            new Date(o.date).getFullYear() === year
        );

      const thisMonthOrders = getMonthOrders(thisMonth, thisYear);
      const lastMonthOrders = getMonthOrders(lastMonth, lastMonthYear);

      const thisRevenue = thisMonthOrders.reduce((a, o) => a + (o.amount || 0), 0);
      const lastRevenue = lastMonthOrders.reduce((a, o) => a + (o.amount || 0), 0);
      const thisAvg = thisMonthOrders.length > 0 ? thisRevenue / thisMonthOrders.length : 0;
      const lastAvg = lastMonthOrders.length > 0 ? lastRevenue / lastMonthOrders.length : 0;

      const pctChange = (thisVal, lastVal) =>
        lastVal === 0 && thisVal === 0 ? 0 : lastVal === 0 ? 100 : ((thisVal - lastVal) / lastVal) * 100;

      setPerformance({
        revenueChange: pctChange(thisRevenue, lastRevenue),
        ordersChange: pctChange(thisMonthOrders.length, lastMonthOrders.length),
        avgChange: pctChange(thisAvg, lastAvg),
      });

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        totalContacts: contacts.length,
        averageOrderValue: avgOrder,
      });

      setRecentOrders(orders.slice(0, 5));
      setRecentContacts(contacts.slice(0, 5));
      setChartData(formattedChartData);
      setOrderStatusSummary(statusCount);
    } catch (err) {
      console.error("Dashboard error:", err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchStats();
    }
  }, [token]);

  const StatCard = ({ title, value, color, icon: Icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl shadow-lg p-6 text-center border-t-4 border-${color}-400 bg-white/60 backdrop-blur-md hover:scale-105 transition-transform`}
    >
      <div className="flex justify-center mb-2">
        <Icon className={`text-${color}-600 w-7 h-7`} />
      </div>
      <h2 className={`text-lg font-semibold text-${color}-700`}>{title}</h2>
      <p className="text-3xl font-bold mt-2">
        {typeof value === "number" ? (
          <CountUp end={value} duration={1.5} separator="," decimals={title.includes("Avg") ? 2 : 0} />
        ) : (
          value
        )}
      </p>
    </motion.div>
  );

  const PerfCard = ({ title, value, change }) => {
    const positive = change >= 0;
    return (
      <div className="p-5 rounded-xl bg-white/60 backdrop-blur-md shadow text-center">
        <p className="font-semibold text-gray-700">{title}</p>
        <p className="text-2xl font-bold mt-1">
          {currency}
          <CountUp end={value} duration={1.2} separator="," decimals={2} />
        </p>
        <p
          className={`mt-2 flex justify-center items-center gap-1 text-sm font-medium ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(change).toFixed(1)}%
        </p>
      </div>
    );
  };

  if (loading && stats.totalProducts === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <div className="text-2xl text-blue-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        <StatCard title="Products" value={stats.totalProducts} color="blue" icon={Package} />
        <StatCard title="Orders" value={stats.totalOrders} color="green" icon={ShoppingBag} />
        <StatCard title="Revenue" value={stats.totalRevenue} color="red" icon={DollarSign} />
        <StatCard title="Avg Order" value={stats.averageOrderValue} color="purple" icon={Activity} />
        <StatCard title="Messages" value={stats.totalContacts} color="sky" icon={MessageCircle} />
      </div>

      {/* Sales Chart */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow mb-10">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">
          Sales Trend (Last 7 Days)
        </h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`${currency}${value}`, "Sales"]} />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#22c55e", r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No sales data available</p>
        )}
      </div>

      {/* Performance Comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <PerfCard
          title="Revenue (vs last month)"
          value={stats.totalRevenue}
          change={performance.revenueChange}
        />
        <PerfCard
          title="Orders (vs last month)"
          value={stats.totalOrders}
          change={performance.ordersChange}
        />
        <PerfCard
          title="Avg Order Value"
          value={stats.averageOrderValue}
          change={performance.avgChange}
        />
      </div>

      {/* Status Summary */}
      <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow mb-10">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Order Status Summary</h2>
        {Object.keys(orderStatusSummary).length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {Object.entries(orderStatusSummary).map(([status, count]) => (
              <div
                key={status}
                className="p-4 rounded-lg bg-gradient-to-br from-blue-100 to-green-100 shadow hover:shadow-lg"
              >
                <p className="font-semibold text-gray-700">{status}</p>
                <p className="text-2xl font-bold text-blue-600">{count}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No order status data</p>
        )}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <table className="w-full text-sm text-gray-700 border-collapse">
              <thead>
                <tr className="bg-green-100 text-left">
                  <th className="p-2">Order ID</th>
                  <th className="p-2">Amount</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-2">{order._id?.slice(-6) || "N/A"}</td>
                    <td className="p-2">
                      {currency}
                      {order.amount || 0}
                    </td>
                    <td
                      className={`p-2 font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Pending"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }`}
                    >
                      {order.status || "Unknown"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent orders</p>
          )}
        </div>

        {/* Recent Messages */}
        <div className="bg-white/70 backdrop-blur-md rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">Recent Messages</h2>
          {recentContacts.length > 0 ? (
            <ul className="space-y-3">
              {recentContacts.map((msg) => (
                <li
                  key={msg._id}
                  className="p-3 border rounded-lg hover:bg-blue-50 transition"
                >
                  <p className="font-semibold text-gray-800">{msg.name || "Anonymous"}</p>
                  <p className="text-sm text-gray-500">{msg.email || "No email"}</p>
                  <p className="text-gray-700 mt-1 truncate">{msg.message || "No message"}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center py-4">No new messages</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;