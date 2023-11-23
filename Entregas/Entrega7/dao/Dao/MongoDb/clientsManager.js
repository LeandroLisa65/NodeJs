import { clientsModel } from '../../models/clients.model.js';

class ClientsManager {
  async findByUsername(username) {
    const response = await clientsModel.findOne({ username });
    return response;
  }

  async create(obj) {
    const response = await clientsModel.create(obj);
    return response;
  }
}

export const clientsManager = new ClientsManager();
