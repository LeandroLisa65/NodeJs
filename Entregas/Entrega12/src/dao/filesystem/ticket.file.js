import { promises } from 'fs'

class TicketManagerFile {
    constructor() {
        this.filename = './src/dao/filesystem/data/tickets.json'
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await promises.access(this.filename);
        } catch (error) {
            await promises.writeFile(this.filename, '[]');
        }
    }

    async getTickets() {
        try {
            const data = await promises.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            return tickets;
        } catch (error) {
            throw new Error('Error reading tickets file:', error);
        }
    }

    async getTicketById(tid) {
        try {
            const data = await promises.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            return tickets.find(ticket => ticket.id === tid);
        } catch (error) {
            throw new Error('Error reading tickets file:', error);
        }
    }

    async getTicketByCode(code) {
        try {
            const data = await promises.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            return tickets.find(ticket => ticket.code === code);
        } catch (error) {
            throw new Error('Error reading tickets file:', error);
        }
    }

    async generateTicket(ticket) {
        try {
            const data = await promises.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);

            if (ticket.code && ticket.purchase_datetime && ticket.amount && ticket.purchaser) {
                tickets.push({...ticket, id: tickets.length + 1,});
                await promises.writeFile(this.filename, JSON.stringify(tickets));
            } else {
                throw new Error("Need to add some features to add this");
            }
        } catch (error) {
            throw new Error('Error adding ticket:', error);
        }
    }
    
    async deleteTicket(tid) {
        try {
            const data = await promises.readFile(this.filename, 'utf8');
            const tickets = JSON.parse(data);
            const ticketToDelete = toclets.find(ticket => ticket.id === tid);

            if (ticketToDelete) {
                const updatedTickets = tickets.filter(ticket => ticket.id !== tid);
                await promises.writeFile(this.filename, JSON.stringify(updatedTickets));
            } else {
                throw new Error("There is no ticket with the id: " + tid);
            }
        } catch (error) {
            throw new Error('Error deleting ticket:', error);
        }
    }
}

export default TicketManagerFile;