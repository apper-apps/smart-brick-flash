import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Navigation = ({ className, onClick }) => {
  const navItems = [
    { to: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { to: "/properties", label: "Properties", icon: "Home" },
    { to: "/team", label: "My Team", icon: "Users" },
    { to: "/commissions", label: "Commissions", icon: "DollarSign" },
    { to: "/messages", label: "Messages", icon: "MessageSquare" },
  ];

  return (
    <nav className={className}>
      <div className="px-3 py-6">
        <div className="flex items-center space-x-3 px-3 mb-8">
          <div className="p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl shadow-lg">
            <ApperIcon name="Building2" className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Smart Brick</h1>
            <p className="text-sm text-gray-600">Real Estate Hub</p>
          </div>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-surface-100 hover:text-primary-600"
                )
              }
            >
              <ApperIcon name={item.icon} className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="mt-8 px-3">
          <div className="p-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name="Star" className="h-5 w-5 text-accent-600" />
              <span className="font-semibold text-accent-800">Premium Features</span>
            </div>
            <p className="text-sm text-accent-700 mb-3">
              Upgrade to unlock advanced analytics and team management tools.
            </p>
            <button className="w-full bg-gradient-to-r from-accent-500 to-accent-600 text-white text-sm font-medium py-2 rounded-lg hover:from-accent-600 hover:to-accent-700 transition-all duration-200">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;