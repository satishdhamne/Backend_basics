const express = require("express");
const app = express();
const expressSession = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");
const userModel = require("./users");

passport.use(new localStrategy(userModel.authenticate()))

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true })); // express can usenderstand the data and extended true enables the qs library to understand the complex data structure lile nested objects
app.use(express.json()); //parses the data into the json and ensures availablity in req.body

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret:"mySecreteKey"
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

app.get("/", (req, res) => {
    res.render("index");
})

app.post("/register", (req , res) =>{
    
    const userdata = new userModel({  //creats an instance of an userModel and inserts the userdata doc into the userModel db, it can't be automatically saved we need to explicitly save doc using save() method or register() method when using passport
        username: req.body.username, //populating the username and secret from req.body
        secret: req.body.secret
    })

    // userModel.register(userdata, req.body.password) //automatically adds the user data into the data base and performs the hashing for password 
    // .then(function (registereduser) {  
    //     passport.authenticate("local")(req, res, () => { // authenticate("local") automatically logins the user without submitting loggin request when user first time registers, so we don't want to fill the login form if the user already feeded the info into the register
    //         res.redirect("/profile")
    //     })
    // })

    userModel.register(userdata, req.body.password, (err, user) => {
         passport.authenticate("local")(req, res, () => {
            res.redirect("/profile")
         })
    })

})

// app.post("/login",passport.authenticate("local",{
//     successRedirect: "/profile",
//     failuarRedirect: "/"
// }), (req, res) => {})

    
//manually handling the login
app.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => { //checks the credentials and can return error, user(object contains the users data) and info (info: stores the details of the error like why the user is failed to login like invalid username or password, too many attempts )
        if(err) return next(err);
        if(!user) return res.redirect("/login");
        req.logIn(user, (err) => {  // creates the session and attaches the user object data into the session 
            if(err) return next(err);
            return res.redirect("/profile");
        })
    })(req, res, next); //calling immedietly req.lonIn() by passing req, res and next as arguments
})

app.get("/profile", isLoggedIn , (req, res) => {
    res.render("profile");
})

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        res.redirect("/");
    })
})

function isLoggedIn (req, res, next){
    if(req.isAuthenticated()){
       return next();
    }
    res.redirect("/");
}

app.listen(port, () => {
    console.log(`server is listening on port ${port}`);
})