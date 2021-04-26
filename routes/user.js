const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")
const User = mongoose.model("User")

//Node API to see the profile of other users
router.get('/user/:id',requireLogin,(req,res)=>{
    console.log(req.params.id)
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        console.log(user)
        Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 console.log(err)
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

// Search users functionality
router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    console.log(userPattern)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})


module.exports = router