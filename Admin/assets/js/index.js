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
                            $(".ports_80").text(data_user["ports_80"]);
                            $(".ports_22").text(data_user["ports_22"]);
                            $(".ports_443").text(data_user["ports_443"]);
                            $(".ports_3306").text(data_user["ports_3306"]);
                            $(".ports_8080").text(data_user["ports_8080"]);
                            $(".ports_others").text(data_user["ports_others"]);
                            cir_charts(data_user["ports_80"],data_user["ports_22"],data_user["ports_443"],data_user["ports_3306"],data_user["ports_8080"],data_user["ports_others"]);
                            stick_charts(data_user["ports_80"],data_user["ports_22"],data_user["ports_443"],data_user["ports_3306"],data_user["ports_8080"],data_user["ports_others"]);
                        }else{

                        }
                    }
                }
            }
        }
    }

    

});
function stick_charts(port_80,port_22,port_443,port_3306,port_8080,ports_others){
        var dom = document.getElementById("stick_charts");
        var myChart = echarts.init(dom);
        var app = {};
        option = null;
        option = {
            legend: {},
            tooltip: {},
            dataset: {
                source: [
                    ['PORTS Distribution', 'Now'],
                    ['PORT 80', port_80],
                    ['PORT 22', port_22],
                    ['PORT 443', port_443],
                    ['PORT 3306', port_3306],
                    ['PORT 8080', port_8080],
                    ['PORT Others', ports_others],
                ]
            },
            xAxis: { type: 'category' },
            yAxis: {},
    
            series: [
                { type: 'bar' },
            ]
        };
        ;
        if (option && typeof option === "object") {
            myChart.setOption(option, true);
        }
}
function cir_charts(port_80,port_22,port_443,port_3306,port_8080,ports_others){
    var dom = document.getElementById("hotports");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    app.title = '环形图';
    
    option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['80','22','443','3306','8080','Others']
        },
        series: [
            {
                name:'端口分布',
                type:'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '30',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:port_80, name:'80'},
                    {value:port_22, name:'22'},
                    {value:port_443, name:'443'},
                    {value:port_3306, name:'3306'},
                    {value:port_8080, name:'8080'},
                    {value:ports_others, name:'Others'}
                ]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}
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