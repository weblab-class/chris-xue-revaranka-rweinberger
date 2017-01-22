$(".blankstar").on("click", function() {
  var itemid = $(".id").attr('id');
  var starid = $(this).attr('id');
  console.log('clicked ' + starid);
  $(this).html("&#9733;");
  $.ajax({url:'/star', type: 'POST', data: {
    id: itemid
    }, success: function(data) {
      console.log('item '+itemid)
      window.location.href = data
    }
  });
});