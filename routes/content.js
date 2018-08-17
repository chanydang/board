var contentwriteform=function(req,res){
    res.render('contentwrite');
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
var contentwrite=function(req,res){
    console.log('contentwirte 호출');
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
var contentread=function(req,res){
    var database=req.app.get('database');
    var contentid=req.param('id');
    database.BoardModel.findOne({_id:contentid},function(err,results){
        if(err) throw err;
        results.count+=1;
        results.save(function(err){
            if(err) throw err;
            res.render('contentread.ejs',{contents:results});
        });
    });
}
var contentmodify=function(req,res){
    var database=req.app.get('database');
    console.log('contentmodify 호출됨');
    var contentid=req.param('id');//작성 글의 id를 가지고 찾음
    database.BoardModel.findOne({_id:contentid},function(err,results){
        if(err) throw err;
        res.render('contentmodify.ejs',{contents:results});
    });
}
var contentmodified=function(req,res){
    var database=req.app.get('database');
    console.log('contentmodified 호출됨');
    var title=req.query.title;
    var writer=req.query.writer;
    var contents=req.query.contents;
    var contentid=req.param('id');
    console.log('title:',title,'id:',contentid,',',writer);
    database.BoardModel.findOneAndUpdate(
       {_id:contentid},
       {$set:{title:title,writer:writer,contents:contents}},
        function(err,modified){
           if(err) throw err;
           if(modified){
               console.log('modified success');
                database.BoardModel.find({},function(err,results){
                    res.render('board.ejs',{contents:results});
                });
           }
    });

}
var contentdelete=function(req,res){
    var database=req.app.get('database');
    console.log('contentdelete 호출됨');
}
module.exports.contentwrite=contentwrite;
module.exports.contentwriteform=contentwriteform;
module.exports.contentread=contentread;
module.exports.contentmodify=contentmodify;
module.exports.contentmodified=contentmodified;
module.exports.contentdelete=contentdelete;