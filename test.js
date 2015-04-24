var http = require('http'),//httpオブジェクトのロード
	fs = require('fs'),
	ejs= require('ejs'),
	qs =require('querystring'),
	dt=require('date-utils');
var setting = require('./setting');//setting.jsと言う外部ファイルを読み込む
var server = http.createServer();//サーバーオブジェクトの作成
var template = fs.readFileSync(__dirname + '/bbs.ejs','utf-8');
var dt;
var date = [];
var posts = [];
var massage = [];
function renderForm(posts,massage,date,res){
	var date = ejs.render(template,{
		posts: posts,
		massage: massage,
		date: date
	});
	res.writeHead(200,{'Content-Type' : 'text/html'});
	res.write(date);
	res.end();
}
server.on('request',doRequest);
server.listen(setting.port,setting.host);//settingに書かれたポートとホストで待ち
console.log("server listning/////")//待ち状態を表すコンソールログ

function doRequest(req, res){
	if(req.method === 'POST'){
		req.date = "";
		req.on("readable",function(){
			req.date += req.read();
		});
		req.on("end",function(){
			var query = qs.parse(req.date);
			posts.push(query.name);
			console.log(query.name);
			massage.push(query.message);
			console.log(query.message);
			dt = new Date();
			date.push(dt.toFormat("YYYY/MM/DD HH24時MI分SS秒"));
			renderForm(posts,massage,date, res);
			fs.appendFile('bbsLog.txt',query.name+query.massage+'\n','utf-8');
		});
	} else{
		renderForm(posts,massage,date,res);
	}


}
