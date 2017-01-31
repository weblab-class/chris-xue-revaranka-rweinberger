$(function() {
	$("#login-form").submit(function(e) {
		e.preventDefault();
		var username = $("#login-form input[name=username]").val();
		var password = $("#login-form input[name=password]").val();
		$("#login-form button[type=submit]").attr('disabled', true);
		$.post("/login.json", {"username": username, "password": password}, function(cb) {
			window.location = '/home';
		}).fail(function (cb) {
			$("#login-form button[type=submit]").attr('disabled', false);
			if(cb.status == 401) {
				$('#login-flash').show();
			} else {
				// something else is wrong (dont have internet)
			}
		});
		return false;
	});


	$("#forgot-pass-form").submit(function(e) {
		e.preventDefault();
		$('#forgotpassword').toggle();
	});
});