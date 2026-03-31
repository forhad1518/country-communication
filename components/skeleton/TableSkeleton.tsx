export function TableSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">

      {[1,2,3,4,5].map((i) => (
        <div key={i} className="grid grid-cols-6 gap-4 bg-white p-4 rounded-lg border">

          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-8 bg-gray-200 rounded"></div>

        </div>
      ))}

    </div>
  );
}