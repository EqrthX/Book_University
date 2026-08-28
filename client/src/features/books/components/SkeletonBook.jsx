function SkeletonBook() {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full animate-pulse">
      {/* Book Cover Placeholder */}
      <div className="relative aspect-[3/4] bg-slate-150 flex items-center justify-center p-4 border-b border-slate-100">
        <div className="w-20 h-28 bg-slate-200 rounded-lg shadow-sm"></div>
      </div>

      {/* Book Details Placeholder */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-4">
        <div className="space-y-2">
          {/* Title Placeholder */}
          <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
          {/* Description Placeholder */}
          <div className="h-3 bg-slate-200 rounded-full w-full"></div>
          <div className="h-3 bg-slate-200 rounded-full w-5/6"></div>
        </div>

        {/* Footer Placeholder */}
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
          {/* Price Placeholder */}
          <div className="h-5 bg-slate-200 rounded-full w-12"></div>
          {/* Badge Placeholder */}
          <div className="h-4 bg-slate-200 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonBook;
