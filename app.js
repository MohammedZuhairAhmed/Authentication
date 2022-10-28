require('dotenv').config();//stores environment variable
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");//more advanced than md5
const saltRounds = 10;//for salting the generated hashes

const app = express();

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb://0.0.0.0:27017/usersDB");

const dataSchema = new mongoose.Schema({
    email : String,
    password : String
});

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

    bcrypt.hash(req.body.password,saltRounds,function(err,hash){

        const email = req.body.username;
        const pass = hash;

        const user = new User({
            email : email,
            password : pass
        });

    user.save(function(err){
        if(err)
            console.log(err);
        else
            res.render("secrets");

        });    
    
    });

});

app.post("/login",function(req,res){
    const email = req.body.username;
    const pass = req.body.password;

    User.findOne({email : email},function(err,foundUser){
        if(err)
            console.log(err);
        else
        {
            if(foundUser)
            {
                bcrypt.compare(pass, foundUser.password, function(err, result) {
                    if(result === true)
                        res.render("secrets");
                    else
                        console.log(err);    
                });
            }
        }    
    });
});

app.listen("3000",function(req,res){
    console.log("server started");
});