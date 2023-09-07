const fs = require('fs');
const path = 'Users.json';
class UserManager {

    async getUsers(){
        try{
            if(fs.existsSync(path))
            {
                const usersFile = fs.readFileSync(path, 'utf-8')
                return JSON.parse(usersFile);
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
            const users = await this.getUsers();
            let id;
            if(!users.length)
            {
                id = 1;
            }
            else
            {
                id = users[users.length-1].id + 1;
            }
            users.push({id,...user});
            await fs.promises.writeFile(path, JSON.stringify(users));
        } catch (error) {
            return error;
        }
    };

    async deleteUser(id) {
        try {
            const users = await this.getUsers();
            const newArrayUsers = users.filter(x => x.id !== id);
            if(users.length === newArrayUsers.length)
                return `User with id ${id} not found`;

            await fs.promises.writeFile(path, JSON.stringify(newArrayUsers));
            return `User with id ${id} removed`
        } catch (error) {
            return error;
        }
    };

    async getUserById(id) {
        try {
            const users = await this.getUsers();
            const user = users.find(x => x.id === id);
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
    course: 'Backend'
}

const user2 = {
    first_name: 'User2',
    last_name: 'User2',
    age: 33,
    course: 'Backend'
}

async function test(){
    const manager1 = new UserManager();
    console.log(await manager1.getUsers());
    await manager1.createUser(user1);
    console.log(await manager1.getUsers());
    await manager1.createUser(user2);
    console.log(await manager1.getUsers());
    console.log(await manager1.getUserById(2));
    console.log(await manager1.getUserById(3));
    console.log(await manager1.deleteUser(3));
    console.log(await manager1.deleteUser(1));
    console.log(await manager1.getUsers());
}
fs.unlink(path, (err) => {
  if (err) throw err //handle your error the way you want to;
  console.log('path/file.txt was deleted');//or else the file will be deleted
    });
test();