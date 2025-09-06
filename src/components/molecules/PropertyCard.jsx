import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { formatCurrency, getStatusColor } from "@/utils/formatters";

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  const statusVariant = {
    available: "success",
    "under-negotiation": "warning", 
    sold: "error",
    rented: "primary"
  }[property.status] || "default";

  return (
    <div className="card-hover p-0 overflow-hidden">
<div className="relative overflow-hidden">
      <img
        src={property.images?.[0] || `https://picsum.photos/400/250?random=${property.Id || Math.random()}`}
        alt={`${property.title || 'Property'} - Real estate listing image`}
        className="w-full h-48 object-cover transition-opacity duration-200"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div 
        className="w-full h-48 bg-gradient-to-br from-surface-100 to-surface-200 items-center justify-center text-surface-500 hidden"
        style={{ display: 'none' }}
      >
        <div className="text-center">
          <ApperIcon name="Image" className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Image unavailable</p>
        </div>
      </div>
<div className="absolute top-3 left-3">
        <Badge variant={statusVariant}>
          {property.status.replace("-", " ")}
        </Badge>
      </div>
        <div className="absolute bottom-4 left-4">
          <div className="bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-lg">
            <span className="text-lg font-bold">{formatCurrency(property.price)}</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.title}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
              {property.location}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center">
            <ApperIcon name="Home" className="h-4 w-4 mr-1" />
            <span className="capitalize">{property.category}</span>
          </div>
          <div className="flex items-center">
            <ApperIcon name="Maximize" className="h-4 w-4 mr-1" />
            <span>{property.size}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={() => navigate(`/properties/${property.Id}`)}
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <ApperIcon name="Share2" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;