import React from "react";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatNumber } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  type = "number",
  className 
}) => {
  const formatValue = (val) => {
    switch (type) {
      case "currency":
        return formatCurrency(val);
      case "number":
        return formatNumber(val);
      default:
        return val;
    }
  };

  const trendColor = trend === "up" ? "text-success-600" : trend === "down" ? "text-error-600" : "text-gray-600";
  const trendIcon = trend === "up" ? "TrendingUp" : trend === "down" ? "TrendingDown" : "Minus";

  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
            <ApperIcon name={icon} className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{formatValue(value)}</p>
          </div>
        </div>
        {trend && (
          <div className={cn("flex items-center space-x-1", trendColor)}>
            <ApperIcon name={trendIcon} className="h-4 w-4" />
            <span className="text-sm font-medium">{trendValue}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;