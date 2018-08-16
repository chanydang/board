var boardfind=function(req,res){
    var database=req.app.get('database');
    console.log('bardfind 호출됨');
    database.BoardModel.find({},function(err,results){
        res.render('index',{contents:results});
    });
}

module.exports.boardfind=boardfind;
