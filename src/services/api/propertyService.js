import propertiesData from "@/services/mockData/properties.json";

class PropertyService {
  constructor() {
    this.properties = [...propertiesData];
  }

  // Simulate network delay
  delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.properties];
  }

  async getById(id) {
    await this.delay();
    const property = this.properties.find(p => p.Id === id);
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  }

  async create(propertyData) {
    await this.delay();
    const newId = Math.max(...this.properties.map(p => p.Id)) + 1;
    const newProperty = {
      Id: newId,
      ...propertyData,
      createdAt: new Date().toISOString(),
    };
    this.properties.push(newProperty);
    return { ...newProperty };
  }

  async update(id, propertyData) {
    await this.delay();
    const index = this.properties.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    this.properties[index] = { ...this.properties[index], ...propertyData };
    return { ...this.properties[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.properties.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    const deleted = this.properties.splice(index, 1)[0];
    return { ...deleted };
  }
}

export const propertyService = new PropertyService();