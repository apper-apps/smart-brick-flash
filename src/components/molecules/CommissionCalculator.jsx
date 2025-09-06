import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { COMMISSION_RATES } from "@/utils/constants";

const CommissionCalculator = ({ onCalculate }) => {
  const [saleAmount, setSaleAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    if (saleAmount) {
      calculateCommission();
    }
  }, [saleAmount, propertyType]);

  const calculateCommission = () => {
    if (!saleAmount || !propertyType) return;

    const amount = parseFloat(saleAmount);
    const totalCommission = amount * 0.05; // 5% total commission

    const distributions = [
      {
        role: "member",
        rate: COMMISSION_RATES.member,
        amount: totalCommission * (COMMISSION_RATES.member / 0.05),
        percentage: (COMMISSION_RATES.member / 0.05) * 100
      },
      {
        role: "sub-member",
        rate: COMMISSION_RATES["sub-member"],
        amount: totalCommission * (COMMISSION_RATES["sub-member"] / 0.05),
        percentage: (COMMISSION_RATES["sub-member"] / 0.05) * 100
      },
    ];

    setDistribution(distributions);
    if (onCalculate) {
      onCalculate({ saleAmount: amount, totalCommission, distributions });
    }
  };

  const propertyTypes = [
    { id: "land", label: "Land" },
    { id: "villa", label: "Villa" },
    { id: "apartment", label: "Apartment" },
    { id: "commercial", label: "Commercial Space" },
    { id: "building", label: "Building" },
  ];

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg">
          <ApperIcon name="Calculator" className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Commission Calculator</h3>
      </div>

      <div className="space-y-4">
        <Input
          label="Sale Amount (INR)"
          type="number"
          placeholder="Enter sale amount"
          value={saleAmount}
          onChange={(e) => setSaleAmount(e.target.value)}
        />

        <Select
          label="Property Type"
          placeholder="Select property type"
          options={propertyTypes}
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        />

        {distribution.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-surface-50 to-surface-100 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Commission Distribution</h4>
            <div className="space-y-3">
              {distribution.map((dist) => (
                <div key={dist.role} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize font-medium text-gray-700">
                      {dist.role.replace("-", " ")}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({dist.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(dist.amount)}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t-2 border-gray-300 font-bold">
                <span>Total Commission</span>
                <span className="text-primary-600">
                  {formatCurrency(distribution.reduce((sum, d) => sum + d.amount, 0))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionCalculator;