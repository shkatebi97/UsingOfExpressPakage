/**
 * Created by S.H.A.K on 8/3/2016.
 */
var fs = require('fs') ;
var session = require('express-session');
var express = require ('express') ;
var bodyParser = require ('body-parser');
var morgan = require( 'morgan');
var dataBase = require('mongoose');
var app =express();



var newUser = [];
var comment = [];
var userSchema;
var User;


function enableDataBase() {
    //fs.readFile("C:/Users/S.H.A.K/Desktop/Node.JS/Courses/UsingOfExpressPakage/static/DataBase/DataBase.json" , function( err , data){if (err) {console.log(err);} else {dataBase = JSON.parse(data);}});
    dataBase.connect("mongodb://localhost/firsttry");
    var db = dataBase.connection ;
    db.on("error" , function () {console.log("There is an error in connecting to server");});
    db.once("connected" , function () {
        console.log("Data base is running...");
    });
    userSchema = dataBase.Schema({
        username : String ,
        password : String ,
        first_name : String ,
        last_name : String ,
        born_year : String
    });
    User = dataBase.model("user" , userSchema);
}
function saveDataBase(saveUser) {
    //fs.writeFile("C:/Users/S.H.A.K/Desktop/Node.JS/Courses/UsingOfExpressPakage/static/DataBase/DataBase.json", JSON.stringify(dataBase) , function( err){if (err) {console.log(err);}});
    if (saveUser == undefined)
    {
        var len = newUser.length;
        var i=0;
        for (users in newUser)
        {
            users.save(function(err ,user){
                if (err) {throw err;}
                i++;
                if (len === i)
                {
                    console.log(i + " new users saved.")
                }
            });
        }
        //console.log("all new users saved.");
    }
    else
    {
        saveUser.save(function(err , user){
            if (err){throw err;}
            console.log("user " + saveUser.username +" saved.");
        });
        //console.log("user " + saveUser.username +" saved.");
    }
}


enableDataBase();


app.use(session({secret : "secret", resave : false , saveUninitialized : true }));
app.use(morgan("dev"));
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", function (req, res, next) {
    res.sendFile(__dirname + "/static/home.html");
});


app.post("/login", function (req, res, next) {
    console.log("Enter login function");
    var body = req.body;
    console.log(body);
    //console.log(dataBase.toString());
    //console.log(dataBase[1]);
    //var i=0
    if (req.session.auth)
    {
        res.json({status : false , msg : "You are signed in before" });
        return;
    }
    console.log(User);
    User.find({username : body.username , password : body.password} , function(err , data){
        //res.sendFile("C:/Users/S.H.A.K/Desktop/Node.JS/Courses/UsingOfExpressPakage/static/login.html");
        if(data) {
            req.session.auth = {username: body.username};
            console.log("Signin successful");
            res.json({status: "true", msg: " you are signin now", auth: {username: body.username}});
            return;
        }
        else {
            console.log("Signin failed");
            res.json({status: "false", msg: "No such username or password"});
            return;
        }
    });
});

app.post("/signup" , function (req, res, next) {
    var body = req.body;
    console.log("post arrived");
   if (body.username && body.password.length >= 4 && body.first_name && body.last_name && body.born_year >= 1990 && body.born_year<= 2016)
   {
       console.log("Enter the if");
       //var check = false;
       User.find({username : body.username} , function (err, users) {
           console.log("in find function");
           if (err){console.log(err);return;}
           if (users.length)
           {
               console.log("user found");
               res.json({status : false , msg : "Username is not available"});
               return;
           }
           else
           {
               console.log("user not find");
               var newUserT = new User({
                   username : body.username,
                   password : body.password.toString(),
                   first_name : body.first_name,
                   last_name : body.last_name,
                   born_year : body.born_year
                });
               console.log("new user created");
               newUser.push(newUserT);
               console.log("user pushed");
               console.log(newUser);
               req.session.auth = {username : body.username};
               res.json({ status : true , msg : "Now you are signed up" , auth : {username : req.body.username}});
               saveDataBase(newUserT);
           }
       });
       return;
   }
   else
   {
       console.log("INVALID");
       console.log(req.body);
       res.json({ status : false , msg : "Now you are NOT signed up, invalid data"});
       return;
   }
});

app.post("/postComment" , function (req, res, next) {
    console.log("Comment came");
    if (req.session.auth.username)
    {
        var t = {};
        t[req.session.auth.username] = req.body.comment;
        comment.push(t);
        //res.json({comments : comment});
        res.json({status : true , msg : "Your comment submited"});
    }
    else
    {
        res.json({status : false , msg : "You are not login"});
    }
});

app.post("/getinfo", function (req, res, next) {
    if (req.session.auth) {
        res.json({status: true, auth: req.session.auth});
        console.log("in session true");
    }
    else{
        res.json({status: false, auth: req.session.auth});
        console.log("in session false");
    }
});

app.post("/getcomment" , function (req, res, next) {
    res.json({comments : comment});
});

app.post("/logout" , function (req, res, next) {
    delete req.session.auth;
    res.json({status : true , msg : "You have been loged out"});
})


app.listen(8000);
console.log("here we go...");