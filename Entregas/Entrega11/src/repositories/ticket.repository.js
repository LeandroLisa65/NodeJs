import TicketDto from '../dto/ticket.dto.js'

class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(ticket){
        const ticketToAdd = new TicketDto(ticket)
        const result = this.dao.generateTicket(ticketToAdd)
        return result
    }

    async get(){
        const result = this.dao.getTickets()
        return result
    }

    async getById(tid){
        const result = this.dao.getTicketById(tid)
        return result
    }

    async getByCode(code){
        const result = this.dao.getTicketByCode(code)
        return result
    }

    async delete(tid){
        const result = this.dao.deleteTicket(tid)
        return result
    }
}

export default TicketRepository