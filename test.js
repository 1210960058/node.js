var http = require('http'),//httpオブジェクトのロード
	fs = require('fs'),
	ejs= require('ejs'),
	qs =require('querystring');
var setting = require('./setting');//setting.jsと言う外部ファイルを読み込む
var server = http.createServer();//サーバーオブジェクトの作成
var template = fs.readFileSync(__dirname + '/bbs.ejs','utf-8');
var posts = [];
function renderForm(posts,res){
	var date = ejs.render(template,{
		posts: posts
	});
	res.writeHead(200,{'Content-Type' : 'text/html'});
	res.write(date);
	res.end();
}
server.on('request',function(req, res){
	if(req.method === 'POST'){
		req.date = "";
		req.on("readable",function(){
			req.date += req.read();
		});
		req.on("end",function(){
			var query = qs.parse(req.date);
			posts.push(query.name);
			console.log(query.name)
			renderForm(posts, res);

		});
	} else{
		renderForm(posts,res);
	}


});
server.listen(setting.port,setting.host);//settingに書かれたポートとホストで待ち
console.log("server listning/////")//待ち状態を表すコンソールログ