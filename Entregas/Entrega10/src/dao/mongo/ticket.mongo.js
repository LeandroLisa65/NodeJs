import ticketModel from './models/ticket.model.js'

class TicketMongo{
    constructor(model){
        this.ticketModel = model
    }

    async getTickets(){
        try{
            return await ticketModel.find({})
        }catch (error) {
            return new Error(error)
        }
    }

    async getTicketById(tid) {
        try{
            return await ticketModel.findById({_id: tid})
        }catch (error) {
            return new Error(error)
        }
    }

    async getTicketByCode(code) {
        try{
            return await ticketModel.findById({code: code})
        }catch (error) {
            return new Error(error)
        }
    }

    async generateTicket(ticket){
        try{
            return await ticketModel.create(ticket)
        }catch (error) {
            return new Error(error)
        }
    }

    async deleteTicket(tid){
        try{
            return await ticketModel.findOneAndDelete({_id: tid})
        }catch (error) {
            return new Error(error)
        }
    }
}

export default TicketMongo