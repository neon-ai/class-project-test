require('dotenv').config();
const express = require("express");
const app = express();
const port = 3000;
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.urlencoded());
app.use(express.static("public"));
app.set("view engine", "ejs");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);



app.get("/", function(req, res) {
  res.render("home")
});

app.route("/register")
  .get(function(req, res) {
    res.render("register")
  })
  .post(function(req, res) {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
        console.log("Account successfully created!");
      } else {
        console.log(err);
      }
    });
  });

app.route("/login")
  .get(function(req, res) {
    res.render("login")
  })
  .post(function(req, res) {
    username = req.body.username;
    password = req.body.password;
    User.findOne({email: username}, function(err, found) {
      if (err) {
        console.log(err);
      } else {
        if (found) {
          if (found.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });



app.listen(port, function() {
  console.log("Server is running.");
})
