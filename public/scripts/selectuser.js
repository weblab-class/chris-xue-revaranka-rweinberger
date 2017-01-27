$(".selectuser").on("click", function() {
  console.log('hi');
  var targetUser = $(this).attr('id');
  $.getJSON("api/user_data", function(data) {
    var selectingUser = data.username;
    console.log(selectingUser + ' is initiating a conversation with '+targetUser);
    $.ajax({url:'/startchat', type: 'POST', data: {
      targetUser: targetUser,
      selectingUser: selectingUser
      }, success: function(data) {
        window.location.href = data
      }
    });
  });
});
