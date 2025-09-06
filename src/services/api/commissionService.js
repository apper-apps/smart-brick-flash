import commissionsData from "@/services/mockData/commissions.json";

class CommissionService {
  constructor() {
    this.commissions = [...commissionsData];
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.commissions];
  }

  async getById(id) {
    await this.delay();
    const commission = this.commissions.find(c => c.Id === id);
    if (!commission) {
      throw new Error("Commission record not found");
    }
    return { ...commission };
  }

  async create(commissionData) {
    await this.delay();
    const newId = Math.max(...this.commissions.map(c => c.Id)) + 1;
    const newCommission = {
      Id: newId,
      ...commissionData,
      date: new Date().toISOString(),
    };
    this.commissions.push(newCommission);
    return { ...newCommission };
  }

  async update(id, commissionData) {
    await this.delay();
    const index = this.commissions.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Commission record not found");
    }
    this.commissions[index] = { ...this.commissions[index], ...commissionData };
    return { ...this.commissions[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.commissions.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error("Commission record not found");
    }
    const deleted = this.commissions.splice(index, 1)[0];
    return { ...deleted };
  }

  async getByUserId(userId) {
    await this.delay();
    return this.commissions.filter(c => c.userId === userId);
  }

  async getByPropertyId(propertyId) {
    await this.delay();
    return this.commissions.filter(c => c.propertyId === propertyId);
  }
}

export const commissionService = new CommissionService();