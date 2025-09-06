import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";

const Header = ({ onMobileMenuToggle }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const titles = {
      "/": "Dashboard",
      "/properties": "Properties",
      "/team": "My Team",
      "/commissions": "Commissions",
      "/messages": "Messages"
    };
    return titles[location.pathname] || "Smart Brick";
  };

  const notifications = [
    { id: 1, text: "New property listed in Mumbai", time: "5 min ago" },
    { id: 2, text: "Commission of ₹50,000 credited", time: "1 hour ago" },
    { id: 3, text: "Team member John joined your network", time: "2 hours ago" },
  ];

  return (
    <header className="bg-white border-b border-surface-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" className="h-6 w-6" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="hidden sm:block p-2 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl">
              <ApperIcon name="Building2" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">{getPageTitle()}</h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Manage your real estate business efficiently
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative"
            >
              <ApperIcon name="Bell" className="h-5 w-5" />
              <Badge 
                variant="error" 
                size="sm" 
                className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center"
              >
                3
              </Badge>
            </Button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-surface-200 z-50">
                <div className="p-4 border-b border-surface-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <Button variant="ghost" size="sm">
                      <ApperIcon name="Settings" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-4 border-b border-surface-50 hover:bg-surface-50">
                      <p className="text-sm text-gray-900 mb-1">{notification.text}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4">
                  <Button variant="outline" size="sm" className="w-full">
                    View All Notifications
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pl-3 border-l border-surface-200">
            <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-accent-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              RS
            </div>
            <div className="hidden sm:block">
              <p className="font-medium text-gray-900">Rajesh Singh</p>
              <p className="text-sm text-gray-600">Team Member</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;