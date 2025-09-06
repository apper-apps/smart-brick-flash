import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  onRetry, 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="mb-6 p-4 bg-error-50 rounded-full">
        <ApperIcon name="AlertTriangle" className="h-12 w-12 text-error-500" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3">
        {onRetry && (
          <Button onClick={onRetry} className="flex items-center space-x-2">
            <ApperIcon name="RefreshCw" className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" className="h-4 w-4" />
          <span>Refresh Page</span>
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-surface-50 rounded-lg max-w-md">
        <p className="text-sm text-gray-600">
          <strong>Need help?</strong> Contact our support team if this problem persists.
        </p>
      </div>
    </div>
  );
};

export default Error;