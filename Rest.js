const mysql = require('mysql')
const crypto = require('crypto');
const hash = crypto.createHash('sha256');


function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
	console.log("Inside handle request")
    
    router.get("/hi",function(req,res){
        res.json({"Message" : "Hello World !"});
    })

    // get all users
    router.get("/users",function(req,res){
        var query = "SELECT * FROM ??";
        var table = ["users"];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });

    //get user by email
    router.get("/users/:email",function(req,res){
        var query = "SELECT ??,??,??,?? FROM ?? WHERE ??=?";
        var table = ["id","name","email","phone","users","email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error in mysql query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows,"errorCode":200});
            }
        });
    });

    // get user by userId
    router.get("/users/:id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["users","id",req.params.id];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });

    // get Bill of specific user with given id and bill type
    router.get("/bills/:type/:id", function(req,res){
        var doesUserExist = "SELECT * from ?? where id=?";
        var check = ["users",req.params.id];
        doesUserExist = mysql.format(doesUserExist,check);
        connection.query(doesUserExist,function(err,rows){
            var numRows = rows.length;
            if(numRows!=1){
                res.json({"error": true,"errorCode": "404" ,"message" : "User Does not exist"});
            }
            else{
                var query = "SELECT cust_id,number,bill_date,due_date,plan FROM ?? WHERE ??=? and ??=?";
                var type = req.params.type;
                var value;
                if(type == "mobileBill"){
                    value = 1;
                }
                else if(type == "landLineBill"){
                    value = 2;
                }
                else if(type == "creditCardBill"){
                    value = 3;
                }
                else if(type == "utilityBill"){
                    value = 4;
                }
                else{
                    value = 5;
                }
                console.log(type);
                var table = ["bills","cust_id",req.params.id,"bill_type",value];
                query = mysql.format(query,table);
                connection.query(query,function(err,rows){
                    if(err){
                        res.json({"Error": true, "Message" : "Error executing Mysql query"});
                    }
                    else{
                        res.json({"Error": false, "Message" : "Success", type : rows});
                    }
                });
            }
        });
    });

    // insert new bill with given id and type
    router.post("/bills/:type/:id", function(req,res){
        var doesUserExist = "SELECT * from ?? where id=?";
        var check = ["users",req.params.id];
        doesUserExist = mysql.format(doesUserExist,check);
        connection.query(doesUserExist,function(err,rows){
            var numRows = rows.length;
            if(numRows!=1){
                res.json({"error": true,"errorCode": "404" ,"message" : "User Does not exist"});
            }
            else{
                var type = req.params.type;
                var value;
                if(type == "mobileBill"){
                    value = 1;
                }
                else if(type == "landLineBill"){
                    value = 2;
                }
                else if(type == "creditCardBill"){
                    value = 3;
                }
                else if(type == "utilityBill"){
                    value = 4;
                }
                else{
                    value = 5;
                }
                
                var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES(?,?,?,?,?,?)";
                var table = ["bills","cust_id","bill_type","number","bill_date","due_date","plan",req.params.id,value,req.body.number,req.body.billDate,req.body.dueDate,req.body.plan];
                
                query = mysql.format(query,table);
                connection.query(query,function(err,rows){
                    if(err){
                        res.json({"error": true, "errorCode":"500","message" : "Error executing Mysql query"});
                    }
                    else{
                        res.json({"Error": false, "Message" : "Success", "value" : rows});
                    }
                });
            }
        });
    });    

    //create new user
    router.post("/createuser",function(req,res){
        var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
        var table = ["users","name","email","phone","password",req.body.name,req.body.email,req.body.phone,md5(req.body.password)];
        query = mysql.format(query,table);
        console.log(query);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });

    //user Login and session creation
    router.post("/login",function(req,res){
        var query = "SELECT * FROM ?? where ??=? and ??=?";
        var table = ["users","email",req.body.email,"password",md5(req.body.password)];
        query = mysql.format(query,table);

        connection.query(query,function(err,rows){
            var numRows = rows.length;
            if(numRows==1){
                res.json({"error" : false, "successCode" : "200","message" : "login Successfully"});
            }
            else{
                res.status(400).json({"error" : true, "errorCode" : "403" ,"message" : "login UnSuccessfully"});   
            } 
        });

    });

    //get bill_type list
    router.get("/getBillTypeList",function(req,res){
        var query = "SELECT name FROM ??";
        var table = ["bill_type"];
        
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "value" : rows});
            }
        });
    });

    //get bill information using id
    router.get("/users/bill/:id",function(req,res){
        var query = "select number,s.name,bill_date,due_date,plan from bills join bill_type as s where s.id=bill_type and cust_id=?";
        var table = [req.params.id];

        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
           if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query","error": err});
            } 
            else {
                res.json({"Error" : false, "Message" : "Success", "bills" : rows});
            } 
        });

    });

    //insert new bill of given user
    router.post("/users/bill/:id",function(req,res){
        var type = req.body.type;
        var value;
        if(type=="mobile bill"){
            value=1;
        }
        else
        if(type=="landline bill"){
            value=2;
        }
        else
        if(type=="card bill"){
            value=3;
        }
        else
        if(type=="utility bill"){
            value=4;
        }

        var query = "INSERT INTO bills(cust_id,bill_type,number,bill_date,due_date,plan) VALUES(?,?,?,?,?,?)";
        var table = [req.params.id,value,req.body.number,req.body.billDate,req.body.dueDate,req.body.plan];


        query = mysql.format(query,table);
        console.log(query);
        connection.query(query,function(err,rows){
            if(err){
                res.json({"error": true, "errorCode":"500","message" : "Error executing Mysql query","error":err});
            }
            else{
                res.json({"Error": false, "Message" : "Success", "result" : rows});
            }
        });

    })


}

module.exports = REST_ROUTER;