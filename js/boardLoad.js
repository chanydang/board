//var date1;
$('#nav-board-tab').on('click',function(req,res){
    console.log('load!');
    
    $.ajax({
        url:'/process/boardfind',
        type:'get',
        success:function(contents){
            console.log(contents);
            var html='';
            html+='<table class="table table-sm table-hover">'
                    +'<thead>'
                    +'<tr>'
                    +'<th scope="col">No.</th>'
                    +'<th scope="col">Title</th>'
                    +'<th scope="col">Writer</th>'
                    +'<th scope="col">Date</th>'
                    +'<th scope="col">Count</th>'
                    +'</tr>'
                    +'</thead>'
                    +'<tbody>';
            
             if(typeof contents!=='undefined'){
                  contents.forEach(function(elem,i){
                      //date1=dateFormatChange(elem.date);
                      //console.log(date1);
              html+='<tr>'
                  +'<td>'+ ++i +'</td>'
                  +'<td><a href="/process/contentread?id='+elem._id+'">'+elem.title+'</a></td>'
                  +'<td>'+elem.writer+'</td>'
                  +'<td>'+elem.date+'</td>'
                  +'<td>'+elem.count+'</td>'
              +'</tr>';
              })
              }
          html+='</tbody>'
        +'</table>'
                                   
                                   
            console.log(contents);
            $("#nav-board").html(html);
        }
    })
});
function dateFormatChange(date){
                var option={
                    weekday:'short',year:'numeric',month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'
                };
                return date.toLocaleTimeString('ko-KR',option);
            }
/*
function load(){
    console.log('load!');
    $.ajax({
        url:'/process/boardfind',
        type:'get',
        success:function(contents){
            var html+=contents;
            
            $("#nav-profile").html(html);
        }
    })
}
*/

/*$(document).ready(function(){
    console.log('loaded');
    $('#forboard').click();
    console.log($('#forboard').text());
});*/



/*
window.onload = function(){
    //var button = document.getElementById('forboard');
    var btn=$('#forboard');
    //console.log(btn);
    setTimeout(function(){
        console.log('btn clicked');
        btn.click();
        console.log(btn.text());
    },1000);  // this will make it click again every 1000 miliseconds
};*/