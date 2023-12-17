import { messageModel } from './models/messages.model.js';

class ChatManager {

    async addMessage(message){
        try 
        {
            await messageModel.create(message);
        } 
        catch (error) 
        {
            throw error;
        }
    };
}

export const chatManager = new ChatManager();