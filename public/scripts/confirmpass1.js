$('#password1, #confirm_password1').on('keyup', function () {
    if ($('#password1').val() == $('#confirm_password1').val()) {
        $('#message1').html('Matching').css('color', 'green');
        console.log('match')
        $('#signupbutton1').prop('disabled',false);
    
    } else {
        $('#message1').html('Not Matching').css('color', 'red');
        console.log('no match')
        $('#signupbutton1').prop('disabled',true);
    }
});




