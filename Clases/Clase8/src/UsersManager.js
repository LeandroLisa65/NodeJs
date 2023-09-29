import { existsSync, promises } from "fs";
import { createHash } from "crypto";
import { log } from "console";
const path = "UsersFile.json";

class UsersManager {
  async getUsers(queryObj = {}) {
    const { limit } = queryObj;
    console.log("limit", limit);
    try {
      if (existsSync(path)) {
        const usersFile = await promises.readFile(path, "utf-8");
        console.log("usersFile", usersFile);
        const usersData = JSON.parse(usersFile);
        return limit ? usersData.slice(0, +limit) : usersData;
      } else {
        console.log("no existe el archivo");
        return [];
      }
    } catch (error) {
      console.log("error", error);
      return error;
    }
  }

  async createUser(user) {
    try {
      const users = await this.getUsers({});
      let id;
      if (!users.length) {
        id = 1;
      } else {
        id = users[users.length - 1].id + 1;
      }
      const hashPassword = createHash("sha512")
        .update(user.password)
        .digest("hex");

      const newUser = { id, ...user, password: hashPassword };
      users.push(newUser);
      await promises.writeFile(path, JSON.stringify(users));
      return newUser;
    } catch (error) {
      return error;
    }
  }

  async getUserById(id) {
    try {
      const users = await this.getUsers();
      console.log("users", users);
      const user = users.find((u) => u.id === id);
      console.log("user", user);
      return user;
    } catch (error) {
      console.log("error catch");
      throw new Error(error.message);
    }
  }

  async deleteUser(id) {
    try {
      const users = await this.getUsers({});
      const user = users.find((u) => u.id === id);
      if (user) {
        const newArrayUsers = users.filter((u) => u.id !== id);
        await promises.writeFile(path, JSON.stringify(newArrayUsers));
      }
      return user;
    } catch (error) {
      return error;
    }
  }

  async updateUser(id, obj) {
    try {
      const users = await this.getUsers({});
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) {
        return null;
      }
      const updateUser = { ...users[index], ...obj };
      users.splice(index, 1, updateUser);
      await promises.writeFile(path, JSON.stringify(users));
      return updateUser;
    } catch (error) {
      return error;
    }
  }
}

// PROBANDO LOS METODOS

const user1 = {
  first_name: "Juan",
  last_name: "Hoyos",
  age: 40,
  course: "JAVASCRIPT",
  password: "12345",
};

const user2 = {
  first_name: "Luis",
  last_name: "Abello",
  age: 35,
  course: "BACKEND",
  password: "abcde",
};

const user3 = {
  first_name: "Carlos",
  last_name: "Abello",
  age: 35,
  course: "BACKEND",
  password: "abcde",
};

const user4 = {
  first_name: "Laura",
  last_name: "Abello",
  age: 35,
  course: "BACKEND",
  password: "abcde",
};

const user5 = {
  first_name: "Camila",
  last_name: "Abello",
  age: 35,
  course: "BACKEND",
  password: "abcde",
};
// async function test() {
//   const manager = new UsersManager();
//   await manager.createUser(user1);
//   await manager.createUser(user2);
//   await manager.createUser(user3);
//   await manager.createUser(user4);
//   await manager.createUser(user5);
//   //const users = await manager.getUsers()
//   //console.log(users);
//   //await manager.deleteUser(1)
// }

// test();

export const manager = new UsersManager();
