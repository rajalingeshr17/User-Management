const express=require('express')
const Item = require('../models/Item');

const router=express.Router()

const createUserRoute=require("./createUser.js");
const deleteUserRoute=require("./deleteUser.js")
const updateUserRoute=require("./updateUser.js")
const authRoute=require("./auth.js")
const statusRoute=require("./toggleStatus.js")
const readUserRoute=require("./readUser.js")
 
router.use('/createuser',createUserRoute);

router.use('/status',statusRoute)

router.use('/auth',authRoute);

router.use('/users',readUserRoute)

router.use('/update',updateUserRoute)

router.use('/delete',deleteUserRoute)

router.post('/items', async (req, res) => {
    try {
      const newItem = new Item(req.body);
      
      await newItem.save();
      res.status(201).json({ message: 'Item created successfully', item: newItem });
    } catch (err) {
      res.status(400).json({ message: 'Error creating item', error: err.message });
    }
  });
  

  router.get('/items', async (req, res) => {
    try {
      const items = await Item.find();
      res.status(200).json(items);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching items', error: err.message });
    }
  });
  


  router.put('/items/:id', async (req, res) => {
    try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item updated successfully', item: updatedItem });
    } catch (err) {
      res.status(500).json({ message: 'Error updating item', error: err.message });
    }
  });
  

  router.delete('/items/:id', async (req, res) => {
    try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting item', error: err.message });
    }
  });
  
  module.exports = router;