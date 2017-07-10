var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var db = require('./mysql.js');
var multer = require('multer')


app.use(express.static('html'));
app.use(express.static('img'));
app.use(bodyParser.urlencoded({ extended:false }));
var upload = multer({dest:"public/uploads/"}).single('image');

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://119.23.238.79");
    res.header("Accept", "application/json, text/javascript");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});
var urlencodedParser = bodyParser.urlencoded({extended:false});
//主页输出"Hello World"

app.get('/getData',function(req,res){
	var sql = 'SELECT * FROM article';
	db.query(sql,function(err,result){
		if(err){
			console.log(err);
			return;
		}
		res.send(result);
	})
});
app.get('/delData',function(req,res){
  var id = req.query.id;
  var sql = 'DELETE FROM article where id='+id;
  db.delete(sql,function(err,result){
    if(err){
      res.send({error:1,errMsg:'删除失败'});
      return;
    }
    res.send({error:0,errMsg:'删除成功',result:result});
  })
})
app.post('/addData',urlencodedParser,function(req,res){
	//输出JSON格式
	var addSqlParams = [req.body.article,req.body.type,req.body.author,req.body.picture];
	var sql =  'INSERT INTO article(id,article,type,author,picture) VALUES(0,?,?,?,?)';
	db.update(sql,addSqlParams,function(err,result){
		if(err){
			return;
		}
		res.send({error:0,errMsg:'新增成功'});
	})
	
})
//文件上传
app.post('/file_upload',upload, function (req, res) {
   var nowtime = Date.parse(new Date());
   var des_file = __dirname +'/img/' + nowtime + req.file.originalname;
   fs.readFile( req.file.path, function (err, data) {
   		console.log(des_file)
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
              var response = {
                   message:'File uploaded successfully', 
                   filename: nowtime + req.file.originalname
              };
          }
          console.log( response );
          res.send(response);
       });
   });
})
var server = app.listen(8081,function(){
	var host = server.address().address;
	var port = server.address().port;
	console.log('应用实例，访问地址为http://%s:%s',host,port);
});