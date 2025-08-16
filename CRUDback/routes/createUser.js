const express=require('express');
const bcrypt=require('bcryptjs');
const User=require('../models/User');

const router=express.Router();

router.post('/',async(req,res)=>{
    try{
        const {name,email,password,confirmPassword}=req.body;

        if(!name || !email || !password || !confirmPassword){
            return res.status(400)
            .json({message:"Please provide all required fields"})
        }
        
        if(password !== confirmPassword){
            return res.status(400)
            .json({message:"Password do not matched"})
        }

        let user=await User.findOne({email});
        if(user){
            return res.status(400).json({ message: "User already exists" });
        }

        const salt=await bcrypt.genSalt(10)
        const hashedPass=await bcrypt.hash(password,salt);

        user=new User({name,email,password:hashedPass});
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;