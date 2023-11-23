import { Router } from "express";
import { clientsManager } from '../dao/Dao/MongoDb/clientsManager.js';

const router = Router();

router.get("/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const client = await clientsManager.findByUsername(username);
    if (!client) {
      return res.status(400).json({ message: "Client not found" });
    }
    res.status(200).json({ message: "Client", client });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:username", (req, res) => {
  res.send("Eliminando");
});

router.post("/", async (req, res) => {
  try {
    const createdClient = await clientsManager.create(req.body);
    res.status(200).json({ message: "Client", client: createdClient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.param("username", (req, res, next, username) => {
  const regex = /^[A-Za-z]+$/;
  if (!regex.test(username)) {
    res
      .status(400)
      .json({ message: "Invalid username. Only letters are allowed." });
  } else {
    next();
  }
});

export default router;
