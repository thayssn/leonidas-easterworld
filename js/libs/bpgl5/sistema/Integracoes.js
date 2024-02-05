require.config({
  shim: {
    'facebook' : {
      exports: 'FB'
    }
  },
  paths: {
    'facebook': '//connect.facebook.net/en_US/all'
  }
})
require(['facebook']);

//define(['facebook'],function(FB) {
define([],function() {

	var object={};

	object.facebook={};

	object.facebook.init=function(appId) {
		(function(d, s, id) {
	                var js, fjs = d.getElementsByTagName(s)[0];
	                if (d.getElementById(id))
	                    return;
	                js = d.createElement(s);
	                js.id = id;
	                js.src = "//connect.facebook.net/pt_BR/all.js#xfbml=1&appId="+appId;
	                fjs.parentNode.insertBefore(js, fjs);
	            }(document, 'script', 'facebook-jssdk'));
/*
		FB.init({
			appId:appId,
		});
		FB.getLoginStatus(function(response) {
			console.log(response);
		});
*/
	}

	object.facebook.feed=function(data) {
		FB.ui(data,
		function(response) {
			if (response && response.post_id) {
				console.log('Published post!');
			} else {
				console.log('Post was not publised!');
			}
		});
	}

	return object;

});