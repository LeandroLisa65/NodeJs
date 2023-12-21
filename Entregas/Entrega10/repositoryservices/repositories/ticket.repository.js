import TicketDto from '../../dto/ticket.dto.js'

class TicketRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(product){
        const ticketToAdd = new TicketDto(product)
        console.log(ticketToAdd)
        const result = this.dao.create(ticketToAdd)
        return result
    }
}

export default TicketRepository