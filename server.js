var express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var md5 = require('MD5')
var rest = require('./Rest.js')
var app = express()

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

function REST(){
   console.log("Inside Rest function")
   var self = this;
   self.connectMysql();
}

REST.prototype.connectMysql = function() {
	console.log("Inside connect mysql prototype")
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : '127.0.0.1',
        user     : 'root',
        password : 'root',
        database : 'bill',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
	console.log("Inside configureExpress prototype")
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      self.startServer();
}

REST.prototype.startServer = function() {
	console.log("Inside start server")
      app.listen(3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
	console.log("Inside stop server")
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();