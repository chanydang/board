function submitContents(option) {
    var title = $('#title').val();
    var contents = $('#contents').val();
    var writer = $('#writer').val();
    console.log(title,',',contents,',',writer);
    //var password = $('#pw').val();
    if(option == 'add') {
        // 새 글 등록 시
        if(title == '' || contents == '' || writer == '') {
            alert("제목과 내용, 작성자 비밀번호 모두 있어야합니다.");
            return;
        } else {
            $('#writeAction').submit();
        }
    }
}