import express from "express";
import Candidate from "../models/Candidate.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all candidates
router.get("/", async (req, res) => {
  try {
    const { electionId } = req.query;
    const candidates = await Candidate.find({ electionId });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get a single candidate by ID
router.get("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add a new candidate
router.post("/", authMiddleware, async (req, res) => {
  const { name, party, electionId } = req.body;

  if (!name || !party || !electionId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const candidate = new Candidate({ name, party, electionId });
    await candidate.save();
    res.status(201).json(candidate);
  } catch (error) {
    console.error(error); // Logs the actual error in the server console
    res.status(500).json({ message: "Failed to add candidate", error: error.message });
  }
});


// Update a candidate
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a candidate
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndDelete(req.params.id);
    if (!candidate) return res.status(404).json({ message: "Candidate not found" });
    res.json({ message: "Candidate removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
