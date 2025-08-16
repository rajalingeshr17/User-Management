const mongoose=require('mongoose');
const User=require('../models/User');
const express=require('express');
const router=express.Router()

router.delete('/:id',async(req,res)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
    }catch(err){
        res.status(500).json({ message: error.message });
    }
})

router.delete('/',async(req,res)=>{
    try{
        await User.deleteMany({});
    res.json({ message: "User deleted successfully" });
    }catch(err){
        res.status(500).json({ message: error.message });
    }
})

module.exports = router;