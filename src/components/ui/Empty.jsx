import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found",
  description = "There are no items to display at the moment.",
  actionText,
  actionIcon = "Plus",
  onAction,
  icon = "Folder",
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="mb-6 p-6 bg-gradient-to-r from-surface-50 to-surface-100 rounded-full">
        <ApperIcon name={icon} className="h-16 w-16 text-gray-400" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        {description}
      </p>
      
      {actionText && onAction && (
        <Button onClick={onAction} className="flex items-center space-x-2">
          <ApperIcon name={actionIcon} className="h-4 w-4" />
          <span>{actionText}</span>
        </Button>
      )}
      
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg">
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <ApperIcon name="Search" className="h-8 w-8 text-primary-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Try adjusting your search filters</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <ApperIcon name="RefreshCw" className="h-8 w-8 text-secondary-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Refresh to see new items</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <ApperIcon name="Plus" className="h-8 w-8 text-accent-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600">Add new items to get started</p>
        </div>
      </div>
    </div>
  );
};

export default Empty;