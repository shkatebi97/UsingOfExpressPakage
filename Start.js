/**
 * Created by S.H.A.K on 8/3/2016.
 */
var fs = require('fs') ;
var session = require('express-session');
var express = require ('express') ;
var bodyParser = require ('body-parser');
var app =express();
var morgan = require( 'morgan');

var dataBase ={};
function enableDataBase()
{
    fs.readFile("C:/Users/S.H.A.K/Desktop/Node.JS/Courses/UsingOfExpressPakage/static/DataBase/DataBase.json" , function( err , data){
        if (err) {console.log(err);}
        else {
            dataBase = JSON.parse(data);
        }
    });
}

function saveDataBase()
{
    fs.writeFile("C:/Users/S.H.A.K/Desktop/Node.JS/Courses/UsingOfExpressPakage/static/DataBase/DataBase.json", JSON.stringify(dataBase) , function( err){
        if (err) {console.log(err);}
    });
}

app.use(session({secret : "secret", resave : false , saveUninitialized : true }));
app.use(morgan("dev"));
app.use(express.static(__dirname + "/static"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//app.use(bodyParser());

//var users = {sara : "love"};

app.use ("/", function (req, res, next) {
    //console.log(dataBase.toString());
    next();
});

app.post("/login", function (req, res, next) {
    //app.writeHead(200, {"Content-Type" : "text/html"});
    console.log(req.body);
    console.log(dataBase.toString());
    console.log(dataBase[1]);
    //var i=0
    if (req.session.auth)
    {
        resp.json({status : false , msg : "You are signed in before" });
        return;
    }
    for(var i = 0 ; i < dataBase.numberOfData ; i++)
    {
        if (dataBase.Data[i].username == req.body["username"])
        {
            if (dataBase.Data[i].password == req.body["password"])
            {
                console.log("Enter both ifs.\n");
                //res.sendFile("C:/Users/S.H.A.K/Desktop/Node.JS/Courses/UsingOfExpressPakage/static/login.html");
                req.session.auth = {username : dataBase}
                res.json({status: "true", msg: " you are signin now"});
                console.log("Signin successful");
                return;
            }
            else{console.log("Enter first if only.\n");
                //res.json({status: "false", msg: " you are NOT signin yet because your pass is incorrect."});
                //return;
            }
        }
        else
        {
            console.log("Do NOT enter any if.\n");
            //res.json({status: "false", msg: " you are NOT signin yet because your username is incorrect"});
            //return;
        }
    }
    res.json({status: "false", msg: " you are NOT signin yet"});
    console.log("Signin failed");
});

app.post("/signup" , function (req, res, next)
{
   if (req.body.username && req.body.password.length >= 4 && req.body.first_name && req.body.last_name && req.body.born_year >= 1990 && req.body.born_year<= 2016)
   {
       //var check = false;
       for(var i=0 ; i < dataBase.Data.length ; i++)
       {
           if (dataBase.Data[i].username === req.body.username)
           {
               res.json({ status : false , msg : "This Username is not available."});
               return;
           }
       }
       dataBase.Data.push(req.body);
       dataBase.numberOfData++;
       console.log(req.body);
       console.log(dataBase);
       res.json({ status : true , msg : "Now you are signed up"});
       saveDataBase();
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

app.get("/", function (req, res, next) {
    res.sendFile(__dirname + "/static/home.html");
});

app.listen(8000);
enableDataBase();
console.log(dataBase);
console.log("here we go...");