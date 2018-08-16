var contentmodify=function(req,res){
    var database=req.app.get('database');
    console.log('contentmodify 호출됨');
}
var contentdelete=function(req,res){
    var database=req.app.get('database');
    console.log('contentdelete 호출됨');
}

module.exports.contentmodify=contentmodify;
module.exports.contentdelete=contentdelete;