const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/newassotiation");


const postShcema = mongoose.Schema({
    title: String,
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    creationdate:{
        type: Date,
        default:  Date.now()
    }
})

module.exports = mongoose.model("post", postShcema);