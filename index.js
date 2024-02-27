// Module imports
const express = require('express');
const app = express();
app.use(express.json())
app.use(express.static('Views'));
const ejs = require('ejs');
const UserModel = require('./Models/UserLoginModel')
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
const bcrypt = require('bcryptjs')
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);


const store = new MongoDBStore({
  uri: process.env.CONN_STR,
  collection: "mySessions"
});

app.use(
  session({
    secret: "This is a secret",
    cookie: {
      maxAge: 1000 * 60 * 60
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

const checkAuth = (req,res,next)=>{
  if(req.session.isAthenticated){
    next()
  }
  else{
    res.redirect('signup')
  }
}

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard",checkAuth, (req, res) => {
  res.render("dashboard");
});


// Sign Up User
app.post('/signup',async(req,res)=>{
  try {
   const user =  await UserModel.create(req.body)
    res.redirect("login");
  } catch (error) {
    res.status(400).json({
      status:"fail",
      message:error.message
    })
  }
})


// Login User

app.post('/login',async (req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user) return res.redirect('signup');
    const isTrue = await bcrypt.compare(password,user.password);
    if(isTrue){
      req.session.personName = user.username;
      req.session.isAthenticated = true
      res.redirect('dashboard')
    }else{
      res.redirect('login');
    }
  } catch (error) {
    console.log(error);
  }
})


// logout

app.post('/logout',(req,res)=>{
  req.session.destroy((err)=>{
    if(err) throw err
    res.redirect('login')
  })
})


app.all('*',(req,res)=>{
  res.render('error')
})

module.exports = app;