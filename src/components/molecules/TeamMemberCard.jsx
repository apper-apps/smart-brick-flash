import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatCurrency, formatPhone, getRoleColor, formatDate } from "@/utils/formatters";

const TeamMemberCard = ({ member, onViewTeam, level = 0 }) => {
  const roleVariant = {
    admin: "accent",
    member: "primary",
    "sub-member": "secondary"
  }[member.role] || "default";

  return (
    <div className="card p-6 relative">
      {level > 0 && (
        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 w-8 h-px bg-gray-300"></div>
      )}
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900">{member.name}</h3>
            <Badge variant={roleVariant} size="sm" className="capitalize">
              {member.role.replace("-", " ")}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="h-4 w-4 mr-1" />
            {member.email}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
          {formatPhone(member.phone)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Calendar" className="h-4 w-4 mr-2" />
          Joined {formatDate(member.joinedDate)}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-100">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{member.totalSales || 0}</p>
            <p className="text-xs text-gray-600">Sales</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(member.totalEarnings || 0)}</p>
            <p className="text-xs text-gray-600">Earnings</p>
          </div>
        </div>

        {member.subMembers && member.subMembers.length > 0 && (
          <button
            onClick={() => onViewTeam(member.Id)}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ApperIcon name="Users" className="h-4 w-4" />
            <span>View Team ({member.subMembers.length})</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamMemberCard;