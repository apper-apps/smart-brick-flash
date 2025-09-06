import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ type = "default", className = "" }) => {
  if (type === "skeleton") {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="card p-0 overflow-hidden">
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="flex space-x-2 pt-2">
                  <div className="h-8 bg-gray-200 rounded flex-1"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "spinner") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="relative">
          <div className="w-12 h-12 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ApperIcon name="Home" className="h-5 w-5 text-primary-600" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-surface-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <ApperIcon name="Building2" className="h-8 w-8 text-primary-600" />
        </div>
      </div>
      <p className="text-gray-600 font-medium">Loading properties...</p>
      <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the latest data</p>
    </div>
  );
};

export default Loading;