/**
 * 패스포트 설정 파일
 * 
 * 페이스북 인증 방식에 사용되는 패스포트 설정
 *
 * @date 2016-11-10
 * @author Mike
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var config = require('../config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
		clientID: config.facebook.clientID,
		clientSecret: config.facebook.clientSecret,
		callbackURL: config.facebook.callbackURL,
        profileFields: config.facebook.profileFields
	}, function(accessToken, refreshToken, profile, done) {
		console.log('passport의 facebook 호출됨.');
		console.dir(profile);
		
		var options = {
		    //criteria: { 'facebook.id': profile.id }
            'facebook.id': { $exists: true },
			'facebook.id': profile.id
		};
		
		var database = app.get('database');
	    database.UserModel.findOne(options, function (err, user) {
			if (err) return done(err);
      
			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
					email: profile.emails[0].value,
					provider: 'facebook',
					authToken: accessToken,
					facebook: profile._json
				});
                
                console.log('user 출력');
                console.log(user);
				
                user.save(function (err) {
					if (err) console.log(err);
					return done(err, user);
				});
			} else {
                console.log('user 출력');
                console.log(user);
				return done(err, user);
			}
	    });
	});
};