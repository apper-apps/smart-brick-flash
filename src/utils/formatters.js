export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number) => {
  return new Intl.NumberFormat("en-IN").format(number);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatPhone = (phone) => {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
};

export const getStatusColor = (status) => {
  const colors = {
    available: "text-success-600 bg-success-50",
    "under-negotiation": "text-warning-600 bg-warning-50",
    sold: "text-error-600 bg-error-50",
    rented: "text-primary-600 bg-primary-50",
  };
  return colors[status] || "text-gray-600 bg-gray-50";
};

export const getRoleColor = (role) => {
  const colors = {
    admin: "text-accent-600 bg-accent-50",
    member: "text-primary-600 bg-primary-50",
    "sub-member": "text-secondary-600 bg-secondary-50",
  };
  return colors[role] || "text-gray-600 bg-gray-50";
};