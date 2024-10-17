var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require("passport");
const localStrategy = require("passport-local")

passport.use( new localStrategy(userModel.authenticate()))

router.get("/", (req, res) => {
  res.render("index");
})

router.get("/profile", isLoggedIn , (req, res) => {
  res.render("profile")
})


router.post("/register", (req, res) => {
  const userdata = new userModel({
    username: req.body.username, 
    secret: req.body.secret 
  
  })

userModel.register(userdata, req.body.password)
  .then(function (registereduser){
      passport.authenticate("local")(req, res, () => {
        res.redirect("/profile")
      })
   })
});

router.post('/login',passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), (req, res) => {})


router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if(err) return next(err);
    res.redirect("/")
  })
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/")
  } 
}

module.exports = router;
