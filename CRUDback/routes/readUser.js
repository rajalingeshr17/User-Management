const mongoose=require('mongoose')
const User=require('../models/User')
const express=require('express')

const router=express.Router();

router.get('/', async (req, res) => {
    try {
      const users = await User.find().select('-password');
      
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  module.exports = router;