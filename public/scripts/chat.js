$( document ).ready(function() {
  var socket = io();
  $.getJSON("/api/user_data", function(data) {
    // Make sure the data contains the username as expected before using it
    if (data.hasOwnProperty('username')) {
      socket.emit('chat message', data.firstname+' ('+data.username+') connected');
      $('form').submit(function(){
        socket.emit('chat message', data.firstname + ': ' + $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('disconnect', function(){
        socket.emit(data.firstname+' disconnected')
      });
    } else {
      socket.emit('chat message', 'an unregistered user connected');
      $('form').submit(function(){
        socket.emit('chat message', 'a guest: ' + $('#m').val());
        $('#m').val('');
        return false;
      });
      socket.on('disconnect', function(){
        socket.emit('a guest disconnected')
      })
    };
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });
});