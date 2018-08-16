var boardfind=function(req,res){
    var database=req.app.get('database');
    console.log('bardfind 호출됨');
    database.BoardModel.find({},function(err,results){
        res.render('index',{results:results});
    });
}
var write=function(database,title,writer,contents,callback){
    var writing=new database.BoardModel({title:title,writer:writer,contents:contents});
    writing.save(function(err){//중복되는 폴더 없으면 추가.
        if(err){
            throw err;
        }else{
            console.log('글 작성함');
            console.log(writing);
            callback(null,writing);
        }
    });

}
var boardwrite=function(req,res){
    console.log('boardwirte 호출');
    var database=req.app.get('database');
    var writeTitle=req.body.title;
    var writeWriter=req.body.writer;
    var writeContents=req.body.contents;
    console.log(writeTitle,',',writeWriter,',',writeContents);
    write(database,writeTitle,writeWriter,writeContents,function(err,writing){
        if(writing){
            console.log('글 저장');
            database.BoardModel.find({},function(err,results){
                console.log(writing);
                res.render('board.ejs',{contents:results});//작성 글 반환해서 목록으로.
            });
        }else{
            res.render('index.ejs');//추가 실패..
        }
    });
}
var boardread=function(req,res){
    var database=req.app.get('database');
    var contentid=req.param('id');
    database.BoardModel.findOne({_id:contentid},function(err,results){
        if(err) throw err;
        results.count+=1;
        results.save(function(err){
            if(err) throw err;
            res.render('boardread.ejs',{contents:results});
        });
    });
}
module.exports.boardfind=boardfind;
module.exports.boardwrite=boardwrite;
module.exports.boardread=boardread;