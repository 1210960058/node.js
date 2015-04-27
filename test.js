var http = require('http'),//httpオブジェクトのロード
	fs = require('fs'),
	ejs= require('ejs'),
	qs =require('querystring'),
	dt=require('date-utils');
var setting = require('./setting');//setting.jsと言う外部ファイルを読み込む
var server = http.createServer();//サーバーオブジェクトの作成
var template = fs.readFileSync(__dirname + '/bbs.ejs','utf-8');
var dt;//現在時刻を入れるのに使用
var date = [];//書き込みが行われた時刻を保存する配列
var posts = [];//書き込んだ人の名前を保存する配列
var massage = [];//書き込んだメッセージを保存する配列



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

function doRequest(req, res){
	if(req.method === 'POST'){
		req.date = "";
		req.on("readable",function(){
			req.date += req.read();
		});
		req.on("end",function(){
			var query = qs.parse(req.date);
			posts.push(query.name);//書き込まれた名前をposts配列に追加
			console.log(query.name);//コンソールログで書き込まれた内容をターミナルに表示
			massage.push(query.message);//書き込まれたメッセージをmassage配列に追加
			console.log(query.message);//コンソールログで書き込まれた内容をターミナルに表示
			dt = new Date();//dtに現在時刻を代入
			date.push(dt.toFormat("YYYY/MM/DD HH24時MI分SS秒"));//date配列にプッシュ（追加）
			renderForm(posts,massage,date, res);//renderForm関数に引き渡す
			fs.appendFile('bbsLog.txt',query.name+query.message+dt.toFormat("YYYY年MM月DD日 HH24時MI分SS秒")+'\n','utf-8');//bbsLogに読み込んだ物を追記する
		});
	} else{
		renderForm(posts,massage,date,res);
	}


}
server.on('request',doRequest);
server.listen(setting.port,setting.host);//settingに書かれたポートとホストで待ち
console.log("server listning/////")//待ち状態を表すコンソールログ