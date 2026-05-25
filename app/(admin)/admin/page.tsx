"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";
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
  CheckCircle,
  Heart,
} from "lucide-react";

// Types
type DashboardStats = {
  totalBlogs: number;
  totalPortfolio: number;
  totalClients: number;
  completedProjects: number;
  ongoingProjects: number;
  totalViews: number;
  totalLikes: number;
};

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

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      {content}
    </motion.div>
  );
};

// ===== MAIN COMPONENT =====
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalPortfolio: 0,
    totalClients: 0,
    completedProjects: 0,
    ongoingProjects: 0,
    totalViews: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);

  // ===== FETCH REAL DATA =====
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [blogRes, portfolioRes, userRes] = await Promise.all([
        axios
          .get("/api/blog?limit=1")
          .catch(() => ({ data: { pagination: { total: 0 } } })),
        axios
          .get("/api/portfolio?admin=true&status=all&limit=1")
          .catch(() => ({ data: { pagination: { total: 0 }, data: [] } })),
        axios
          .get("/api/users?limit=1")
          .catch(() => ({ data: { pagination: { total: 0 } } })),
      ]);

      // Get blog count
      const totalBlogs = blogRes.data?.pagination?.total || 0;

      // Get portfolio data
      const portfolioData = portfolioRes.data?.data || [];
      const totalPortfolio =
        portfolioRes.data?.pagination?.total || portfolioData.length || 0;
      const publishedPortfolio = portfolioData.filter(
        (p: any) => p.status === "published",
      ).length;
      const draftPortfolio = portfolioData.filter(
        (p: any) => p.status === "draft",
      ).length;

      // Calculate views and likes from all portfolios
      const allPortfolioRes = await axios
        .get("/api/portfolio?admin=true&status=all&limit=100")
        .catch(() => ({ data: { data: [] } }));
      const allPortfolios = allPortfolioRes.data?.data || [];
      const totalViews = allPortfolios.reduce(
        (sum: number, p: any) => sum + (p.views || 0),
        0,
      );
      const totalLikes = allPortfolios.reduce(
        (sum: number, p: any) => sum + (p.likes || 0),
        0,
      );

      // Get user count
      const totalClients = userRes.data?.pagination?.total || 0;

      setStats({
        totalBlogs,
        totalPortfolio,
        totalClients,
        completedProjects: publishedPortfolio,
        ongoingProjects: draftPortfolio,
        totalViews,
        totalLikes,
      });
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const completionRate =
    stats.totalPortfolio > 0
      ? Math.round((stats.completedProjects / stats.totalPortfolio) * 100)
      : 0;

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
        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer"
        >
          <Globe className="w-4 h-4" /> View Website
        </Link>
      </div>

      {/* Stats Cards - Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          icon={FileText}
          link="/admin/blog"
        />
        <StatCard
          title="Total Portfolio"
          value={stats.totalPortfolio}
          icon={Briefcase}
          link="/admin/portfolio"
        />
        <StatCard
          title="Total Users"
          value={stats.totalClients}
          icon={Users}
          link="/admin/users"
        />
        <StatCard
          title="Completed Projects"
          value={stats.completedProjects}
          icon={CheckCircle}
        />
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Views" value={stats.totalViews} icon={Eye} />
        <StatCard title="Total Likes" value={stats.totalLikes} icon={Heart} />
        <StatCard
          title="Ongoing Projects"
          value={stats.ongoingProjects}
          icon={Clock}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={Activity}
        />
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
