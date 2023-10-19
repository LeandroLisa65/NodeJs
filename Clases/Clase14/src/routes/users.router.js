import { Router } from "express";
import { manager } from "../UsersManager.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await manager.getUsers(req.query);
    res.status(200).json({ message: "Users found", users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await manager.getUserById(+id);
    console.log("user", user);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with the id provided" });
    }
    res.status(200).json({ message: "User found", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { first_name, course, password } = req.body;
  try {
    const response = await manager.createUser(req.body);
    res.status(200).json({ message: "User created", user: response });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const response = await manager.deleteUser(+idUser);
    if (!response) {
      return res
        .status(404)
        .json({ message: "User not found with the id provided" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:idUser", async (req, res) => {
  const { idUser } = req.params;
  try {
    const response = await manager.updateUser(+idUser, req.body);
    if (!response) {
      return res
        .status(404)
        .json({ message: "User not found with the id provided" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/signup", async (req, res) => {
  const { first_name, password } = req.body;
  if (!first_name || !password) {
    return res.status(400).json({ message: "Some data is missing" });
  }
  try {
    const response = await manager.createUser(req.body);
    res.redirect(`/api/views/user/${response.id}`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
