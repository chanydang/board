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

module.exports.replyadd=replyadd;