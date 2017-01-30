// $( document ).ready(function() {
//   var socket = io();
//   $.getJSON("/api/user_data", function(data) {
//     // Make sure the data contains the username as expected before using it
//     if (data.hasOwnProperty('username')) {
//       socket.emit('chat message', data.firstname+' ('+data.username+') connected');
//       $('form').submit(function(){
//         socket.emit('chat message', data.firstname + ': ' + $('#m').val());
//         $('#m').val('');
//         return false;
//       });
//       socket.on('disconnect', function(){
//         socket.emit(data.firstname+' disconnected')
//       });
//     } else {
//       socket.emit('chat message', 'an unregistered user connected');
//       $('form').submit(function(){
//         socket.emit('chat message', 'a guest: ' + $('#m').val());
//         $('#m').val('');
//         return false;
//       });
//       socket.on('disconnect', function(){
//         socket.emit('a guest disconnected')
//       });
//     };
//   });
//   socket.on('chat message', function(msg){
//     $('#messages').append($('<li>').text(msg));
//   });
// });

$( document ).ready(function() {
  function updateScroll(){
    var element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
  };
  updateScroll();
  $.getJSON("/api/user_data", function(data) {
    // $('#messages').append($('<li>').text(data.firstname+' ('+data.username+') connected'));
    $('form').submit(function() {
      var chatid = $('.chatid').attr('id');
      var message = data.firstname + ': ' + $('#m').val();
      var sender = data.username;
      var users = $('.users').attr('id').split(',');
      console.log(users);
      if (users[0] === sender) {
        var receiver = users[1]
      } else {
        var receiver = users[0]
      };
      console.log('message sent to ' +receiver);
      console.log(message);
      $('#messages').append($('<li id="from-user">').text(message));
      updateScroll();
      $('#m').val('');
      $.ajax({url:'/message', type: 'POST', data: {
        chatid: chatid,
        message: message,
        sender: sender,
        receiver: receiver
        }, success: function(data) {
          window.location.href = data
        }
      });
      return false;
    });
  });
});