const express = require("express");
const app = express();
let userModel = require("./users");
let postModel = require("./posts");

app.get("/", async (req, res) => {
 const userdoc = await userModel.create({
    username: "jimbe",
    email:"j20@mail.con",
    posts:[],
    fullname: "jimbe"
 })
 res.send(userdoc);
})


app.get("/createpost", async (req, res) => {
  const postdoc = await postModel.create({
        title: "do now",
        content: "don't take a singl moment of rest untill you make your dream come true",
        user: "67133cc3a3ba00400e0d59a0"
    })

  const user =  await userModel.findOne({_id: "67133cc3a3ba00400e0d59a0"})
  user.posts.push(postdoc._id)
  await user.save()

  res.send("done");
})


app.get("/userpost",async (req, res) => {
  const userwithpost = await userModel
                                      .findOne({_id: "67133cc3a3ba00400e0d59a0"}) 
                                      .populate('posts');
  res.send(userwithpost);
})

app.listen(3000);