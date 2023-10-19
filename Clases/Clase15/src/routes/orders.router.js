import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {});
router.get("/:idOrder", async (req, res) => {});
router.post("/");
router.put("/:idOrder");
router.delete("/:idOrder");

export default router;
