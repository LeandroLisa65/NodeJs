import { userModel } from './models/users.model.js'
import { hashData } from '../../utils/bcrypt.js'
class UserManager{
    constructor(model){
        this.userModel = model
    }

    async getUsers(){
        try{
            return await userModel.find({})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserById(uid) {
        try{
            return await userModel.findById({_id: uid})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserByEmail(email) {
        try{
            return await userModel.findOne({email: email})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserByLogin(email, password){
        try{
            return await userModel.findOne({email: email, password: password})
        }catch (error) {
            return new Error(error)
        }
    }

    async getUserByCartId(cid){
        try{
            return await userModel.findOne({cart: cid})
        }catch(error){
            return new Error(error)
        }
    }

    async getInactiveUsers(option){
        try{
            return await userModel.find(option)
        }catch(error){
            return new Error(error)
        }
    }

    async addUser(user){
        try{
            return await userModel.create(user)
        }catch (error) {
            return new Error(error)
        }
    }

    async updateUser(email, password){
        try{
            const user = await this.getUserByEmail(email);

            if(!user)
                return null

            const hashedPassword = await hashData(password);

            user.password = hashedPassword;

            return await userModel.updateOne({_id:user._id}, user);
        }catch (error) {
            return new Error(error)
        }
    }

    async deleteUser(uid){
        try{
            return await userModel.findOneAndDelete({_id: uid})
        }catch (error) {
            return new Error(error)
        }
    }
}

export const userManager = new UserManager();