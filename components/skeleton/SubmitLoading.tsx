"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

type SubmitLoadingProps = {
  variant?: "spinner" | "pulse" | "progress" | "minimal";
  message?: string;
  status?: "loading" | "success" | "error";
  progress?: number;
  onClose?: () => void;
};

export default function SubmitLoading({
  variant = "spinner",
  message = "Processing your request...",
  status = "loading",
  progress = 0,
  onClose
}: SubmitLoadingProps) {

  // Variant 1: Spinner (Default)
  if (variant === "spinner") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-linear-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl border border-white/10 flex flex-col items-center gap-5 max-w-sm w-full mx-4"
        >
          {/* Animated Spinner */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-white/10" />
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-white/50 animate-pulse" />
          </div>

          {/* Status Icon */}
          {status === "success" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4"
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-4 right-4"
            >
              <AlertCircle className="w-6 h-6 text-red-500" />
            </motion.div>
          )}

          {/* Message */}
          <p className="text-white text-base font-medium text-center">
            {message}
          </p>

          {/* Animated Dots */}
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-primary rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>

          {/* Cancel Button (Optional) */}
          {onClose && status === "loading" && (
            <button
              onClick={onClose}
              className="mt-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  // Variant 2: Pulse with Exhibition Theme
  if (variant === "pulse") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-sm w-full mx-4"
        >
          {/* Exhibition Booth Animation */}
          <div className="relative w-24 h-24">
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-primary to-accent rounded-full"
              animate={{ scaleX: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-3 h-16 bg-primary rounded-t-lg"
              animate={{ height: [64, 72, 64] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="absolute bottom-0 right-0 w-3 h-16 bg-accent rounded-t-lg"
              animate={{ height: [64, 72, 64] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div
              className="absolute top-4 left-3 right-3 h-1 bg-linear-to-r from-primary to-accent"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          <p className="text-gray-700 font-medium text-center">{message}</p>

          {/* Progress Bar */}
          {progress > 0 && (
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}

          <p className="text-xs text-gray-400">Please wait while we process</p>
        </motion.div>
      </div>
    );
  }

  // Variant 3: Progress with Steps
  if (variant === "progress") {
    const steps = ["Uploading", "Processing", "Saving", "Complete"];
    const currentStep = Math.floor((progress / 100) * steps.length);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
            {message}
          </h3>

          {/* Steps */}
          <div className="flex justify-between mb-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${i < currentStep
                      ? "bg-primary text-white"
                      : i === currentStep
                        ? "bg-primary/20 text-primary border-2 border-primary"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  animate={i === currentStep ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </motion.div>
                <span className="text-xs text-gray-500">{step}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            {progress}% Complete
          </p>
        </motion.div>
      </div>
    );
  }

  // Variant 4: Minimal (Inline)
  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <span className="text-sm text-gray-600">{message}</span>
        </div>
      </div>
    );
  }

  return null;
}

// Simple version (Original style but enhanced)
export function SubmitLoadingSimple() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
  className="bg-linear-to-br from-gray-900 to-black p-8 rounded-2xl shadow-2xl border border-primary/20 flex flex-col items-center gap-4"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl" />

        <div className="relative">
          {/* Outer Ring */}
          <div className="w-14 h-14 rounded-full border-4 border-primary/20" />

          {/* Spinning Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-accent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Pulse */}
          <motion.div
            className="absolute inset-2 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>

        <p className="text-white text-sm font-medium">
          Processing your request...
        </p>

        <div className="flex gap-1">
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-accent rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-primary rounded-full"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  );
}