$(document).ready(function() {
	$("#open-display").click(function(e) {
		e.preventDefault();
		$('#display').toggle();
	});

	$("#open-venmo").click(function(e) {
		e.preventDefault();
		$('#venmo').toggle();
	});

	$("#open-picture").click(function(e) {
		e.preventDefault();
		$('#new-picture').toggle();
	});

	$("#open-aboutme").click(function(e) {
		e.preventDefault();
		$('#about-me').toggle();
	});

	$("#open-password").click(function(e) {
		e.preventDefault();
		$('#display-pass').toggle();
	});
});
