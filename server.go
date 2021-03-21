package main

import (
    "database/sql"
    "fmt"
    "net/http"
    "time"
    //"github.com/ffhelicopter/tmm/handler"
    "github.com/gin-contrib/sessions"
    "github.com/gin-contrib/sessions/cookie"
    //"https://github.com/gorilla/sessions"
    "github.com/gin-gonic/gin"
    //"github.com/gin-contrib/sessions/redis"
    //"encoding/json"
    "github.com/unrolled/secure"
    _ "github.com/go-sql-driver/mysql"
)
type Data_message struct{
    all_users int
    ports_80 int
    ports_3306 int
    ports_22 int
    ports_443 int
    ports_8080 int
    new_users int
}
type Sproxy_log struct{
    Userid int `json:"userId"`
    Userip string `json:"userip"`
    Userport int `json:"userport"`
    Serverport int `json:"serverport"`
    Starttime string `json:"starttime"`
}
//InsertLogs is a func to add log
 func InsertLogs(userip string,userport int,serverport int,starttime string) {
    //打开数据库
    fmt.Println(userip,userport,serverport,starttime)
    db, err := sql.Open("mysql", "用户名:密码@tcp(127.0.0.1:3306)/Sproxy")
    if err != nil {
        fmt.Println(err)
    }
    //延迟关闭数据库
    defer db.Close()
    //连接数据库
    db.Ping()

    //获取所有数据
    //stm, err := db.Prepare("INSERT INTO Sproxy_Logs VALUES (?,?,?,?)")
    db.Exec("INSERT INTO Sproxy_Logs VALUES (null,?,?,?,?)",userip,userport,serverport,starttime)
}
//DeleLogs is a func to dele log
func DeleLogs(userip string,userport int) {
    //打开数据库
    db, err := sql.Open("mysql", "用户名:密码@tcp(127.0.0.1:3306)/Sproxy")
    if err != nil {
        fmt.Println(err)
    }
    //延迟关闭数据库
    defer db.Close()
    //连接数据库
    db.Ping()

    //获取所有数据
    //stm, err := db.Prepare()
    db.Exec("DELETE FROM Sproxy_Logs WHERE userip=? AND userport=?",userip,userport)
}
//Cors is a func to cross site
func Cors() gin.HandlerFunc {
	return func(context *gin.Context) {
		method := context.Request.Method
		context.Header("Access-Control-Allow-Origin", "*")
		context.Header("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
		context.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		context.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Content-Type")
		context.Header("Access-Control-Allow-Credentials", "true")
		if method == "OPTIONS" {
			context.AbortWithStatus(http.StatusNoContent)
		}
		context.Next()
	}
}
//TlsHandler is func to use TLS
func TlsHandler() gin.HandlerFunc {
    return func(c *gin.Context) {
        secureMiddleware := secure.New(secure.Options{
            SSLRedirect: true,
            SSLHost:     "localhost:8081",
        })
        err := secureMiddleware.Process(c.Writer, c.Request)

        // If there was an error, do not continue.
        if err != nil {
            return
        }

        c.Next()
    }
}
//main is main
func main(){
    //var userip string = "127.0.0.1"
    //var userport int = 80
    //var serverport int = 8081
    //var starttime string
    //loctime:= time.Now()     //设置时区
    //starttime = loctime.Format("2006-01-02 15:04:05")
    //InsertLogs(userip,userport,serverport,starttime)
    //DeleLogs(userip,userport)
    db, err := sql.Open("mysql", "用户名:密码@tcp(127.0.0.1:3306)/Sproxy")
    if err != nil {
        fmt.Println(err)
    }
    db.SetMaxOpenConns(100)
    db.SetMaxIdleConns(50)
    db.Ping()
    
    router := gin.Default()
    // store, _ := redis.NewStore(10, "tcp", "127.0.0.1:6379", "", []byte("sdeaaafaw123"))
    // option := sessions.Options{MaxAge: 86400,
    //     Path: "/",
    //     Secure: true,
    //     HttpOnly: true}
    store := cookie.NewStore([]byte("afawg4345ilu"))
    router.Use(Cors())
    router.Use(TlsHandler())
    router.Use(sessions.Sessions("SproxySession", store))
    router.StaticFS("/assets", http.Dir("Admin/assets")) 
    router.StaticFS("/fonts", http.Dir("Admin/fonts")) 
    router.StaticFS("/vendors", http.Dir("Admin/vendors"))
    router.LoadHTMLFiles("Admin/Login.html","Admin/index.html","Admin/user-list.html")
	router.GET("/", func(c *gin.Context){
		c.HTML(http.StatusOK,"Login.html",gin.H{})
    })
    router.GET("/index.html", func(c *gin.Context){
		c.HTML(http.StatusOK,"index.html",gin.H{})
    })
    router.GET("/user-list.html", func(c *gin.Context){
		c.HTML(http.StatusOK,"user-list.html",gin.H{})
    })
    router.POST("/Login",func(c *gin.Context){
        session := sessions.Default(c)
        json := make(map[string]interface{}) //注意该结构接受的内容
        c.BindJSON(&json)
        username := json["username"]
        password := json["password"]
        fmt.Println(username)
        fmt.Println(password)
        verify := session.Get("sessionid")

        fmt.Println(verify)
        if (verify!=nil){
            fmt.Println("重复登录",verify)
            c.JSON(777, "重复登录")
            return
        }else{
            sql_sele := "SELECT username FROM Sproxy_AdminRooter WHERE username = ? AND password = ?"
        
            var true_username string 
            rows, err := db.Query(sql_sele,username,password)
            if err != nil {
                //fmt.Println("query faied, error:[%v]", err.Error())
                return
            }
            for rows.Next() { 
                rows.Scan(&true_username)
            }
            rows.Close()
            if (true_username==username){
                session.Set("sessionid",username)
                session.Save()
                verify := session.Get("sessionid")
                fmt.Println(verify)
                fmt.Println("登录成功")
                c.JSON(666,"登录成功")
            }else{
                fmt.Println("登录失败")
                c.JSON(444,"登录失败")
            }
        }
        
    })
    router.POST("/verify",func(c *gin.Context){
        session := sessions.Default(c)
        verify := session.Get("sessionid")
        if (verify==nil){
            fmt.Println("还没登录")
            c.JSON(444, "还没登录")
            return
        }else{
            c.JSON(666,verify)
        }
    })
    router.POST("/Logout",func(c *gin.Context){
        session := sessions.Default(c)
        session.Delete("sessionid")
        session.Save()
        c.JSON(666,"退出成功")
    })
    router.POST("/Data",func(c *gin.Context){
        session := sessions.Default(c)
        verify := session.Get("sessionid")
        if (verify==nil){
            fmt.Println("还没登录")
            c.JSON(444, "还没登录")
            return
        }
        var msg Data_message
            sql_sele := "SELECT count(userid) FROM Sproxy_Logs"
            err = db.QueryRow(sql_sele).Scan(&msg.all_users)
            sql_sele = "SELECT count(userid) FROM Sproxy_Logs WHERE userport = ?"
            err = db.QueryRow(sql_sele,80).Scan(&msg.ports_80)
            err = db.QueryRow(sql_sele,3306).Scan(&msg.ports_3306)
            err = db.QueryRow(sql_sele,22).Scan(&msg.ports_22)
            err = db.QueryRow(sql_sele,443).Scan(&msg.ports_443)
            err = db.QueryRow(sql_sele,8080).Scan(&msg.ports_8080)
            currentTime := time.Now()
            oldTime := currentTime.AddDate(0, 0, -2)
            var starttime string
            starttime = oldTime.Format("2006-01-02 15:04:05")
            sql_sele = "SELECT count(userid) FROM Sproxy_Logs WHERE starttime > ?"
            err = db.QueryRow(sql_sele,starttime).Scan(&msg.new_users)
            fmt.Println(msg)
            var otherports int
            otherports = msg.all_users-msg.ports_80-msg.ports_3306-msg.ports_22-msg.ports_443-msg.ports_8080
        c.JSON(200,gin.H{
            "status" :200,
            "error": nil,
            "all_users": msg.all_users,
            "ports_80": msg.ports_80,
            "ports_3306": msg.ports_3306,
            "ports_22": msg.ports_22,
            "ports_443": msg.ports_443,
            "ports_8080": msg.ports_8080,
            "new_users": msg.new_users,
            "ports_others":otherports,
        })
    })
    router.POST("/UserData",func(c *gin.Context){
        session := sessions.Default(c)
        verify := session.Get("sessionid")
        if (verify==nil){
            fmt.Println("还没登录")
            c.JSON(444, "还没登录")
            return
        }
        var num_users int
        // var userid,userport,serverport int
        // var userip,starttime string
            sql_sele := "SELECT count(userid) FROM Sproxy_Logs;"
            err = db.QueryRow(sql_sele).Scan(&num_users)
            alluser_data := make([]Sproxy_log, 0)
            var templog Sproxy_log
            sql_sele = "SELECT * FROM Sproxy_Logs;"
            rows ,err := db.Query(sql_sele)
            if err != nil {
                //fmt.Println("query faied, error:[%v]", err.Error())
                return
            }
            var i int
            i=0
            for rows.Next() {
                rows.Scan(&templog.Userid,&templog.Userip,&templog.Userport,&templog.Serverport,&templog.Starttime)
                alluser_data = append(alluser_data,templog)
                i=i+1
            }
            
            // data, err := json.Marshal(alluser_data)
            
            
            //fmt.Println(alluser_data)
        c.JSON(200,gin.H{
            "status" :200,
            "error": nil,
            "count":num_users,
            "data":alluser_data,
        })
    })
	router.RunTLS(":8081", "xxx.pem", "xxx.key") // listen and serve on 0.0.0.0:8081
}