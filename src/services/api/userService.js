import usersData from "@/services/mockData/users.json";

class UserService {
  constructor() {
    this.users = [...usersData];
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.users];
  }

  async getById(id) {
    await this.delay();
    const user = this.users.find(u => u.Id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  }

  async create(userData) {
    await this.delay();
    const newId = Math.max(...this.users.map(u => u.Id)) + 1;
    const newUser = {
      Id: newId,
      ...userData,
      joinedDate: new Date().toISOString(),
      isActive: true,
    };
    this.users.push(newUser);
    return { ...newUser };
  }

  async update(id, userData) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    this.users[index] = { ...this.users[index], ...userData };
    return { ...this.users[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.users.findIndex(u => u.Id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    const deleted = this.users.splice(index, 1)[0];
    return { ...deleted };
  }

  async getTeamByUplineId(uplineId) {
    await this.delay();
    return this.users.filter(u => u.uplineId === uplineId);
  }
}

export const userService = new UserService();