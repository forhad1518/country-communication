"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Briefcase,
  FileText,
  Eye,
  Clock,
  ArrowRight,
  Globe,
  Activity,
  Download,
  CheckCircle,
} from "lucide-react";

// Types
type DashboardStats = {
  totalBlogs: number;
  totalPortfolio: number;
  totalClients: number;
  completedProjects: number;
  ongoingProjects: number;
  todayVisitors: number;
  totalVisitors: number;
  monthlyVisitors: number;
  yearlyVisitors: number;
};

type PageView = {
  page: string;
  views: number;
  percentage: number;
  trend: "up" | "down";
};

type MonthlyData = {
  month: string;
  projects: number;
  visitors: number;
  blogs: number;
};

type RecentActivity = {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: any;
  bgColor: string;
  textColor: string;
};

// Sample Data
const dashboardStats: DashboardStats = {
  totalBlogs: 48,
  totalPortfolio: 156,
  totalClients: 89,
  completedProjects: 142,
  ongoingProjects: 14,
  todayVisitors: 256,
  totalVisitors: 45280,
  monthlyVisitors: 8750,
  yearlyVisitors: 45280,
};

const monthlyData: MonthlyData[] = [
  { month: "Jan", projects: 12, visitors: 3200, blogs: 4 },
  { month: "Feb", projects: 15, visitors: 4100, blogs: 5 },
  { month: "Mar", projects: 18, visitors: 5200, blogs: 6 },
  { month: "Apr", projects: 14, visitors: 3800, blogs: 4 },
  { month: "May", projects: 20, visitors: 6100, blogs: 7 },
  { month: "Jun", projects: 16, visitors: 4500, blogs: 5 },
  { month: "Jul", projects: 22, visitors: 7000, blogs: 8 },
  { month: "Aug", projects: 19, visitors: 5800, blogs: 6 },
  { month: "Sep", projects: 25, visitors: 8200, blogs: 9 },
  { month: "Oct", projects: 21, visitors: 6500, blogs: 7 },
  { month: "Nov", projects: 28, visitors: 9100, blogs: 10 },
  { month: "Dec", projects: 30, visitors: 10500, blogs: 12 },
];

const topPages: PageView[] = [
  { page: "/ (Homepage)", views: 12500, percentage: 28, trend: "up" },
  { page: "/portfolio", views: 8900, percentage: 20, trend: "up" },
  { page: "/services", views: 6200, percentage: 14, trend: "down" },
  { page: "/blog", views: 5400, percentage: 12, trend: "up" },
  { page: "/contact", views: 3800, percentage: 8, trend: "up" },
  { page: "/about", views: 2900, percentage: 6, trend: "down" },
];

const recentActivities: RecentActivity[] = [
  {
    id: "1",
    type: "blog",
    title: "New Blog Published",
    description: "How to Design an Attractive Exhibition Booth",
    time: "2 mins ago",
    icon: FileText,
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  {
    id: "2",
    type: "portfolio",
    title: "Portfolio Updated",
    description: "Samsung Galaxy Experience Zone",
    time: "15 mins ago",
    icon: Briefcase,
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  {
    id: "3",
    type: "client",
    title: "New Client Registered",
    description: "TechVision Ltd. signed up",
    time: "1 hour ago",
    icon: Users,
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  {
    id: "4",
    type: "visitor",
    title: "Traffic Spike",
    description: "256 visitors in last hour",
    time: "2 hours ago",
    icon: TrendingUp,
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  {
    id: "5",
    type: "portfolio",
    title: "Project Completed",
    description: "Dubai Expo Booth Installation",
    time: "3 hours ago",
    icon: CheckCircle,
    bgColor: "bg-emerald-100",
    textColor: "text-emerald-600",
  },
];

const deviceData = [
  { device: "Desktop", percentage: 55, color: "#3B82F6" },
  { device: "Mobile", percentage: 35, color: "#22C55E" },
  { device: "Tablet", percentage: 10, color: "#A855F7" },
];

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  link,
}: {
  title: string;
  value: number | string;
  icon: any;
  trend?: number;
  link?: string;
}) => {
  const content = (
    <div className="bg-white rounded-xl border shadow-sm p-5 hover:shadow-md transition-shadow h-full">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold text-gray-800">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
              )}
              <span
                className={`text-xs font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {Math.abs(trend)}% from last month
              </span>
            </div>
          )}
          {link && (
            <Link
              href={link}
              className="mt-3 text-xs text-primary hover:text-primary-hover transition flex items-center gap-1"
            >
              View Details <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="p-3 rounded-xl bg-gray-50 shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );

  if (link) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {content}
    </motion.div>
  );
};

// Simple Bar Chart Component
const SimpleBarChart = ({
  data,
  maxValue,
}: {
  data: MonthlyData[];
  maxValue: number;
}) => {
  return (
    <div className="flex items-end gap-1 md:gap-2 h-48 mt-4">
      {data.map((item, i) => {
        const heightPercent =
          maxValue > 0 ? (item.projects / maxValue) * 100 : 0;
        return (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(heightPercent, 2)}%` }}
              transition={{ duration: 0.6, delay: i * 0.03 }}
              className="w-full bg-primary rounded-t-md relative group cursor-pointer hover:bg-primary-hover transition-colors"
              style={{ minHeight: "4px" }}
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                {item.projects} projects
              </div>
            </motion.div>
            <span className="text-xs text-gray-500 hidden sm:block">
              {item.month}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// Simple Line Chart Component
const SimpleLineChart = ({
  data,
  maxValue,
}: {
  data: MonthlyData[];
  maxValue: number;
}) => {
  const width = 100;
  const height = 160;
  const padding = 10;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((item, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (item.visitors / maxValue) * chartHeight;
    return `${x},${y}`;
  });

  const linePath = `M${points.join(" L")}`;

  // Create area path
  const firstPoint = points[0].split(",");
  const lastPoint = points[points.length - 1].split(",");
  const areaPath = `M${firstPoint[0]},${height - padding} L${linePath.replace("M", "")} L${lastPoint[0]},${height - padding} Z`;

  return (
    <div className="relative mt-4">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-48"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const y = padding + chartHeight * (1 - ratio);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#f0f0f0"
                strokeWidth="0.5"
              />
              <text x="2" y={y + 3} className="text-[8px] fill-gray-400">
                {Math.round(maxValue * ratio).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        <path d={areaPath} fill="url(#gradient)" opacity="0.3" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#009999"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {data.map((item, i) => {
          const [cx, cy] = points[i].split(",");
          return (
            <g key={i}>
              <circle
                cx={cx}
                cy={cy}
                r="3"
                fill="white"
                stroke="#009999"
                strokeWidth="2"
                className="cursor-pointer"
              />
              <title>{`${item.month}: ${item.visitors.toLocaleString()} visitors`}</title>
            </g>
          );
        })}

        <defs>
          <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#009999" stopOpacity="1" />
            <stop offset="100%" stopColor="#009999" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* X-axis labels */}
      <div className="flex justify-between mt-1 px-2">
        {data
          .filter((_, i) => i % 2 === 0)
          .map((item, i) => (
            <span key={i} className="text-xs text-gray-500">
              {item.month}
            </span>
          ))}
      </div>
    </div>
  );
};

// Simple Donut Chart
const SimpleDonutChart = ({
  data,
}: {
  data: { device: string; percentage: number; color: string }[];
}) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, d) => sum + d.percentage, 0);

  let offset = 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
          {data.map((item, i) => {
            const segmentLength = (item.percentage / total) * circumference;
            const currentOffset = offset;
            offset += segmentLength;

            return (
              <circle
                key={i}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="24"
                strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
                strokeDashoffset={-currentOffset}
                className="transition-all duration-500"
              />
            );
          })}
          {/* Inner circle for donut effect */}
          <circle cx="80" cy="80" r="45" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">{total}%</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2 w-full">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-gray-600">{item.device}</span>
            <span className="text-sm font-medium text-gray-800 ml-auto">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Component
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<"monthly" | "yearly">("monthly");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const maxProjects = Math.max(...monthlyData.map((d) => d.projects), 1);
  const maxVisitors = Math.max(...monthlyData.map((d) => d.visitors), 1);
  const completionRate =
    dashboardStats.totalPortfolio > 0
      ? Math.round(
          (dashboardStats.completedProjects / dashboardStats.totalPortfolio) *
            100,
        )
      : 0;

  const displayData =
    timeRange === "monthly" ? monthlyData.slice(-6) : monthlyData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Welcome back! Here's what's happening.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("monthly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              timeRange === "monthly"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeRange("yearly")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              timeRange === "yearly"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      {/* Stats Cards - Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Blogs"
          value={dashboardStats.totalBlogs}
          icon={FileText}
          trend={12}
          link="/admin/blog"
        />
        <StatCard
          title="Total Portfolio"
          value={dashboardStats.totalPortfolio}
          icon={Briefcase}
          trend={8}
          link="/admin/portfolio"
        />
        <StatCard
          title="Total Clients"
          value={dashboardStats.totalClients}
          icon={Users}
          trend={15}
          link="/admin/users"
        />
        <StatCard
          title="Completed Projects"
          value={dashboardStats.completedProjects}
          icon={CheckCircle}
          trend={5}
        />
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Visitors"
          value={dashboardStats.todayVisitors}
          icon={Eye}
        />
        <StatCard
          title="Monthly Visitors"
          value={dashboardStats.monthlyVisitors}
          icon={Globe}
          trend={22}
        />
        <StatCard
          title="Ongoing Projects"
          value={dashboardStats.ongoingProjects}
          icon={Clock}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Activity}
          trend={3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Projects Chart */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Projects Overview
              </h3>
              <p className="text-sm text-gray-500">
                {timeRange === "monthly" ? "Last 6 months" : "Yearly"} completed
                projects
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <SimpleBarChart data={displayData} maxValue={maxProjects} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Total: {dashboardStats.completedProjects} projects
            </span>
            <span className="text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +18% this year
            </span>
          </div>
        </div>

        {/* Visitors Chart */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Website Traffic
              </h3>
              <p className="text-sm text-gray-500">
                {timeRange === "monthly" ? "Last 6 months" : "Yearly"} visitor
                statistics
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition">
              <Download className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          <SimpleLineChart data={displayData} maxValue={maxVisitors} />
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Total: {dashboardStats.yearlyVisitors.toLocaleString()} visitors
            </span>
            <span className="text-green-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" /> +22% this year
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Top Pages
          </h3>
          <div className="space-y-4">
            {topPages.map((page, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {page.page}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${page.percentage}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${page.trend === "up" ? "bg-primary" : "bg-red-400"}`}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-14 text-right">
                      {page.views.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Activity
            </h3>
            <button className="text-xs text-primary hover:text-primary-hover transition">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className={`p-2 rounded-lg ${activity.bgColor} shrink-0`}>
                  <activity.icon className={`w-4 h-4 ${activity.textColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800">
                    {activity.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution */}
        <div className="lg:col-span-1 bg-white rounded-xl border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Device Distribution
          </h3>
          <SimpleDonutChart data={deviceData} />
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Add Blog",
            icon: FileText,
            link: "/admin/blog/add",
            color: "bg-blue-500 hover:bg-blue-600",
          },
          {
            label: "Add Portfolio",
            icon: Briefcase,
            link: "/admin/portfolio/add",
            color: "bg-purple-500 hover:bg-purple-600",
          },
          {
            label: "Manage Users",
            icon: Users,
            link: "/admin/users",
            color: "bg-green-500 hover:bg-green-600",
          },
          {
            label: "View Website",
            icon: Globe,
            link: "/",
            color: "bg-orange-500 hover:bg-orange-600",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            <Link href={item.link}>
              <div className="bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-all cursor-pointer group h-full">
                <div
                  className={`p-2.5 rounded-lg ${item.color} w-fit mb-3 transition-colors`}
                >
                  <item.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-medium text-gray-800 group-hover:text-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500 mt-1">Quick action</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
