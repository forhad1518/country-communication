export default function SubmitLoading() {
  return (
    <div className="fixed cursor-not-allowed h-screen inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center gap-4">

        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>

        {/* Text */}
        <p className="text-sm text-gray-600">
          Processing your request...
        </p>

        {/* Skeleton lines */}
        <div className="w-40 space-y-2 animate-pulse">
          <div className="h-3 bg-primary/30 rounded"></div>
          <div className="h-3 bg-primary/20 rounded w-3/4"></div>
        </div>

      </div>

    </div>
  );
}