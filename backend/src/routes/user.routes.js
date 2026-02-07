import express from "express";
import auth from "../middlewares/auth.js";
import User from "../models/user.model.js";


const router =express.Router();
router.get("/profile",auth,async(req,res)=>{
    try{
        const user=await User.findById(req.userId).select("-password");
        return res.json(user);
    }
    catch(err){
        return res.status(500).json({message:"Server error "});
    }
});
router.post("/add-skill", auth, async (req, res) => {
  try {

    
    const { skill } = req.body;

    if (!skill) {
      return res.status(400).json({ message: "Skill is required" });
    }

    
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    user.skillsoffered.push(skill);

    await user.save();

    res.json({
      message: "Skill added",
      skillsOffered: user.skillsoffered
    });

  } catch (err) {
    console.log("ADD SKILL ERROR:", err);   
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/add-wanted-skill", auth, async (req, res) => {
  try {
    const { skill } = req.body;

    const user = await User.findById(req.userId);
    user.skillswanted.push(skill);
    await user.save();

    res.json({ message: "Wanted skill added", skillswanted: user.skillswanted });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;