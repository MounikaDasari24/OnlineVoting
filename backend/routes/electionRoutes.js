import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Election from "../models/Election.js";

const router = express.Router();

// Create a new election (Admin only)
router.post("/", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied. Admins only." });
  console.log('Incoming request body:', req.body);

  const { name, startDate, endDate } = req.body;
  try {
    const election = await Election.create({
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
    });    
    res.status(201).json(election);
  } catch (error) {
    console.error('Error saving election:', error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Update an election (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied. Admins only." });

  const { name, date } = req.body;
  try {
    const election = await Election.findByIdAndUpdate(req.params.id, { name, date }, { new: true });
    res.status(200).json(election);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete an election (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  console.log("Deleting election with ID:", req.params.id); 
  console.log("req.user:", req.user); // Let’s see what’s inside req.user
console.log("isAdmin:", req.user?.isAdmin); // Specifically check isAdmin
  if (!req.user.isAdmin) return res.status(403).json({ message: "Access denied. Admins only." });

  try {
    await Election.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Election deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all elections
router.get("/", async (req, res) => {
  try {
    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get a single election by ID
router.get("/:id", async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    if (!election) return res.status(404).json({ message: "Election not found" });

    res.json(election);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch election", error });
  }
});

export default router;
