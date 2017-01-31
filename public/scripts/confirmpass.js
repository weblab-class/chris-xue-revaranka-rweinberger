$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() == $('#confirm_password').val()) {
        $('#message').html('Matching').css('color', 'green');
        console.log('match')
        $('#signupbutton').prop('disabled',false);
    
    } else {
        $('#message').html('Not Matching').css('color', 'red');
        console.log('no match')
        $('#signupbutton').prop('disabled',true);
    }
});




