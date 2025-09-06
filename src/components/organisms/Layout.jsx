import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";
import { cn } from "@/utils/cn";

const Layout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 w-72 bg-white border-r border-surface-200 shadow-lg z-30">
        <Navigation />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={closeMobileMenu} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-out">
            <Navigation onClick={closeMobileMenu} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:ml-72">
        <Header onMobileMenuToggle={toggleMobileMenu} />
        
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;