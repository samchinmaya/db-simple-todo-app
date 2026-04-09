const express = require("express");
const app = express();
const bcrypt = require("bcrypt")
app.use(express.json())
const jwt = require("jsonwebtoken");
const {auth,JWT_SECRET} = require("./auth")
const {UserModel, TodoModel} = require('./db')
const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://samchinmaya:nmapscan.chinmaya.2007@samchinmaya.wwsgise.mongodb.net/todo-app-database")
console.log(UserModel)
app.post('/signup',async (req,res)=>{
  const {email,password,name}= req.body;
  const saltRounds = 10;
  const hashedpass = await bcrypt.hash(password, saltRounds)
  await UserModel.create({ 
    email: email,
    password: hashedpass,
    name:name
  })
  res.json({message:"your are logged in"})
})
app.post('/signin',async (req,res)=>{
  const {email,password}= req.body;
  const user = await UserModel.findOne({email});
  if(!user){
    return res.status(403).json({message:"invalid credentials"})
  }
  const matchedPass = await bcrypt.compare(password,user.password);
  if (matchedPass){
    const token = jwt.sign({id:user._id},JWT_SECRET);
    res.json({token});
    
  }else{
    res.status(403).json({message:"invalid creds"})
  }
  
})
app.post('/todo',auth,async (req,res)=>{
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;
  await TodoModel.create({
    title:title,
    done:done,
    userId:userId
  })
  res.json({userId:userId})
})
app.get('/todos',auth,async (req,res)=>{
  const userId = req.userId;
  const todos = await TodoModel.find({
    userId:userId
  })
  if (todos){
    res.json({
      todos
    })

  }else{res.json({message:"there is no todo in your list "})}
})
app.listen(3000)
