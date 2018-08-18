var store=require('store')

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
            var page=1;
            var skipSize=(page-1)*10;
            var limitSize=10;
            var pageNum=1;
            database.BoardModel.count({},function(err,count){
                pageNum=Math.ceil(count/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수
                database.BoardModel.find({}).sort({date:-1})//최신순
                                         .skip(skipSize)//현재 페이지 앞부분 스킵
                                          .limit(limitSize)//한 페이지당 몇개의 글
                                        .exec(function(err,results){
                    res.render('board',{contents:results,pages:pageNum});
                });
            });
        }else{
            res.render('err');//추가 실패..
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
               var page=1;
                var skipSize=(page-1)*10;
                var limitSize=10;
                var pageNum=1;
                database.BoardModel.count({},function(err,count){
                    pageNum=Math.ceil(count/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수
                    database.BoardModel.find({}).sort({date:-1})//최신순
                                             .skip(skipSize)//현재 페이지 앞부분 스킵
                                              .limit(limitSize)//한 페이지당 몇개의 글
                                            .exec(function(err,results){
                        res.render('board',{contents:results,pages:pageNum});
                    });
                });
           }else{
               res.render('err');
           }
    });
}
var contentdelete=function(req,res){
    console.log('contentdelete 호출됨');
    var database=req.app.get('database');
    var contentid=req.query.id;
    console.log('[%s] will be deleted:',contentid);
    database.BoardModel.remove({_id:contentid},function(err,results){
        if(results){
            var page=1;
            var skipSize=(page-1)*10;
            var limitSize=10;
            var pageNum=1;
            database.BoardModel.count({},function(err,count){
                pageNum=Math.ceil(count/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수
                database.BoardModel.find({}).sort({date:-1})//최신순
                                         .skip(skipSize)//현재 페이지 앞부분 스킵
                                          .limit(limitSize)//한 페이지당 몇개의 글
                                        .exec(function(err,results){
                    res.render('board',{contents:results,pages:pageNum});
                });
            });
        }else{
            res.render('err');
        }
    });
}

var contentsearch=function(req,res){
    console.log('contentsearch 호출됨');
    var database=req.app.get('database');
    var searchElem=req.query.search;//searched value by user
    //var page=1;
    //var page=req.query.page;
    //console.log('cur page:',page);
    store.set('searchedItem',searchElem);
    console.log('request value from user in search():',searchElem);
    //if(page==null){page=1;}
    //var skipSize=(page-1)*10;
    var limitSize=10;
    var pageNum=1;
    database.BoardModel.aggregate([{$match:{$or:
                                          [
                                              {title:{$regex:new RegExp(searchElem,'i')}},
                                              {writer:{$regex:new RegExp(searchElem,'i')}},
                                              {coment:{$regex:new RegExp(searchElem,'i')}}
                                          ]
                                         }}],function(err,countedResults){
                    pageNum=Math.ceil(countedResults.length/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수

        database.BoardModel.aggregate([{$match:{$or:
                                              [
                                                  {title:{$regex:new RegExp(searchElem,'i')}},
                                                  {writer:{$regex:new RegExp(searchElem,'i')}},
                                                  {coment:{$regex:new RegExp(searchElem,'i')}}
                                              ]
                                             }},
                                      {$sort:{date:-1}},
                                       //{$skip:skipSize},
                                       {$limit:limitSize}
                                      ],function(err,results){
            console.log('찾은 글 수:%d 페이지 수:%d',countedResults.length,pageNum);
            res.render('boardsearched',{contents:results,pages:pageNum});
       // console.log('검색 결과:',results.length);
        /*if(results){
                var page=1;
                var skipSize=(page-1)*10;
                var limitSize=10;
                var pageNum=1;
                //database.BoardModel.count({},function(err,count){
                    pageNum=Math.ceil(results.length/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수
                    database.BoardModel.find({}).sort({date:-1})//최신순
                                             .skip(skipSize)//현재 페이지 앞부분 스킵
                                              .limit(limitSize)//한 페이지당 몇개의 글
                                            .exec(function(err,results){
                        res.render('board',{contents:results,pages:pageNum});
                    });
                //});
            
            //res.render('board',{contents:results});
        }else{
            
        }*/
        });
    });
}
var contentsearched=function(req,res){
    console.log('contentsearched 호출됨');
    var database=req.app.get('database');
    var page=req.query.page;
    searchElem=store.get('searchedItem');
    //contentsearch()에서 localStorage에 검색,저장된 값을 사용.
    console.log('request value from user in searched():',searchElem);
    console.log('cur page in searched:');
    if(page===null||page===undefined) page=1;
    var skipSize=(page-1)*10;
    var limitSize=10;
    var pageNum=1;
    database.BoardModel.aggregate([{$match:{$or:
                                          [
                                              {title:{$regex:new RegExp(searchElem,'i')}},
                                              {writer:{$regex:new RegExp(searchElem,'i')}},
                                              {coment:{$regex:new RegExp(searchElem,'i')}}
                                          ]
                                         }}],function(err,results){
                    pageNum=Math.ceil(results.length/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수

        database.BoardModel.aggregate([{$match:{$or:
                                              [
                                                  {title:{$regex:new RegExp(searchElem,'i')}},
                                                  {writer:{$regex:new RegExp(searchElem,'i')}},
                                                  {coment:{$regex:new RegExp(searchElem,'i')}}
                                              ]
                                             }},
                                      {$sort:{date:-1}},
                                       {$skip:skipSize},
                                       {$limit:limitSize}
                                      ],function(err,results){
            console.log('찾은 글 수:%d 페이지 수:%d',results.length,pageNum);
            res.render('boardsearched',{contents:results,pages:pageNum});
       // console.log('검색 결과:',results.length);
        /*if(results){
                var page=1;
                var skipSize=(page-1)*10;
                var limitSize=10;
                var pageNum=1;
                //database.BoardModel.count({},function(err,count){
                    pageNum=Math.ceil(results.length/limitSize);//전체 글 수 / 한 페이지 당 보여줄 글 수
                    database.BoardModel.find({}).sort({date:-1})//최신순
                                             .skip(skipSize)//현재 페이지 앞부분 스킵
                                              .limit(limitSize)//한 페이지당 몇개의 글
                                            .exec(function(err,results){
                        res.render('board',{contents:results,pages:pageNum});
                    });
                //});
            
            //res.render('board',{contents:results});
        }else{
            
        }*/
        });
    });
}
module.exports.contentwrite=contentwrite;
module.exports.contentwriteform=contentwriteform;
module.exports.contentread=contentread;
module.exports.contentmodify=contentmodify;
module.exports.contentmodified=contentmodified;
module.exports.contentdelete=contentdelete;
module.exports.contentsearch=contentsearch;
module.exports.contentsearched=contentsearched;
