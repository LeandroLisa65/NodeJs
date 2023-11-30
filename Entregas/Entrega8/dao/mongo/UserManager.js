import { userModel } from './models/users.model.js';

class UserManager
{

    async getUserById(uid) 
    {
        try
        {
            return await userModel.findById({_id: uid})
        }
        catch (error) 
        {
            return new Error(error)
        }
    }

    async getUserByEmail(email) 
    {
        try
        {
            return await userModel.findOne({email: email})
        }
        catch (error) 
        {
            return new Error(error)
        }
    }

    async addUser(user)
    {
        try
        {
            return await userModel.create(user)
        }
        catch (error) 
        {
            return new Error(error)
        }
    }
}

export const userManager = new UserManager();