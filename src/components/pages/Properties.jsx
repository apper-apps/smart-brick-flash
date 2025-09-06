import React, { useState, useEffect } from "react";
import PropertyCard from "@/components/molecules/PropertyCard";
import SearchFilters from "@/components/molecules/SearchFilters";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { propertyService } from "@/services/api/propertyService";

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  useEffect(() => {
    sortProperties();
  }, [properties, sortBy]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getAll();
      setProperties(data);
      setFilteredProperties(data);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  const sortProperties = () => {
    const sorted = [...filteredProperties].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        default:
          return 0;
      }
    });
    setFilteredProperties(sorted);
  };

  const handleFiltersChange = (filters) => {
    let filtered = properties;

    if (filters.search) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseInt(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseInt(filters.maxPrice));
    }

    setFilteredProperties(filtered);
  };

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadProperties} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">
            Manage your property listings and discover new opportunities
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Properties Grid */}
        <div className="lg:col-span-3">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-gray-600">
              Showing {filteredProperties.length} of {properties.length} properties
            </p>
            
            <div className="flex items-center space-x-3">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                options={sortOptions}
                className="w-48"
              />
              
              <div className="flex border border-surface-300 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <ApperIcon name="Grid3X3" className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <ApperIcon name="List" className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Properties Display */}
          {filteredProperties.length === 0 ? (
            <Empty
              title="No properties found"
              description="Try adjusting your search filters or add a new property to get started."
              actionText="Add New Property"
              actionIcon="Plus"
              icon="Home"
              onAction={() => setShowAddModal(true)}
            />
          ) : (
            <div className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                : "space-y-6"
            }>
              {filteredProperties.map((property) => (
                <PropertyCard 
                  key={property.Id} 
                  property={property}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties;