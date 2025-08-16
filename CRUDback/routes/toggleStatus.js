const express = require('express');
const User = require('../models/User');

const router = express.Router();

router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = {};
    if (status) updateData.status = status; // Correct field

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
