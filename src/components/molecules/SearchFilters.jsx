import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { PROPERTY_CATEGORIES, PROPERTY_STATUS, PRICE_RANGES, INDIAN_STATES } from "@/utils/constants";

const SearchFilters = ({ onFiltersChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    ...initialFilters
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      status: "",
      location: "",
      minPrice: "",
      maxPrice: "",
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <ApperIcon name="X" className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search properties..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />

        <Select
          placeholder="Select Category"
          options={PROPERTY_CATEGORIES}
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        />

        <Select
          placeholder="Select Status"
          options={PROPERTY_STATUS.map(s => ({ id: s.id, label: s.label }))}
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        />

        <Select
          placeholder="Select Location"
          options={INDIAN_STATES.map(state => ({ id: state, label: state }))}
          value={filters.location}
          onChange={(e) => handleFilterChange("location", e.target.value)}
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            />
            <Input
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quick Price Ranges
          </label>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range) => (
              <Button
                key={range.label}
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleFilterChange("minPrice", range.min);
                  handleFilterChange("maxPrice", range.max || "");
                }}
                className="text-xs"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;