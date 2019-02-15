// hey cam, this is a rooute file
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();



// brings and User model
require('../models/users');
const User = mongoose.model('users');


router.get('/', (req, res) =>{
  res.render('users/users')
})
//register
router.get('/register', (req, res)=>{
  res.render('users/register')
})
//dashboard
router.get('/dashboard', (req, res)=>{
  res.render('users/dashboard')
})
//Login form POST
router.get('/login', (req, res)=> {
  res.render('users/login')
})
//
// log user in
router.post("/userpage", (req, res, next) => {
  console.log('userpage');
  const theUsername = req.body.username;
  const thePassword = req.body.password;

  if (theUsername === "" || thePassword === "") {
    res.render("auth/login", {
      errorMessage: "Please enter both, username and password to sign up."
    });
    return;
  }

  User.findOne({ "username": theUsername })
  .then(user => {
      if (!user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist."
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        // Save the login in the session!
        // console.log('WHOOOOOOOOOOOOOOOOOOOOO');
        req.session.currentUser = user;
        res.redirect("/users/dashboard");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
  })
  .catch(error => {
    next(error);
  })
});
// Register Form POST
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if(user){
        console.log('user taken');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          email: req.body.email,
          password: req.body.password
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                res.redirect('/users/login');
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    }).catch(err => {console.log(err);});

})

module.exports = router
