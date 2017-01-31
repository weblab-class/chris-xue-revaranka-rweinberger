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

$('#newpass, #newpassconfirm').on('keyup', function () {
    if ($('#newpass').val() == $('#newpassconfirm').val()) {
        $('#message2').html('Matching').css('color', 'green');
        console.log('match')
        $('#resetbutton').prop('disabled',false);
    
    } else {
        $('#message2').html('Not Matching').css('color', 'red');
        console.log('no match')
        $('#resetbutton').prop('disabled',true);
    }
});





