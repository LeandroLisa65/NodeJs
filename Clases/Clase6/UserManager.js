import { createHash } from 'crypto';
import { readFileSync, existsSync, promises } from 'fs';
const path = './Users.json';
class UserManager {

    static IdGlobal = 1;
    async getUsers(queryObj){
        try{
            if(existsSync(path))
            {
                var {limit} = queryObj;
                const usersFile = readFileSync(path, 'utf-8')
                const userData = JSON.parse(usersFile);
                return limit ? userData.slice(0, +limit) : userData;
            }
            else 
            {
                return [];
            }
        }
        catch(error){
            return error;
        }
    }

    async createUser(user){
        try {
            const users = await this.getUsers({});
            const hashPassword = createHash('sha256').update(user.password).digest('hex');
            users.push({id: UserManager.IdGlobal++ ,...user, password: hashPassword});
            await promises.writeFile(path, JSON.stringify(users));
        } catch (error) {
            return error;
        }
    };

    async deleteUser(id) {
        try {
            const users = await this.getUsers({});
            const newArrayUsers = users.filter(x => x.id !== id);
            if(users.length === newArrayUsers.length)
                return `User with id ${id} not found`;

            await promises.writeFile(path, JSON.stringify(newArrayUsers));
            return `User with id ${id} removed`
        } catch (error) {
            return error;
        }
    };

    async getUserById(id) {
        try {
            const users = await this.getUsers({});
            const user = users.find(x => x.id == id);
            if(!user)
                return 'Not Found';
            return user;
        } catch (error) {
            return error;
        }
    };
}

//PROBANDO

const user1 = {
    first_name: 'User1',
    last_name: 'User1',
    age: 33,
    course: 'Backend',
    password: '12345'
}

const user2 = {
    first_name: 'User2',
    last_name: 'User2',
    age: 33,
    course: 'Backend',
    password: '123456'
}

export const manager = new UserManager();



