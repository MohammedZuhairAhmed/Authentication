require('dotenv').config();//stores environment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");//encrypt the data according to the secret key value

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://0.0.0.0:27017/usersDB");

const dataSchema = new mongoose.Schema({
    email : String,
    password : String
});

dataSchema.plugin(encrypt,{secret : process.env.SECRET , encryptedFields : ["password"]});

const User = new mongoose.model("User",dataSchema);

app.get("/",function(req,res){
        res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){

    const email = req.body.username;
    const pass = req.body.password;

    const user = new User({
        email : email,
        password : pass
    });

    user.save(function(err){
        if(!err)
            res.render("secrets");
        else
            console.log(err);
    });

});

app.post("/login",function(req,res){

    const email = req.body.username;
    const pass = req.body.password;

    User.findOne({email : email},function(err,foundUser){

        if(!err)
        {
            if(foundUser)
            {
                if(foundUser.password === pass )
                    res.render("secrets");
            }
        }else
            console.log(err);

    });

});

app.listen("3000",function(req,res){
    console.log("server started");
});