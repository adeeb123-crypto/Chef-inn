const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const { hash } = require('bcryptjs')
const jwt  = require('jsonwebtoken')
const {jwt_secret} = require('../keys')

router.get('/',(req,res) => {
    res.send("Hello Get Request.....!!")    
})


router.post('/signup',(req,res) => {
    const {name,email,password} = req.body //comes from the frontend
    if(!name || !email || !password){
        res.status(422).json({error:"Please enter the details"})
    }
    res.json({message:"Succefully posted...!!"})
    User.findOne({email:email})
    .then((savedUser) => {
        if(savedUser){
            return res.status(422).json({error:"User already exists"})
        }
        bcrypt.hash(password,12)
        .then(hashedPassword => {
            const user = new User({
                email,
                password:hashedPassword,
                name
            })
            user.save()
            .then(user => {res.json({message:"Saved User Successful"})
        })
            .catch(err =>{
                console.log("Eroor")
            })
        
        })

    
    }).catch(err => {
        console.log("You Dumb")
    })

})

router.post('/signin',(req,res) => {

    const {email,password} = req.body
    if(!email || !password){
       return res.status(422).json({error:"Please provide email and password"})
    }
    User.findOne({email:email})
    .then(savedUser => {
        if(!savedUser){
           return res.status(422).json({error:"Please provide email and password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch => {
            if(doMatch){
            // res.json({message:"Successfull sign in"})
            const token = jwt.sign({_id:savedUser._id},jwt_secret)
            res.json({token})
            }
            else{
                return res.status(422).json({error:"Please provide email and password"})
            }
        })
        .catch(err => {
            console.log("Error")
        })
    })

})
 


module.exports = router  