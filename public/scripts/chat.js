$( document ).ready(function() {
  $.getJSON("api/user_data", function(data) {
    // Make sure the data contains the username as expected before using it
    if (data.hasOwnProperty('username')) {
      socket.emit('chat message', data.firstname+' ('+data.username+') connected');
      $('form').submit(function(){
        socket.emit('chat message', data.firstname + ': ' + $('#m').val());
        $('#m').val('');
        return false;
      });
    } else {
      socket.emit('chat message', 'an unregistered user connected');
      $('form').submit(function(){
        socket.emit('chat message', 'a guest: ' + $('#m').val());
        $('#m').val('');
        return false;
      });
    };
  });
  var socket = io();
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});