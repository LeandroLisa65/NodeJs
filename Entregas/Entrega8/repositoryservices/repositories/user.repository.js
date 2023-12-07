import UserDto from './../../dto/user.dto.js'

class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    async create(newUser){
        const userToAdd = new UserDto(newUser)
        const result = await this.dao.addUser(userToAdd)
        return result
    }

    async get(){
        const result = await this.dao.getUsers()
        return result
    }

    async getById(id){
        const result = await this.dao.getUserById(id)
        return result
    }

    async getByEmail(email){
        const result = await this.dao.getUserByEmail(email)
        return result
    }

    async getByLogin(email, pass){
        const result = await this.dao.getUserByLogin(email, pass)
        return result
    }

    async update(uid, data){
        const result = await this.dao.updateUser(uid, data)
        return result
    }

    async delete(uid){
        const result = await this.dao.deleteUser(uid)
        return result
    }
}

export default UserRepository