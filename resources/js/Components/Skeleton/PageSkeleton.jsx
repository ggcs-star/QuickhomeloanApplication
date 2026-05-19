export default function PageSkeleton({ children, showBottomNav = true }) {
  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      {/* TopNav Skeleton */}
      <div className="px-4 py-3" style={{ paddingTop: "max(10px, env(safe-area-inset-top))" }}>
        <div className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gray-200 animate-pulse"></div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-[48px] bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      {children ? (
        children
      ) : (
        <div className="p-4 space-y-4">
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
      )}

      {/* BottomNav Skeleton */}
      {showBottomNav && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}