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

router.get('/register', (req, res)=>{
  res.render('users/register')
})
//Login form POST
router.get('/login', (req, res)=> {
  res.render('users/dashboard')
})

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
