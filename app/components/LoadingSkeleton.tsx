// app/components/LoadingSkeleton.tsx
'use client'

export default function LoadingSkeleton() {
  return (
    <div className="pb-16">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-slate-700/50 rounded animate-pulse mb-2" />
          <div className="h-4 w-32 bg-slate-700/50 rounded animate-pulse" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Image Skeleton */}
            <div className="aspect-square bg-slate-700/50 animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="h-3 w-24 bg-slate-700/50 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-700/50 rounded animate-pulse" />
              <div className="flex justify-between pt-2 border-t border-slate-700/50">
                <div className="h-8 w-20 bg-slate-700/50 rounded animate-pulse" />
                <div className="h-8 w-20 bg-slate-700/50 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}