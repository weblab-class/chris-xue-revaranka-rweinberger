$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() == $('#confirm_password').val()) {
        $('#message').html('Matching').css('color', 'green');
        //$('#signup-form button[type=submit]').attr('disabled',false);
    
    } else 
        $('#message').html('Not Matching').css('color', 'red');
        //$('#signup-form button[type=submit]').attr('disabled',true);
});
