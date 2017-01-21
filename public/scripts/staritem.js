$(".blankstar").on("click", function() {
  var itemid = $(".id").attr('id');
  var starid = $(this).attr('id');
  console.log('clicked ' + starid);
  $(this).html("&#9733;");
  $.ajax({url:'/home', type: 'POST', data: {
    id: itemid
    }, success: function(data) {
      window.location.href = data
    }
  });
});