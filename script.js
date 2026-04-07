const express = require("express");
const app = express();
app.use(express.json())
const jwt = require("jsonwebtoken");
const {auth,JWT_SECRET} = require("./auth")
const {UserModel, TodoModel} = require('./db')
const mongoose = require("mongoose")
mongoose.connect("!!enter your database connection link here")
console.log(UserModel)
app.post('/signup',async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name
  await UserModel.create({ 
    email: email,
    password: password,
    name:name
  })
  res.json({message:"your are logged in"})
})
app.post('/signin',async (req,res)=>{
  const email = req.body.email;
  const password = req.body.password;
  const user = await UserModel.findOne({
    email: email,
    password: password
  })
  console.log(user)
  if (user){
    const token = jwt.sign({
      id: user._id.toString()
    },JWT_SECRET);
    res.json({
      token:token
    })
  }else{
    res.status(403).json({message:"invalid credentials!! "})
  }
})
app.post('/todo',auth,async (req,res)=>{
  const userId = req.userId;
  const title = req.body.title;
  const done = req.body.done;
  await TodoModel.create({
    title:title,
    done:done
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
