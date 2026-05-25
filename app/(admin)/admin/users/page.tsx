"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Key,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

// Types
type UserRole = "admin" | "editor";

type UserData = {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
};

// Toast Component
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-white text-gray-800"
    >
      {type === "success" ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      {message}
    </motion.div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isCurrentUser,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isCurrentUser?: boolean;
}) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-96 p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {isCurrentUser ? "Cannot Delete" : "Confirm Delete"}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded cursor-pointer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {isCurrentUser ? (
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm">
                You cannot delete your own account while logged in.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3 mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete user{" "}
                <span className="font-semibold">"{userName}"</span>? This action
                cannot be undone.
              </p>
            </div>
          )}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm cursor-pointer"
            >
              {isCurrentUser ? "Close" : "Cancel"}
            </button>
            {!isCurrentUser && (
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm cursor-pointer"
              >
                Delete User
              </button>
            )}
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// User Form Modal (Add/Edit)
const UserFormModal = ({
  isOpen,
  onClose,
  onSave,
  user,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  user?: UserData | null;
  mode: "add" | "edit";
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "editor" as UserRole,
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && mode === "edit") {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        password: "",
        confirmPassword: "",
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "editor",
        password: "",
        confirmPassword: "",
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Invalid email format";
    }
    if (mode === "add") {
      if (!formData.password) errs.password = "Password is required";
      else if (formData.password.length < 6)
        errs.password = "Minimum 6 characters";
      if (formData.password !== formData.confirmPassword)
        errs.confirmPassword = "Passwords do not match";
    } else if (formData.password && formData.password.length < 6) {
      errs.password = "Minimum 6 characters";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {mode === "add" ? "Add New User" : "Edit User"}
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.name ? "border-red-300 focus:ring-red-500/20" : "border-gray-300 focus:ring-primary/20 focus:border-primary"}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? "border-red-300 focus:ring-red-500/20" : "border-gray-300 focus:ring-primary/20 focus:border-primary"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Role
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  {mode === "add"
                    ? "Password"
                    : "New Password (leave blank to keep current)"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      mode === "add"
                        ? "Create password"
                        : "New password (optional)"
                    }
                    className={`w-full pl-10 pr-12 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.password ? "border-red-300 focus:ring-red-500/20" : "border-gray-300 focus:ring-primary/20 focus:border-primary"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.confirmPassword ? "border-red-300 focus:ring-red-500/20" : "border-gray-300 focus:ring-primary/20 focus:border-primary"}`}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "Saving..."
                    : mode === "add"
                      ? "Create User"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Password Reset Modal
const PasswordResetModal = ({
  isOpen,
  onClose,
  onSave,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (password: string) => Promise<void>;
  userName: string;
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPassword("");
    setConfirmPassword("");
    setError("");
  }, [isOpen]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await onSave(password);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-full max-w-sm p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Reset Password
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Reset password for{" "}
              <span className="font-medium text-gray-700">{userName}</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  New Password
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="New password"
                    className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              {error && (
                <p className="text-red-500 text-xs flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
                </p>
              )}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Role Badge
const RoleBadge = ({ role }: { role: UserRole }) => {
  const styles = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    editor: "bg-blue-100 text-blue-700 border-blue-200",
  };
  const icons = { admin: Shield, editor: Edit };
  const Icon = icons[role];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${styles[role]}`}
    >
      <Icon className="w-3 h-3" />
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

// Status Badge with protection
const StatusBadge = ({
  isActive,
  isCurrentUser,
}: {
  isActive: boolean;
  isCurrentUser?: boolean;
}) => (
  <span
    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${isCurrentUser ? "cursor-not-allowed opacity-70" : "cursor-pointer"} ${isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}
  >
    {isActive ? (
      <>
        <UserCheck className="w-3 h-3" /> Active
      </>
    ) : (
      <>
        <UserX className="w-3 h-3" /> Inactive
      </>
    )}
  </span>
);

// Skeleton
const TableSkeleton = () => (
  <div className="animate-pulse">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="flex items-center gap-4 py-3 border-b border-gray-100"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="w-20 h-6 bg-gray-200 rounded-full" />
      </div>
    ))}
  </div>
);

// ===== MAIN COMPONENT =====
export default function UserManagementPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    user: UserData | null;
  }>({ isOpen: false, user: null });
  const [formModal, setFormModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    user: UserData | null;
  }>({ isOpen: false, mode: "add", user: null });
  const [passwordModal, setPasswordModal] = useState<{
    isOpen: boolean;
    user: UserData | null;
  }>({ isOpen: false, user: null });
  const [showFilters, setShowFilters] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>(""); // Logged in user's email
  const itemsPerPage = 8;

  // ===== GET CURRENT USER =====
  useEffect(() => {
    fetchUsers();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      // Get current user from cookie/token or API
      const res = await axios.get("/api/auth/me"); // You need this endpoint
      if (res.data?.user?.email) {
        setCurrentUserEmail(res.data.user.email);
      }
    } catch (err) {
      // Fallback: try to decode from cookie
      console.log("Could not get current user:", err);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ===== CHECK IF USER IS CURRENT LOGGED IN USER =====
  const isCurrentUser = (user: UserData): boolean => {
    return user.email === currentUserEmail;
  };

  // ===== CRUD OPERATIONS =====
  const handleAddUser = async (formData: any) => {
    try {
      await axios.post("/api/users", formData);
      await fetchUsers();
      setToast({ message: "User created successfully", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to create user",
        type: "error",
      });
      throw err;
    }
  };

  const handleEditUser = async (formData: any) => {
    if (!formModal.user) return;
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };
      if (formData.password) updateData.password = formData.password;
      await axios.put(`/api/users/${formModal.user._id}`, updateData);
      await fetchUsers();
      setToast({ message: "User updated successfully", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to update user",
        type: "error",
      });
      throw err;
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModal.user) return;

    // ===== PREVENT SELF-DELETE =====
    if (isCurrentUser(deleteModal.user)) {
      setToast({
        message: "You cannot delete your own account!",
        type: "error",
      });
      setDeleteModal({ isOpen: false, user: null });
      return;
    }

    try {
      await axios.delete(`/api/users/${deleteModal.user._id}`);
      await fetchUsers();
      setToast({ message: "User deleted successfully", type: "success" });
      setDeleteModal({ isOpen: false, user: null });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to delete user",
        type: "error",
      });
    }
  };

  const handleResetPassword = async (password: string) => {
    if (!passwordModal.user) return;
    try {
      await axios.put(`/api/users/${passwordModal.user._id}/change-password`, {
        newPassword: password,
      });
      setToast({ message: "Password reset successfully", type: "success" });
    } catch (err: any) {
      setToast({
        message: err.response?.data?.error || "Failed to reset password",
        type: "error",
      });
      throw err;
    }
  };

  const handleToggleStatus = async (userId: string, user: UserData) => {
    // ===== PREVENT SELF-DEACTIVATE =====
    if (isCurrentUser(user)) {
      setToast({
        message: "You cannot deactivate your own account!",
        type: "error",
      });
      return;
    }

    try {
      await axios.put(`/api/users/${userId}/toggle-status`);
      await fetchUsers();
      setToast({ message: "User status updated", type: "success" });
    } catch (err: any) {
      setToast({ message: "Failed to toggle status", type: "error" });
    }
  };

  // Filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? user.isActive : !user.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const stats = {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={handleDeleteUser}
        userName={deleteModal.user?.name || ""}
        isCurrentUser={
          deleteModal.user ? isCurrentUser(deleteModal.user) : false
        }
      />
      <UserFormModal
        isOpen={formModal.isOpen}
        onClose={() => setFormModal({ isOpen: false, mode: "add", user: null })}
        onSave={formModal.mode === "add" ? handleAddUser : handleEditUser}
        user={formModal.user}
        mode={formModal.mode}
      />
      <PasswordResetModal
        isOpen={passwordModal.isOpen}
        onClose={() => setPasswordModal({ isOpen: false, user: null })}
        onSave={handleResetPassword}
        userName={passwordModal.user?.name || ""}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <button
          onClick={() =>
            setFormModal({ isOpen: true, mode: "add", user: null })
          }
          className="bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-hover transition flex items-center gap-2 text-sm shadow-md shadow-primary/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.total,
            icon: User,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Active Users",
            value: stats.active,
            icon: UserCheck,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Admins",
            value: stats.admin,
            icon: Shield,
            color: "bg-purple-50 text-purple-600",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition cursor-pointer"
          >
            <Filter className="w-4 h-4" /> Filters{" "}
            {(roleFilter !== "all" || statusFilter !== "all") && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 pt-4 border-t mt-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) =>
                      setRoleFilter(e.target.value as UserRole | "all")
                    }
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as "all" | "active" | "inactive",
                      )
                    }
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">
                  Status
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">
                  Created
                </th>
                <th className="py-3 px-4 text-xs font-medium text-gray-500 uppercase text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8">
                    <TableSkeleton />
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isSelf = isCurrentUser(user);
                  return (
                    <tr
                      key={user._id}
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-linear-to-r from-primary to-accent rounded-full flex items-center justify-center shrink-0">
                            <span className="text-white font-semibold text-sm">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-sm">
                              {user.name}{" "}
                              {isSelf && (
                                <span className="text-xs text-primary font-normal ml-1">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <button
                          onClick={() => handleToggleStatus(user._id, user)}
                          disabled={isSelf}
                          className={
                            isSelf ? "cursor-not-allowed" : "cursor-pointer"
                          }
                        >
                          <StatusBadge
                            isActive={user.isActive}
                            isCurrentUser={isSelf}
                          />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 hidden lg:table-cell">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() =>
                              setPasswordModal({ isOpen: true, user })
                            }
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded transition cursor-pointer"
                            title="Reset Password"
                          >
                            <Key className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setFormModal({ isOpen: true, mode: "edit", user })
                            }
                            className="p-1.5 text-gray-400 hover:text-accent hover:bg-accent/5 rounded transition cursor-pointer"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteModal({ isOpen: true, user })
                            }
                            disabled={isSelf}
                            className={`p-1.5 rounded transition ${isSelf ? "text-gray-300 cursor-not-allowed" : "text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"}`}
                            title={
                              isSelf ? "Cannot delete yourself" : "Delete User"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded text-xs font-medium transition cursor-pointer ${currentPage === page ? "bg-primary text-white" : "text-gray-500 hover:bg-gray-100"}`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1.5 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
