export default function ExhibitionSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">

      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3 items-center bg-white p-4 rounded-lg border">

          {/* Image */}
          <div className="w-14 h-14 bg-gray-200 rounded"></div>

          {/* Text */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>

        </div>
      ))}

    </div>
  );
}