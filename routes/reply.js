var replyadd=function(req,res){
    console.log('replyadd 호출됨');
    var database=req.app.get('database');
    var contentid=req.body.contentid;
    var reply=req.body.reply;
    console.log('글 id:%s 댓글내용:%s',contentid,reply);
    database.BoardModel.findOne({_id:contentid},function(err,results){
        if(err){throw err;}else{console.log('글 찾음');}
        results.comments.unshift({name:'글쓴이',memo:reply});
        results.save(function(err){
            if(err){throw err;}
            else{
                console.log('댓글 추가');
                res.redirect('back');
                //res.render('contentread',{reply:reply});
            }
        });
    });
}

var replyPage=function(req,res){
    console.log('replyPage 호출됨');
    var database=req.app.get('database');
    var id=req.query.id;
    var page=req.query.page;
    var max=req.query.max;
    var skipSize=(page-1)*5;//현 페이지보다 앞에 있는 글 skip
    var limitSize=5;//한 페이지에 출력할 총 댓글 수
    console.log(id,page,max,'%d,%d',skipSize,limitSize);

    database.BoardModel.findOne({_id:id},{comments:{$slice:[skipSize,limitSize]}},function(err,pageReply){
        if(err) throw err;
        console.log('founded',pageReply);
        res.send(pageReply.comments);
    });
}

module.exports.replyadd=replyadd;
module.exports.replyPage=replyPage;