
/*
 * 설정
 */

module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./board_schema', collection:'boards', schemaName:'BoardSchema', modelName:'BoardModel'},

	],
    //file:실행파일 path:route경로 method:함수이름 type:get or post #get, post 잘못 쓰면 인식 못함
    //nav 페이지 이동은 type:'get'으로.
	route_info: [
        {file:'./board',path:'/process/boardfind',method:'boardfind',type:'post'},
        {file:'./board',path:'/process/boardwrite',method:'boardwrite',type:'post'},
        {file:'./board',path:'/process/boardread',method:'boardread',type:'get'},
        {file:'./content',path:'/process/contentmodify',method:'contentmodify',type:'get'},
        {file:'./content',path:'/process/contentdelete',method:'contentdelete',type:'get'}
	],
	facebook: {		// passport facebook
		clientID: '196604394366966',
		clientSecret: '5401f32b378a3c464f12edadb04b768e',
        callbackURL: '/auth/facebook/callback',
        profileFields:['emails','name','id']

	},
}