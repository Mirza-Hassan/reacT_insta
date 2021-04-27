const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt =  require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/keys');
const requireLogin = require('../middleware/requireLogin');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const {SENDGRID_API,EMAIL} = require('../config/keys')

//Send email in node js using nodemailer & sendgrid
const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:SENDGRID_API
    }
}))

// set your first route
router.get('/', (req, res) => {
    res.send('Hello!');
});

//Creating Middleware to verify token
router.get('/protected',requireLogin, (req, res) => {
    res.send('Hello user');
});

//getting data in request body
router.post('/signup', (req, res) => {
    //console.log(req.body);
    const {name, email,password} = JSON.parse(req.body)
    if(!email || !password || !name){
        res.status(422).json({error:"please add all the fields"})
    }
    //Saving or posting data
    res.status(200).send({success: "All good!"})
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exits with that email"})
        }
        bcrypt.hash(password,12)        //Hashing Password
        .then(hashedpassword =>{
            const user = new User({
                email,
                password:hashedpassword,
                name
            })
            // Send email in node js using nodemailer & sendgrid 
            user.save()
            .then(user =>{
                transporter.sendMail({
                    to:user.email,
                    // from:"no-reply@insta.com", //your email address
                    // subject:"signup success",
                    // html:"<h1>welcome to instagram</h1>"
                })
                res.json({message:"saved successfully"})
            }) 
            .catch(err =>{
                console.log(err);
                })
            })    
        })
    .catch(err =>{
        console.log(err);
    })
});

// Creating Sign in/Login route
router.post('/signin', (req, res) =>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    }
    //res.status(200).send({success: "All good!"})
    User.findOne({email:email})
    .then(savedUser =>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch =>{
            if(doMatch){
                // res.json({message:"successfully signed in"});
                //Sending token using JWT
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET);
                const {_id,name, email}= savedUser
                res.json({token, user:{_id,name, email}});
            }
            else{
                return res.status(422).json({error:"Invalid Email or password"})                
            }
        })
        .catch(err =>{
            console.log(err);
        })
    })
});

// Creating reset-password route
router.post('/reset-password', (req, res) =>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err)
        }
        const token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken =token
            user.expireToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    // from:"no-reply@insta.com",   //your email address
                    subject:"password reset",
                    html:`<p>you requested for password reset</p>
                    <h5>click in this <a href="${EMAIL}/reset/${token}">Link</a> to reset password
                    `
                })
                res.json({message:"check your email"})
            })
        })
    })
});

// Creating new-password route
router.post('/new-password', (req, res) =>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
            user.password = hashedpassword
            user.resetToken  = undefined
            user.expireToken = undefined
            user.save().then((savedUser)=>{
                res.json({message:"password updated success"})
            })
        }).catch(err=>{
            console.log(err)
        })
    })
});

module.exports = router;
