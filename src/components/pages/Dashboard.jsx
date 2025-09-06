import React, { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import PropertyCard from "@/components/molecules/PropertyCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { userService } from "@/services/api/userService";
import { commissionService } from "@/services/api/commissionService";

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [propertiesData, usersData, commissionsData] = await Promise.all([
        propertyService.getAll(),
        userService.getAll(),
        commissionService.getAll()
      ]);

      setProperties(propertiesData.slice(0, 6));
      
      // Calculate metrics
      const totalProperties = propertiesData.length;
      const availableProperties = propertiesData.filter(p => p.status === "available").length;
      const totalSales = propertiesData.filter(p => p.status === "sold").length;
      const totalEarnings = commissionsData.reduce((sum, c) => sum + c.saleAmount * 0.05, 0);
      const teamSize = usersData.filter(u => u.role !== "admin").length;

      setMetrics({
        totalProperties,
        availableProperties,
        totalSales,
        totalEarnings,
        teamSize
      });

      // Mock recent activities
      setRecentActivities([
        { id: 1, text: "Property in Andheri sold for ₹2.5 Cr", time: "2 hours ago", type: "sale" },
        { id: 2, text: "New team member Priya joined", time: "5 hours ago", type: "team" },
        { id: 3, text: "Villa in Bandra listed for ₹4.2 Cr", time: "1 day ago", type: "listing" },
        { id: 4, text: "Commission of ₹1,25,000 credited", time: "2 days ago", type: "commission" },
      ]);

    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Rajesh!</h1>
            <p className="text-primary-100 text-lg">
              Your real estate empire is growing. Here's what's happening today.
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="TrendingUp" className="h-16 w-16 text-white opacity-80" />
          </div>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <Button variant="accent" className="bg-white text-primary-600 hover:bg-gray-100">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Property
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
            <ApperIcon name="Users" className="h-4 w-4 mr-2" />
            Invite Team Member
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title="Total Properties"
          value={metrics.totalProperties || 0}
          icon="Home"
          trend="up"
          trendValue="12"
          type="number"
        />
        <MetricCard
          title="Available"
          value={metrics.availableProperties || 0}
          icon="Eye"
          trend="up"
          trendValue="8"
          type="number"
        />
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales || 0}
          icon="TrendingUp"
          trend="up"
          trendValue="25"
          type="number"
        />
        <MetricCard
          title="Total Earnings"
          value={metrics.totalEarnings || 0}
          icon="DollarSign"
          trend="up"
          trendValue="18"
          type="currency"
        />
        <MetricCard
          title="Team Size"
          value={metrics.teamSize || 0}
          icon="Users"
          trend="up"
          trendValue="15"
          type="number"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Properties */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Properties</h2>
            <Button variant="outline" size="sm">
              <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.Id} property={property} />
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="card p-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${
                    activity.type === "sale" ? "bg-success-100" :
                    activity.type === "team" ? "bg-primary-100" :
                    activity.type === "listing" ? "bg-secondary-100" :
                    "bg-accent-100"
                  }`}>
                    <ApperIcon 
                      name={
                        activity.type === "sale" ? "TrendingUp" :
                        activity.type === "team" ? "UserPlus" :
                        activity.type === "listing" ? "Home" :
                        "DollarSign"
                      }
                      className={`h-4 w-4 ${
                        activity.type === "sale" ? "text-success-600" :
                        activity.type === "team" ? "text-primary-600" :
                        activity.type === "listing" ? "text-secondary-600" :
                        "text-accent-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Plus" className="h-4 w-4 mr-3" />
                Add New Property
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="UserPlus" className="h-4 w-4 mr-3" />
                Invite Team Member
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="Calculator" className="h-4 w-4 mr-3" />
                Calculate Commission
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ApperIcon name="BarChart3" className="h-4 w-4 mr-3" />
                View Reports
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;