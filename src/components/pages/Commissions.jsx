import React, { useState, useEffect } from "react";
import CommissionCalculator from "@/components/molecules/CommissionCalculator";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { commissionService } from "@/services/api/commissionService";
import { propertyService } from "@/services/api/propertyService";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { toast } from "react-toastify";

const Commissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [filteredCommissions, setFilteredCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    propertyId: "",
    saleAmount: "",
    buyerName: "",
    saleDate: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterCommissions();
  }, [commissions, dateFilter, statusFilter]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [commissionsData, propertiesData] = await Promise.all([
        commissionService.getAll(),
        propertyService.getAll()
      ]);
      
      setCommissions(commissionsData);
      setProperties(propertiesData.filter(p => p.status === "available"));
    } catch (err) {
      setError(err.message || "Failed to load commission data");
    } finally {
      setLoading(false);
    }
  };

  const filterCommissions = () => {
    let filtered = commissions;

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(commission =>
        new Date(commission.date).toDateString() === filterDate.toDateString()
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(commission => commission.status === statusFilter);
    }

    setFilteredCommissions(filtered);
  };

  const handleRecordSale = async (e) => {
    e.preventDefault();
    try {
      const saleAmount = parseFloat(recordForm.saleAmount);
      const totalCommission = saleAmount * 0.05; // 5% total commission
      
      const newCommission = await commissionService.create({
        propertyId: parseInt(recordForm.propertyId),
        saleAmount: saleAmount,
        commissionRate: 0.05,
        totalCommission: totalCommission,
        distributions: [
          {
            role: "member",
            amount: totalCommission * 0.6, // 60% to member
            percentage: 60
          },
          {
            role: "sub-member", 
            amount: totalCommission * 0.4, // 40% to sub-member
            percentage: 40
          }
        ],
        status: "pending",
        buyerName: recordForm.buyerName,
        saleDate: recordForm.saleDate
      });

      // Update property status
      await propertyService.update(parseInt(recordForm.propertyId), {
        status: "sold"
      });

      setCommissions([...commissions, newCommission]);
      setShowRecordModal(false);
      setRecordForm({ propertyId: "", saleAmount: "", buyerName: "", saleDate: "" });
      toast.success("Sale recorded and commission calculated successfully!");
    } catch (err) {
      toast.error("Failed to record sale");
    }
  };

  const calculateTotalEarnings = () => {
    return commissions.reduce((sum, commission) => {
      const userEarning = commission.distributions?.find(d => d.role === "member")?.amount || 0;
      return sum + userEarning;
    }, 0);
  };

  const calculatePendingEarnings = () => {
    return commissions
      .filter(c => c.status === "pending")
      .reduce((sum, commission) => {
        const userEarning = commission.distributions?.find(d => d.role === "member")?.amount || 0;
        return sum + userEarning;
      }, 0);
  };

  const statusOptions = [
    { id: "pending", label: "Pending" },
    { id: "paid", label: "Paid" },
    { id: "cancelled", label: "Cancelled" }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commissions</h1>
          <p className="text-gray-600">
            Track your earnings and commission distribution
          </p>
        </div>
        <Button onClick={() => setShowRecordModal(true)}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Record Sale
        </Button>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-success-500 to-success-600 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="DollarSign" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(calculateTotalEarnings())}
          </p>
          <p className="text-sm text-gray-600">Total Earnings</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-warning-500 to-warning-600 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="Clock" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(calculatePendingEarnings())}
          </p>
          <p className="text-sm text-gray-600">Pending Payout</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{commissions.length}</p>
          <p className="text-sm text-gray-600">Total Transactions</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="Percent" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">5.0%</p>
          <p className="text-sm text-gray-600">Avg Commission Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commission Calculator */}
        <div className="lg:col-span-1">
          <CommissionCalculator />
        </div>

        {/* Commission History */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Filter by Date"
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              <Select
                label="Filter by Status"
                placeholder="All Statuses"
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
              <div className="flex items-end">
                <Button variant="outline" onClick={() => { setDateFilter(""); setStatusFilter(""); }}>
                  <ApperIcon name="X" className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Commission Table */}
          {filteredCommissions.length === 0 ? (
            <Empty
              title="No commissions found"
              description="Start recording sales to track your commission earnings."
              actionText="Record First Sale"
              actionIcon="Plus"
              icon="DollarSign"
              onAction={() => setShowRecordModal(true)}
            />
          ) : (
            <div className="card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-50 border-b border-surface-200">
                    <tr>
                      <th className="text-left p-4 font-semibold text-gray-900">Property</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Sale Amount</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Commission</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Your Share</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCommissions.map((commission) => {
                      const property = properties.find(p => p.Id === commission.propertyId);
                      const userShare = commission.distributions?.find(d => d.role === "member")?.amount || 0;
                      const statusVariant = {
                        pending: "warning",
                        paid: "success", 
                        cancelled: "error"
                      }[commission.status] || "default";

                      return (
                        <tr key={commission.Id} className="border-b border-surface-100 hover:bg-surface-50">
                          <td className="p-4">
                            <div>
                              <p className="font-medium text-gray-900">
                                {property?.title || `Property #${commission.propertyId}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {commission.buyerName && `Buyer: ${commission.buyerName}`}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-gray-900">
                              {formatCurrency(commission.saleAmount)}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-900">
                              {formatCurrency(commission.saleAmount * commission.commissionRate)}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">
                              ({(commission.commissionRate * 100).toFixed(1)}%)
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-primary-600">
                              {formatCurrency(userShare)}
                            </span>
                          </td>
                          <td className="p-4">
                            <Badge variant={statusVariant} size="sm" className="capitalize">
                              {commission.status}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <span className="text-gray-600">
                              {formatDate(commission.date)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Record Sale Modal */}
      {showRecordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md p-0">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Record Property Sale</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRecordModal(false)}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleRecordSale} className="p-6 space-y-4">
              <Select
                label="Select Property"
                required
                placeholder="Choose a property"
                options={properties.map(p => ({ id: p.Id, label: `${p.title} - ${p.location}` }))}
                value={recordForm.propertyId}
                onChange={(e) => setRecordForm({ ...recordForm, propertyId: e.target.value })}
              />
              <Input
                label="Sale Amount (INR)"
                type="number"
                required
                placeholder="Enter sale amount"
                value={recordForm.saleAmount}
                onChange={(e) => setRecordForm({ ...recordForm, saleAmount: e.target.value })}
              />
              <Input
                label="Buyer Name"
                required
                placeholder="Enter buyer's name"
                value={recordForm.buyerName}
                onChange={(e) => setRecordForm({ ...recordForm, buyerName: e.target.value })}
              />
              <Input
                label="Sale Date"
                type="date"
                required
                value={recordForm.saleDate}
                onChange={(e) => setRecordForm({ ...recordForm, saleDate: e.target.value })}
              />
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  Record Sale
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRecordModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Commissions;