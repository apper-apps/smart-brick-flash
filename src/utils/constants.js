export const PROPERTY_CATEGORIES = [
  { id: "land", label: "Land", icon: "MapPin" },
  { id: "villa", label: "Villa", icon: "Home" },
  { id: "apartment", label: "Apartment", icon: "Building" },
  { id: "commercial", label: "Commercial Space", icon: "Building2" },
  { id: "building", label: "Buildings", icon: "Warehouse" },
];

export const PROPERTY_STATUS = [
  { id: "available", label: "Available", color: "success" },
  { id: "under-negotiation", label: "Under Negotiation", color: "warning" },
  { id: "sold", label: "Sold", color: "error" },
  { id: "rented", label: "Rented", color: "primary" },
];

export const USER_ROLES = [
  { id: "admin", label: "Admin", level: 0 },
  { id: "member", label: "Team Member", level: 1 },
  { id: "sub-member", label: "Sub Member", level: 2 },
];

export const COMMISSION_RATES = {
  admin: 0.15,
  member: 0.10,
  "sub-member": 0.05,
};

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Puducherry", "Chandigarh", "Dadra and Nagar Haveli", "Daman and Diu",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Andaman and Nicobar Islands"
];

export const PRICE_RANGES = [
  { min: 0, max: 1000000, label: "Under ₹10 Lakh" },
  { min: 1000000, max: 2500000, label: "₹10 - 25 Lakh" },
  { min: 2500000, max: 5000000, label: "₹25 - 50 Lakh" },
  { min: 5000000, max: 10000000, label: "₹50 Lakh - 1 Crore" },
  { min: 10000000, max: 25000000, label: "₹1 - 2.5 Crore" },
  { min: 25000000, max: 50000000, label: "₹2.5 - 5 Crore" },
  { min: 50000000, max: null, label: "Above ₹5 Crore" },
];