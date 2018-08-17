var boardfind=function(req,res){
    var database=req.app.get('database');
    console.log('boardfind 호출됨');
    database.BoardModel.find({},function(err,results){
        res.render('board',{contents:results});
        //res.send(results);//boardLoad.js의 ajax에 results 넘김
    });
}

module.exports.boardfind=boardfind;
