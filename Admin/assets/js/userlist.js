$(document).ready(function(){

    var Login_http = new XMLHttpRequest();
    Login_http.open("POST","http://127.0.0.1:8081/verify",true);
    Login_http.setRequestHeader("Content-Type","application/json;charset=utf-8");
    Login_http.send();
    Login_http.onreadystatechange = function(){
        if (Login_http.readyState==4){
            if(Login_http.status==444){
                alert("还未登录")
                window.location.href = "http://127.0.0.1:8081";
            }else if(Login_http.status==666){
                var username = Login_http.responseText;
                // alert(username);
                $(".true_username").text(username);
                var data_http = new XMLHttpRequest();
                data_http.open("POST","http://127.0.0.1:8081/Data",true);
                data_http.setRequestHeader("Content-Type","application/json;charset=utf-8");
                data_http.send();
                data_http.onreadystatechange = function(){
                    if (data_http.readyState==4){
                        if(data_http.status==200){
                            var data_user = JSON.parse(data_http.responseText);
                            console.log(data_user);
                            $(".new_user").text(data_user["new_users"]);
                            $(".total_user").text(data_user["all_users"]);
                            $(".data_status").text(data_user["status"]);
                        }else{

                        }
                    }
                }
                var userdata_http = new XMLHttpRequest();
                userdata_http.open("POST","http://127.0.0.1:8081/UserData",true);
                userdata_http.setRequestHeader("Content-Type","application/json;charset=utf-8");
                userdata_http.send();
                userdata_http.onreadystatechange = function(){
                    if (userdata_http.readyState==4){
                        if(userdata_http.status==200){
                            var data_alluser = JSON.parse(userdata_http.responseText);
                            console.log(data_alluser);
                            var length = parseInt(data_alluser["count"]);
                            var dom_tbody = document.getElementById("userdata_body");
                            var dom_tbody_innerHTML = dom_tbody.innerHTML;
                            for(var i=0;i<length;i++){
                                dom_tbody.innerHTML = dom_tbody.innerHTML + "<tr><td></td><td>"+data_alluser["data"][i]["userId"]+"</td><td><a href='#'>"+data_alluser["data"][i]["userip"]+"</a></td><td>"+data_alluser["data"][i]["userport"]+"</td><td>"+data_alluser["data"][i]["serverport"]+"</td><td>"+data_alluser["data"][i]["starttime"]+"</td><td>TCP</td><td><span class='badge bg-success-bright text-success'>Active</span></td><td><a href='#' class='text-secondary' data-toggle='tooltip' title='Edit'><i class='ti-pencil'></i></a><a href='#' class='text-danger ml-2' data-toggle='tooltip' title='Delete'><i class='ti-trash'></i></a></td></tr>";
                            }
                        }else{

                        }
                    }
                }
            }
        }
    }

    

});

$("#logout").click(function(){
    var Logout_http = new XMLHttpRequest();
    Logout_http.open("POST","http://127.0.0.1:8081/Logout",true);
    Logout_http.setRequestHeader("Content-Type","application/json;charset=utf-8");
    Logout_http.send();
    Logout_http.onreadystatechange = function(){
        if (Logout_http.readyState==4){
            if(Logout_http.status==666){
                alert("退出成功")
                window.location.href = "http://127.0.0.1:8081";
            }
        }
    }
});