/**
 * Created by S.H.A.K on 8/5/2016.
 */
$(document).ready(function()
{
    var session={};

    //console.log("Yes");

    $("#submit").click(function(){
        $.post("/login", {username : $("#user").val() , password : $("#pass").val() }, function(data){
            $("#info").append("<p>" + $("#user").val()+ " my love" + data.msg + "</p>");
            if(data.status)
            {
                session = data.auth;
                console.log(data.auth.toString());
            }
            Refresh();
        });
    });
    $("#logout").click(function () {
        $.post("/logout" , {} , function (data) {
            if (data.status)
            {
                session = {};
                $("#info").append("<p>" + $("#user").val()+ " my love" + data.msg + "</p>");
            }
            else
            {
                $("#info").append("<p>" + $("#user").val()+ " my love, somethings went WORNG. Is your connection still cinnected?" + "</p>");
            }
        });
    });
    $("#signup").click(function (){
        //console.log("Yes again");
        $.post("/signup", { "first_name" : $("#firstname").val() , "last_name" : $("#lastname").val() , "username" : $("#username").val() , "password" : $("#password").val() , "born_year" : $("#bornyear").val() } , function(resp){
            $("#info").append("<p>" + resp.msg + "</p>");
            if(data.status)
            {
                session = data.auth;
                //console.log(data.auth.toString());
            }
            Refresh();
        });
    });
    $("#commentSubmit").click(function () {
        //console.log("Function Start");
        //console.log(getInfo());console.log(session.username);console.log($("#comment").val());
        if (session.username && $("#comment").val())
        {
            $("#Comments").html(" ");
            //console.log("Enter the if");
            $.post("/postComment" , {"comment" : $("#comment").val()}, function (data) {
                Refresh();
                if (!data.status)
                {
                    $("#info").append("<p>" + $("#user").val()+ " my love" + data.msg + "</p>");
                }
            });

        }
    });
    $("#refreshcomment").click(function () {
        Refresh();
    });

    function Refresh() {
        getInfo();
        getComment();
    };
    function getInfo() {
        $.post("/getinfo", {} , function (data) {
            $("#auth").html((data.auth.username));
            if (data.status)
            {
                //console.log("session is true");
                session=data.auth;
                return data.auth;
            }
            else
            {
                //console.log("session is false");
                session = {};
                return {};
            }
        });
    };
    function getComment(){
        $("#Comments").html(" ");
        $.post("/getcomment" , {} ,function (data) {
            for(var i=0 ; i < data.comments.length ; i++)
            {
                console.log("Enter the first for\n");
                console.log(data.comments.length);
                for (var atr in data.comments[i])
                {
                    console.log("Enter the second for");
                    console.log(atr);
                    $("#Comments").append("<h3>" + atr.toString() + ":" + "</h3>\n<p>" + data.comments[i][atr] + "</p>");
                }
            }
        });
    };

    Refresh();
})