// flash : this are temporary messages stored in the session  and once the flash msg is retrived form the session it will be removed from the session store this are one time messages (short-life msg) used to display the notification, alerts, warrnings and also used to pass the data form one rout to another rout

// can tranfer data from one rout to another
// display messages

//  app.use(flash())
//  req.flash("nameOfMsg", "msg")
//  req.flash("nameOfMsg")


const express = require("express");
const expressSession = require("express-session");
const flash = require("connect-flash");

const app = express();

const port = process.env.PORT || 3000;

app.set("view engine", "ejs");

app.use(express.static("./public"));

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "Sa30Key"
}))
app.use(flash());

app.get("/", (req, res) => {
    req.flash("successMessage", "you are loggedIn successfully"); // creating a flash msg name successMessage
    res.redirect("/protected");
});

app.get("/protected", (req, res) => {
    res.send(req.flash("successMessage")); //accessing the flash msg
})

app.get("/failed", (req, res) => {
    req.flash("age", 12);
    res.send("flash created");
})

app.get("/alert", (req, res) => {
    res.render("index")
})



app.listen(port, () =>{
    console.log(`server is listening on port ${port}`);
})