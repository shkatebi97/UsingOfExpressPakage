
$(document).ready(function()
{
    var session={};

    //console.log("Yes");

    $("#login").click(function(){
        var username = $("#user").val();
        var password = $("#pass").val();
        $.post("/login", { username : username , password : password }, function(data){
            $("#info").append("<p>" + $("#user").val()+ " my love" + data.msg + "</p>");
            if(data.status)
            {
                Refresh(data.auth);
                return;
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
            if(status) {
                $("#info").append("<p>" + resp.msg + "</p>");
                if (data.status) {
                    session = data.auth;
                    //console.log(data.auth.toString());
                }
                Refresh();
            }
            else
            {
                $("#info").append("<p>" + resp.msg + "</p>");
            }
        });
    });
    $("#commentSubmit").click(function () {
        //console.log("Function Start");
        //console.log(getInfo());console.log(session.username);console.log($("#comment").val());
        if (session.username && $("#comment").val())
        {
            $("#Comments").html(" ");
            //console.log("Enter the if");
            console.log("Want to post request")
            $.post("/postComment" , {"comment" : $("#comment").val()}, function (data) {
                Refresh();
                if (!data.status)
                {
                    $("#info").append("<p>" + session.username + " my love" + data.msg + "</p>");
                }
            });

        }
    });
    $("#refreshcomment").click(function () {
        Refresh();
    });

    function Refresh(auth) {
        getInfo(auth);
        getComment();
    };
    function getInfo(authh) {
        if (!authh) {
            $.post("/getinfo", {}, function (data) {
                if (data.auth) {
                    $("#auth").html((data.auth.username));
                    if (data.status) {
                        //console.log("session is true");
                        session = data.auth;
                        return data.auth;
                    }
                    else {
                        //console.log("session is false");
                        session = {};
                        return {};
                    }
                }
            });
        }
        else
        {
            session = auth;
        }
    };
    function getComment(){
        $("#Comments").html(" ");
        console.log("Want to send request");
        $.post("/getcomment" , {} ,function (data) {
            for(var i=0 ; i < data.comments.length ; i++)
            {
                //console.log("Enter the first for\n");
                //console.log(data.comments.length);
                //console.log("Enter the second for");
                //console.log(atr);
                console.log("Request sent and this is the response" , data)
                $("#Comments").append("<h3>" + data.comments[i].username + ":" + "</h3>\n<p>" + data.comments[i].comment + "</p>");
            }
        });
    };

    Refresh();
})