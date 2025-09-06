import React, { useState, useEffect } from "react";
import TeamMemberCard from "@/components/molecules/TeamMemberCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { userService } from "@/services/api/userService";
import { USER_ROLES } from "@/utils/constants";
import { toast } from "react-toastify";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [filteredTeam, setFilteredTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "sub-member"
  });

  useEffect(() => {
    loadTeam();
  }, []);

  useEffect(() => {
    filterTeam();
  }, [team, searchTerm, roleFilter]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await userService.getAll();
      // Filter out admin users and add mock hierarchy data
      const teamMembers = data.filter(user => user.role !== "admin").map(member => ({
        ...member,
        totalSales: Math.floor(Math.random() * 20) + 1,
        totalEarnings: Math.floor(Math.random() * 500000) + 50000,
        subMembers: member.role === "member" ? 
          data.filter(u => u.role === "sub-member").slice(0, Math.floor(Math.random() * 3) + 1) : 
          []
      }));
      
      setTeam(teamMembers);
    } catch (err) {
      setError(err.message || "Failed to load team data");
    } finally {
      setLoading(false);
    }
  };

  const filterTeam = () => {
    let filtered = team;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter) {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    setFilteredTeam(filtered);
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const newMember = await userService.create({
        ...inviteForm,
        joinedDate: new Date().toISOString(),
        isActive: true,
        totalSales: 0,
        totalEarnings: 0,
        subMembers: []
      });
      
      setTeam([...team, newMember]);
      setShowInviteModal(false);
      setInviteForm({ name: "", email: "", phone: "", role: "sub-member" });
      toast.success("Team member invited successfully!");
    } catch (err) {
      toast.error("Failed to invite team member");
    }
  };

  const handleViewTeam = (memberId) => {
    // In a real app, this would navigate to a detailed team view
    toast.info("Team details view coming soon!");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadTeam} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
          <p className="text-gray-600">
            Build and manage your real estate network
          </p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <ApperIcon name="UserPlus" className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="Users" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{team.length}</p>
          <p className="text-sm text-gray-600">Total Members</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="Crown" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {team.filter(m => m.role === "member").length}
          </p>
          <p className="text-sm text-gray-600">Team Members</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="UserCheck" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {team.filter(m => m.role === "sub-member").length}
          </p>
          <p className="text-sm text-gray-600">Sub Members</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-3 bg-gradient-to-r from-success-500 to-success-600 rounded-xl w-fit mx-auto mb-3">
            <ApperIcon name="TrendingUp" className="h-6 w-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {team.reduce((sum, m) => sum + m.totalSales, 0)}
          </p>
          <p className="text-sm text-gray-600">Total Sales</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Search team members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filter by role"
            options={USER_ROLES.map(role => ({ id: role.id, label: role.label }))}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
          <Button variant="outline" onClick={() => { setSearchTerm(""); setRoleFilter(""); }}>
            <ApperIcon name="X" className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Team List */}
      {filteredTeam.length === 0 ? (
        <Empty
          title="No team members found"
          description="Start building your real estate empire by inviting your first team member."
          actionText="Invite Team Member"
          actionIcon="UserPlus"
          icon="Users"
          onAction={() => setShowInviteModal(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <TeamMemberCard
              key={member.Id}
              member={member}
              onViewTeam={handleViewTeam}
            />
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="card w-full max-w-md p-0">
            <div className="p-6 border-b border-surface-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Invite Team Member</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowInviteModal(false)}
                >
                  <ApperIcon name="X" className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <Input
                label="Full Name"
                required
                value={inviteForm.name}
                onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                required
                value={inviteForm.email}
                onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                type="tel"
                required
                value={inviteForm.phone}
                onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
              />
              <Select
                label="Role"
                required
                options={USER_ROLES.filter(r => r.id !== "admin").map(role => ({ id: role.id, label: role.label }))}
                value={inviteForm.role}
                onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
              />
              
              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  Send Invitation
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowInviteModal(false)}
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

export default Team;