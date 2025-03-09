import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Vote from "../models/Vote.js";

const router = express.Router();

// Cast a vote
router.post("/cast", authMiddleware, async (req, res) => {
  const { electionId, candidateId, voterId } = req.body;
  const userId = req.user.id;

  try {
    const existingVote = await Vote.findOne({ electionId, userId });
    if (existingVote) return res.status(400).json({ message: "You have already voted in this election" });

    const vote = await Vote.create({ electionId, candidateId, userId });
    res.status(201).json({ message: "Vote cast successfully", vote });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get votes for an election
router.get("/:electionId", authMiddleware, async (req, res) => {
  const { electionId } = req.params;

  try {
    const votes = await Vote.find({ electionId }).populate("candidateId", "name");
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get total votes for a candidate
router.get("/candidate/:candidateId", async (req, res) => {
  const { candidateId } = req.params;

  try {
    const totalVotes = await Vote.countDocuments({ candidateId });
    res.status(200).json({ candidateId, totalVotes });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
