import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { formatCurrency, formatDate, getStatusColor } from "@/utils/formatters";
import { toast } from "react-toastify";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await propertyService.getById(parseInt(id));
      setProperty(data);
    } catch (err) {
      setError(err.message || "Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const updatedProperty = await propertyService.update(property.Id, {
        ...property,
        status: newStatus
      });
      setProperty(updatedProperty);
      toast.success(`Property status updated to ${newStatus.replace("-", " ")}`);
    } catch (err) {
      toast.error("Failed to update property status");
    }
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Property link copied to clipboard!");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  const statusVariant = {
    available: "success",
    "under-negotiation": "warning",
    sold: "error", 
    rented: "primary"
  }[property.status] || "default";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
        >
          <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-center space-x-2 mt-1">
            <ApperIcon name="MapPin" className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{property.location}</span>
            <Badge variant={statusVariant} className="ml-2 capitalize">
              {property.status.replace("-", " ")}
            </Badge>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={shareProperty}>
            <ApperIcon name="Share2" className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <ApperIcon name="Heart" className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Images and Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="card p-0 overflow-hidden">
            <div className="relative">
              <img
                src={property.images?.[currentImageIndex] || "/api/placeholder/800/500"}
                alt={property.title}
                className="w-full h-96 object-cover"
              />
              
              {property.images?.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                  >
                    <ApperIcon name="ChevronLeft" className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                    onClick={() => setCurrentImageIndex(Math.min(property.images.length - 1, currentImageIndex + 1))}
                  >
                    <ApperIcon name="ChevronRight" className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg">
                <span className="text-2xl font-bold">{formatCurrency(property.price)}</span>
              </div>
            </div>
            
            {property.images?.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? "border-primary-500" : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Home" className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium capitalize">{property.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Maximize" className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-medium">{property.size}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Calendar" className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Listed On</p>
                    <p className="font-medium">{formatDate(property.createdAt)}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="MapPin" className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{property.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="User" className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Listed By</p>
                    <p className="font-medium">{property.listedBy || "Rajesh Singh"}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Eye" className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge variant={statusVariant} size="sm" className="capitalize">
                      {property.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed">
              {property.description || `This beautiful ${property.category} in ${property.location} offers excellent investment opportunities. With a total area of ${property.size}, this property is perfect for those looking for quality real estate in a prime location. The property features modern amenities and is strategically located with easy access to major transportation hubs, schools, and shopping centers.`}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-6">
            {/* Price and Actions */}
            <div className="card p-6">
              <div className="text-center mb-6">
                <p className="text-3xl font-bold gradient-text mb-2">
                  {formatCurrency(property.price)}
                </p>
                <p className="text-gray-600">
                  Price per sq ft: {formatCurrency(property.price / parseInt(property.size.split(" ")[0] || 1000))}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full">
                  <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                  Contact Agent
                </Button>
                <Button variant="outline" className="w-full">
                  <ApperIcon name="MessageSquare" className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full">
                  <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
                  Schedule Visit
                </Button>
              </div>
            </div>

            {/* Status Actions */}
            {property.status === "available" && (
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleStatusUpdate("under-negotiation")}
                  >
                    <ApperIcon name="Clock" className="h-4 w-4 mr-2" />
                    Mark as Under Negotiation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleStatusUpdate("sold")}
                  >
                    <ApperIcon name="CheckCircle" className="h-4 w-4 mr-2" />
                    Mark as Sold
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => handleStatusUpdate("rented")}
                  >
                    <ApperIcon name="Home" className="h-4 w-4 mr-2" />
                    Mark as Rented
                  </Button>
                </div>
              </div>
            )}

            {/* Property Insights */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Property Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Inquiries</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Days Listed</span>
                  <span className="font-medium">15</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Interest Score</span>
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      {[1,2,3,4].map(i => (
                        <ApperIcon key={i} name="Star" className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                      <ApperIcon name="Star" className="h-4 w-4 text-gray-300" />
                    </div>
                    <span className="text-sm text-gray-600 ml-1">(4.2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;