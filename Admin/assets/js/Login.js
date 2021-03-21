
$("#login-username").blur(function(){
    AntiSqlValid(this);
})
$("#login-password").blur(function(){
    AntiSqlValid(this);
})
$(document).ready(function(){
    var VerifyLogin_http = new XMLHttpRequest();
    VerifyLogin_http.open("POST","http://127.0.0.1:8081/verify",true);
    VerifyLogin_http.setRequestHeader("Content-Type","application/json;charset=utf-8");
    VerifyLogin_http.send();
    VerifyLogin_http.onreadystatechange = function(){
        if (VerifyLogin_http.readyState==4){
            if(VerifyLogin_http.status==444){

            }else if(VerifyLogin_http.status==666){
                window.location.href = "http://127.0.0.1:8081/index.html";
            }
        }
    }
})
$("#submit").click(function(){
    
                var username = $("#login-username").val();
                var password = $("#login-password").val();
                var Login_http = new XMLHttpRequest();
                Login_http.open("POST","http://127.0.0.1:8081/Login",true);
                Login_http.setRequestHeader("Content-Type","application/json;charset=utf-8");
                var tempdata={
                    "username":username,
                    "password":password
                }
                Login_http.send(JSON.stringify(tempdata));
                Login_http.onreadystatechange = function(){
                    if (Login_http.readyState==4){
                        if(Login_http.status==666||Login_http.status==777){
                            window.location.href = "http://127.0.0.1:8081/index.html";
                        }else{
                            alert("登录失败")
                        }
                    }
                }
            
        
        

    

});

function AntiSqlValid(oField)
{
    var re= /select|update|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%/i;
    if (re.test(oField.value) )
    {
        //alert("请您不要在参数中输入特殊字符和SQL关键字！"); //注意中文乱码
        oField.value = '';
        oField.className="errInfo";
        oField.focus();
        return false;
    }
}
function UrlSql(){
        //过滤URL非法SQL字符
    var sUrl=location.search.toLowerCase();
    var sQuery=sUrl.substring(sUrl.indexOf("=")+1);
    var re=/select|update|delete|truncate|join|union|exec|insert|drop|count|'|"|;|>|<|%/i;
    if(re.test(sQuery))
    {
        alert("请勿输入非法字符");
        location.href=sUrl.replace(sQuery,"");
    }
}
