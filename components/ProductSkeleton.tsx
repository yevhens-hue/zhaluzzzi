import React from 'react';

export function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-4 shadow-xs animate-pulse">
      <div className="aspect-4/5 w-full bg-gray-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded-md w-1/3" />
        <div className="h-4 bg-gray-200 rounded-md w-full" />
        <div className="h-3 bg-gray-200 rounded-md w-2/3" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-gray-100">
        <div className="h-5 bg-gray-200 rounded-md w-1/4" />
        <div className="h-8 bg-gray-200 rounded-xl w-1/3" />
      </div>
    </div>
  );
}

export function CatalogSkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(6)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
