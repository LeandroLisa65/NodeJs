import { ticketModel } from './models/ticket.model.js'

class TicketMongoManager{
    constructor(model){
        this.ticketModel = model
    }

    async create(ticket){
        try{
            return await ticketModel.create(ticket)
        }catch (error) {
            return new Error(error)
        }
    }
}

export const ticketManager = new TicketMongoManager()